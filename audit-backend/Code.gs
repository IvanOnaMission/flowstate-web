/**
 * Flowstate — Systemization Audit lead handler
 * Google Apps Script web app. Bound to the "Audit Leads" Google Sheet.
 *
 * Does three things on every audit submission:
 *   1. Appends the lead as a row in the Sheet (your running list)
 *   2. Emails the LEAD their proposal (their numbers + "Systems will set you free")
 *   3. Emails YOU their name + phone to follow up with a call
 *
 * Deploy: Extensions → Apps Script → paste this → Deploy → New deployment →
 *   Web app → Execute as: Me → Who has access: Anyone → Deploy → copy the URL.
 *   Paste that URL into LEAD_ENDPOINT in the audit page (audit/index.html).
 */

// ---- CONFIG (edit these) ----
var OWNER_EMAIL  = 'ivan@barnettdigital.co';                 // where YOUR lead alerts go
var BOOK_CALL_URL = 'https://calendly.com/barnettdigital';   // the "book a call" link in the lead's email
var SHEET_NAME   = 'Leads';
var FROM_NAME    = 'Ivan — Flowstate';

function doPost(e) {
  try {
    var d = readData(e);
    if (d.kind === 'priority') {
      updatePriority(d);              // they picked their #1 — drop it into the existing lead row
    } else {
      appendLead(d);
      if (d.email) sendLeadProposal(d);
      notifyOwner(d);
    }
  } catch (err) {
    // Never throw back to the browser — log so a bad row can't break capture.
    console.error(err);
  }
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function readData(e) {
  if (e && e.postData && e.postData.type === 'application/json') {
    return JSON.parse(e.postData.contents);
  }
  return (e && e.parameter) ? e.parameter : {};
}

function appendLead(d) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
        || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['When','Name','Phone','Email','Business','Employees',
                  'Hrs leaking','$ leaking','Proposal (10%)','Hourly rate','DB size','Avg job','Missing systems','Top priority']);
    sh.getRange(1,1,1,14).setFontWeight('bold');
  }
  sh.appendRow([new Date(), d.name||'', d.phone||'', d.email||'', d.business||'', d.employees||'',
                d.hrs_leaking||'', d.dollars_leaking||'', d.proposal||'',
                d.hourly_rate||'', d.db_size||'', d.avg_job||'', d.missing_systems||'', d.top_priority||'']);
}

// They tapped "the one thing I'd take off my plate first" — find their row by email and record it.
function updatePriority(d) {
  if (!d.email || !d.top_priority) return;
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh) return;
  var rows = sh.getDataRange().getValues();
  for (var r = rows.length - 1; r >= 1; r--) {           // bottom-up = most recent matching lead
    if (String(rows[r][3]).toLowerCase() === String(d.email).toLowerCase()) {
      sh.getRange(r + 1, 14).setValue(d.top_priority);
      MailApp.sendEmail(OWNER_EMAIL,
        '⭐ ' + (rows[r][1] || 'Lead') + ' picked their #1: ' + d.top_priority,
        (rows[r][1] || '') + ' (' + (rows[r][2] || '') + ') said the first thing they want off their plate is:\n\n  → ' + d.top_priority + '\n\nLead with that when you call them.');
      return;
    }
  }
}

function notifyOwner(d) {
  var subject = '🔥 New audit lead: ' + (d.name||'?') + (d.business ? ' — ' + d.business : '');
  var body =
    'Call them.\n\n' +
    'Name:      ' + (d.name||'') + '\n' +
    'Phone:     ' + (d.phone||'') + '\n' +
    'Email:     ' + (d.email||'') + '\n' +
    'Business:  ' + (d.business||'') + '\n' +
    'Team size: ' + (d.employees||'') + '\n\n' +
    'Leaking:   ' + (d.hrs_leaking||'') + '  ·  ' + (d.dollars_leaking||'') + '\n' +
    'Proposal:  ' + (d.proposal||'') + '\n\n' +
    "Systems they're MISSING:\n  - " + String(d.missing_systems||'').split(' | ').join('\n  - ');
  MailApp.sendEmail(OWNER_EMAIL, subject, body);
}

function sendLeadProposal(d) {
  var subject = "Your audit results — you're leaking " + (d.dollars_leaking||'') + ' a year';
  MailApp.sendEmail({ to: d.email, subject: subject, htmlBody: proposalHtml(d), name: FROM_NAME });
}

function proposalHtml(d) {
  var name = d.name || 'there';
  var biz = d.business || 'your business';
  var blue = '#0096FF', ink = '#0B0E14';
  var aiArr = String(d.ai_opportunities||'').split(' | ').filter(function(x){ return x; });

  var aiRows = aiArr.map(function(x){
    return '<tr>' +
      '<td valign="top" style="padding:7px 10px 7px 0;color:' + blue + ';font-size:16px;font-weight:700;line-height:1.5;">&#10003;</td>' +
      '<td style="padding:7px 0;font-size:15px;line-height:1.5;color:#222;">' + x + '</td></tr>';
  }).join('');
  var aiBlock = aiArr.length ?
    '<tr><td style="padding:10px 32px 0;">' +
      '<div style="background:#f3f8ff;border:1px solid #d9ecff;border-radius:14px;padding:20px 22px;">' +
        '<div style="font-size:11px;letter-spacing:1.4px;text-transform:uppercase;color:' + blue + ';font-weight:700;margin-bottom:4px;">What AI could do for you</div>' +
        '<div style="font-size:18px;font-weight:700;color:' + ink + ';margin-bottom:12px;">' + biz + ' — here\'s what we\'d put to work:</div>' +
        '<table role="presentation" cellpadding="0" cellspacing="0" width="100%">' + aiRows + '</table>' +
      '</div>' +
    '</td></tr>' : '';

  return '' +
  '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">You\'re leaking ' + (d.dollars_leaking||'') + ' a year — here\'s what AI could give back.</div>' +
  '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#eef1f5;">' +
    '<tr><td align="center" style="padding:28px 14px;">' +
      '<table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;font-family:Helvetica,Arial,sans-serif;">' +
        '<tr><td style="background:' + ink + ';padding:30px 32px;">' +
          '<div style="font-size:20px;font-weight:800;letter-spacing:-0.3px;color:#ffffff;">flow<span style="color:' + blue + ';">state</span></div>' +
          '<div style="color:' + blue + ';font-size:11px;letter-spacing:1.6px;text-transform:uppercase;margin-top:14px;">Your systemization audit</div>' +
          '<div style="color:#ffffff;font-size:26px;font-weight:700;line-height:1.15;margin-top:6px;">Hi ' + name + ' — here\'s your number.</div>' +
        '</td></tr>' +
        '<tr><td style="padding:28px 32px 4px;">' +
          '<div style="color:#555;font-size:16px;line-height:1.5;">Based on what you ticked, here\'s what it\'s costing ' + biz + ':</div>' +
          '<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:16px;">' +
            '<tr>' +
              '<td width="48%" valign="top" style="text-align:center;padding:16px 8px;background:#f3f8ff;border:1px solid #d9ecff;border-radius:12px;">' +
                '<div style="font-size:28px;font-weight:800;color:' + blue + ';line-height:1;">' + (d.time_leaking||'') + '</div>' +
                '<div style="color:#777;font-size:13px;margin-top:7px;line-height:1.4;">a year in wasted time<br>(' + (d.hrs_leaking||'') + ')</div>' +
              '</td>' +
              '<td width="4%"></td>' +
              '<td width="48%" valign="top" style="text-align:center;padding:16px 8px;background:#f3f8ff;border:1px solid #d9ecff;border-radius:12px;">' +
                '<div style="font-size:28px;font-weight:800;color:' + blue + ';line-height:1;">' + (d.revenue_leaking||'') + '</div>' +
                '<div style="color:#777;font-size:13px;margin-top:7px;line-height:1.4;">in your database<br>(recoverable revenue)</div>' +
              '</td>' +
            '</tr>' +
          '</table>' +
          '<div style="text-align:center;color:#999;font-size:13px;margin-top:12px;">Together &#8776; ' + (d.dollars_leaking||'') + ' a year.</div>' +
        '</td></tr>' +
        aiBlock +
        '<tr><td style="padding:24px 32px 0;">' +
          '<p style="font-size:16px;line-height:1.6;color:#222;margin:0 0 14px;">Here\'s the thing — none of that is gone for good. Every line above is a system you don\'t have <i>yet</i>. Put them in, and the time and money come back to you.</p>' +
          '<p style="font-size:16px;line-height:1.6;color:#222;margin:0;">I build these for trades businesses. Jump on a quick call and I\'ll map out exactly which to do first for ' + biz + ' — no charge.</p>' +
        '</td></tr>' +
        '<tr><td align="center" style="padding:28px 32px 6px;">' +
          '<a href="' + BOOK_CALL_URL + '" style="background:' + blue + ';color:#04121f;text-decoration:none;font-weight:700;font-size:16px;padding:15px 34px;border-radius:999px;display:inline-block;">Book a 15-min call &rarr;</a>' +
        '</td></tr>' +
        '<tr><td style="padding:20px 32px 4px;text-align:center;">' +
          '<div style="font-family:Georgia,\'Times New Roman\',serif;font-style:italic;font-size:22px;color:' + blue + ';">Systems will set you free.</div>' +
          '<div style="color:#999;font-size:13px;margin-top:6px;">— Ivan, Flowstate</div>' +
        '</td></tr>' +
        '<tr><td style="padding:18px 32px 30px;">' +
          '<div style="border-top:1px solid #eee;padding-top:14px;color:#aaa;font-size:12px;line-height:1.5;">Numbers are estimates from typical NZ trades workflows — we nail down your real figures on the call.</div>' +
        '</td></tr>' +
      '</table>' +
    '</td></tr>' +
  '</table>';
}

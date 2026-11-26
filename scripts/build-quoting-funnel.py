# RETIRED: the quoting funnel pages (/quoting-workbook/, /quoting-workbook/start/,
# /quoting-help/) were retired in favour of /ai-makeover/ and now 301 there
# (public/_redirects). Do not rerun this script: it would recreate stale pages
# and overwrite public/assets/quoting/funnel.css, which /ai-makeover/ uses.
"""Port the approved campaign design into this site's static export.

Run only when updating the campaign from its reviewed source. The generated
public files are deployable without running this script on Netlify.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('/Users/ivanbarnett/Flow State Lab/marketing/websites/quoting-funnel-preview.html')
html = SOURCE.read_text()
css = re.search(r'<style>(.*?)</style>', html, re.S).group(1)
css += '''
/* Final campaign spacing and readable supporting copy. */
label{font-size:14px!important}.card .small{font-size:12px!important}
.eyebrow{font-size:12px!important;letter-spacing:1.5px}
.hero>.card>p:not(.eyebrow){font-size:16px}.step .eyebrow{font-size:12px}
.hero h1{font-weight:650}.small{font-size:14px}
.legal{font-size:14px;line-height:1.8}.legal h1{font-size:44px}
.skip{position:absolute;left:20px;top:-100px}.skip:focus{top:15px;z-index:10;background:#0096ff;color:#081b29;padding:12px}
button:disabled{opacity:.48;cursor:not-allowed;transform:none!important;box-shadow:none!important}.launch-intro{text-align:left;border-left:3px solid #0096ff;padding:8px 24px;margin:32px 0}.launch-intro p{margin:12px 0}.honeypot{display:none}.video-placeholder p{max-width:45ch;margin:15px auto}
.calendly-inline-widget{min-width:320px;height:760px;margin:12px -12px 0;border-radius:10px;overflow:hidden}.booking h2{margin-top:0}
@media(max-width:800px){.calendly-inline-widget{height:1000px;margin:12px -18px 0}}
@media(max-width:800px){header{padding:20px 18px}.hero h1{font-size:42px;line-height:1.05}.hero h1 br{display:none}.hero{padding-top:8px;gap:16px}.hero>.card>p:not(.eyebrow){font-size:14px}.card{padding:24px}.hero .eyebrow{font-size:10px!important}.center>h1{font-size:42px}.book-caption{font-size:9px}}
'''
assets = ROOT/'public/assets/quoting'
assets.mkdir(parents=True, exist_ok=True)
(assets/'funnel.css').write_text(css)
js = re.search(r'<script>(.*?)</script>', html, re.S).group(1)
js = js[:js.index('function route()')]
js = js.replace("const hero=document.querySelector('.hero');", "const hero=document.querySelector('.hero');\nif(hero){") + '\n}\n'
(assets/'funnel.js').write_text(js)
for name in ['quoting-workbook.pdf', 'quoting-workbook-prompts.txt']:
    shutil.copyfile(Path('/Users/ivanbarnett/Flow State Lab/output/pdf')/name, assets/name)

header = '<a class="skip" href="#main">Skip to content</a><header><span class="brand">FLOWSTATE</span><span class="small">For electrical business owners</span></header>'
footer = '<footer><span>FLOWSTATE · New Zealand</span><span><a href="/about/">About Ivan</a> · <a href="/quoting-privacy/">Privacy</a> · <a href="mailto:ivan@flowstate.net.nz">Contact</a></span></footer>'
pages = {
 'workbook': ('quoting-workbook', 'Free AI quoting workbook for electricians | Flow State', 'Teach AI your quoting process with a practical workbook, ready-to-use prompts and real-job tests.'),
 'ready': ('quoting-workbook/start', 'Your quoting workbook | Flow State', 'Download your quoting workbook and learn the two ways to work through it with your AI.'),
 'call': ('quoting-help', 'AI quote preparation for electricians | Flow State', 'Book a free 30-minute call with Ivan about AI quote preparation for your electrical business.'),
}
for key, (route, title, description) in pages.items():
    section = re.search(r'<section id="'+key+r'"[^>]*>.*?</section>', html, re.S).group(0).replace(' hidden','')
    section = section.replace('../../output/pdf/', '/assets/quoting/')
    section = section.replace('Get my workbook now', 'Get my workbook')
    section = section.replace('The workbook, AI prompts and a video showing you where to start.', 'The workbook, ready-to-use AI prompts and clear instructions to get started.')
    section = section.replace('<button type="submit">', '<p id="form-hint" class="small">Enter your name, email and phone number to continue.</p><button type="submit" aria-describedby="form-hint" disabled>')
    section = section.replace('Privacy notice link to be added before launch.', 'Read our <a href="/quoting-privacy/">privacy notice</a>.')
    tracking = ''.join(f'<input type="hidden" name="fields[{param}]" value="">' for param in ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])
    section = section.replace('<form id="lead-form">', '<form id="lead-form" name="quoting-workbook" method="POST" action="https://app.kit.com/forms/9911837/subscriptions">'+tracking)
    section = section.replace('name="email"', 'name="email_address"').replace('name="name"', 'name="fields[full_name]"').replace('name="phone"', 'name="fields[phone]"')
    section = section.replace('name="fields[phone]" type="tel"', 'name="fields[phone]" type="tel" minlength="7" maxlength="30"')
    section = section.replace('name="fields[full_name]" autocomplete', 'name="fields[full_name]" maxlength="150" autocomplete')
    section = section.replace('name="email_address" type', 'name="email_address" maxlength="254" type')
    section = re.sub(r'<div class="watch">.*?</div><div class="video".*?</div>', '', section, flags=re.S)
    if key == 'ready':
        section = section.replace('Download your copy, then watch the walkthrough before you start.', 'Download your copy, then choose one of the two ways below to work through it with your AI.')
        section = section.replace('<h2>Choose how you want to work through it.</h2>', '<div class="launch-intro"><p class="eyebrow">Start here</p><h2>One quote. One step at a time.</h2><p>I’m Ivan. I help electrical business owners start using AI in their business. This workbook helps you capture the knowledge behind your quotes, so AI can help prepare the work for you to review.</p><p>Have one recent quote, its job notes and the costs behind it ready. Explain your decisions as you go. When something is missing, have AI ask you rather than guess.</p></div><h2>Choose how you want to work through it.</h2>')
        section = section.replace('Whichever route you choose, save the latest version of your quoting guide.', 'Before using it on a new job, test your guide against past quotes and correct any gaps. You still check the scope, quantities, pricing and final quote. Whichever route you choose, save the latest version of your quoting guide.')
    if key == 'call':
        section = section.replace('<div class="booking">', '<div class="launch-intro"><p class="eyebrow">Meet Ivan</p><h2>Still the person every quote comes back to?</h2><p>You know what the job needs, how long it should take and what can go wrong. Explaining all of that again for the next quote takes time.</p><p>I’m Ivan. I help electrical businesses capture that know-how and use AI to prepare drafts around their process. On a free call, we’ll look at where your time goes and whether there’s a useful place to start.</p></div><div class="booking">', 1)
    booking = '<script src="/assets/quoting/booking.js" defer></script>' if key in ('ready', 'call') else ''
    if key == 'call':
        section = section.replace('</div><div class="booking">', '</div><!-- VSL goes here, directly above the calendar. --><div class="booking"><h2>Pick a time that suits you.</h2>', 1)
    directory=ROOT/'public'/route
    directory.mkdir(parents=True, exist_ok=True)
    page=f'''<!doctype html><html lang="en-NZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><meta name="description" content="{description}"><meta name="robots" content="noindex,follow"><link rel="canonical" href="https://flowstate.net.nz/{route}/"><link rel="stylesheet" href="/assets/quoting/funnel.css"><script src="/assets/quoting/funnel.js" defer></script><script src="/assets/quoting/analytics.js" defer></script><script src="/assets/quoting/lead.js" defer></script>{booking}</head><body>{header}<main id="main">{section}</main>{footer}</body></html>'''
    (directory/'index.html').write_text(page)
print('Prepared 3 campaign routes, shared assets and downloads.')

"use client";

/*
 * /live/ page: Jordan's free live session for electrical business owners.
 * 1. The VSL, then name, email and phone. That submission ("live-session") is the lead:
 *    Meta Lead fires on it and netlify/functions/submission-created.mjs sends it to Kit,
 *    Twenty, tracking and the held Telegram alert.
 * 2. "Just before you go": the /essentials/ questions, all optional, one per screen.
 *    They post as "live-session-answers" when they finish, skip, or leave the page.
 * 3. You're in: date, time and add-to-calendar.
 * Contact details never reach the pixel or browser storage.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { questions } from "../essentials/questions";
import styles from "../essentials/quiz.module.css";
import live from "./live.module.css";
import { ANSWERS_FORM, CAMPAIGN, FORM_NAME, OFFER, SESSION, VIDEO, VIDEO_POSTER } from "./session";

type Screen = "signup" | "done" | `q${number}`;
type Details = { name: string; email: string; phone: string };
type Errors = Partial<Record<keyof Details, string>>;
type MetaClick = { fbclid?: string; fbc?: string; fbp?: string };

const TRACKED = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const EMPTY: Details = { name: "", email: "", phone: "" };

const production = () => ["flowstate.net.nz", "www.flowstate.net.nz"].includes(location.hostname);

function fbq(...args: unknown[]) {
  const f = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
  if (typeof f === "function") f(...args);
}

function metaClick(): MetaClick {
  const f = (window as unknown as { flowstateMetaClick?: () => MetaClick }).flowstateMetaClick;
  if (typeof f !== "function") return {};
  try {
    return f() || {};
  } catch {
    return {};
  }
}

/** UTMs from the ad URL, with the campaign pinned to this page. */
function tracking() {
  const params = new URLSearchParams(location.search);
  const out: Record<string, string> = { utm_source: "flowstate", utm_medium: "live-session" };
  for (const key of TRACKED) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  out.utm_campaign = CAMPAIGN;
  const content = out.utm_content || "";
  const adId = params.get("ad_id") || (/^\d{8,30}$/.test(content) ? content : "");
  if (adId) out.ad_id = adId.slice(0, 200);
  return out;
}

function validate(v: Details): Errors {
  const digits = v.phone.replace(/\D/g, "");
  const phoneOk = /^\+?[\d\s().-]+$/.test(v.phone) && digits.length >= 7 && digits.length <= 15;
  return {
    name: v.name ? "" : "Add your name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? "" : "Check your email address, it looks incomplete.",
    phone: phoneOk ? "" : "Add your mobile, including the 02 prefix.",
  };
}

/** Google Calendar and .ics links for the session. */
function calendarLinks() {
  const stamp = (iso: string) => iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const start = stamp(SESSION.startUtc);
  const end = stamp(SESSION.endUtc);
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", SESSION.title);
  google.searchParams.set("dates", `${start}/${end}`);
  google.searchParams.set("details", SESSION.calendarNote);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Flowstate//Live session//EN",
    "BEGIN:VEVENT",
    `UID:live-session-${start}@flowstate.net.nz`,
    `DTSTAMP:${start}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${SESSION.title}`,
    `DESCRIPTION:${SESSION.calendarNote}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return { google: google.toString(), ics: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}` };
}

const CAL = calendarLinks();

const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function LiveSession() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [fromLeft, setFromLeft] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [justChose, setJustChose] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const [soundOn, setSoundOn] = useState(false);
  const vsl = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const busy = useRef(false);
  const sent = useRef(false);
  const answersSent = useRef(false);
  const answersRef = useRef<Record<string, string>>({});
  const detailsRef = useRef<Details>(EMPTY);
  const navigated = useRef(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Plays muted as a preview (captions are burned in), like the Quote Machine page.
    if (!reduce.current) vsl.current?.play().catch(() => {});
  }, []);

  /** The first tap restarts the video from the top with sound. */
  function withSound() {
    const v = vsl.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setSoundOn(true);
  }

  // Prefill from the link, e.g. /live/?name=Jane%20Smith&email=jane@x.co.nz&phone=0211234567
  // (Kit emails and Meta can fill these in). Browser autofill works through the autocomplete attributes.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const get = (...keys: string[]) => keys.map((k) => p.get(k)?.trim() || "").find(Boolean)?.slice(0, 200) || "";
    const joined = [get("first_name"), get("last_name")].filter(Boolean).join(" ");
    const from = { name: get("name", "full_name") || joined, email: get("email"), phone: get("phone", "mobile") };
    if (!from.name && !from.email && !from.phone) return;
    queueMicrotask(() =>
      setDetails((d) => ({ name: d.name || from.name, email: d.email || from.email, phone: d.phone || from.phone })),
    );
  }, []);

  const go = useCallback((next: Screen, back = false) => {
    const swap = () => {
      busy.current = false;
      navigated.current = true;
      setFromLeft(back);
      setLeaving(false);
      setJustChose(null);
      setScreen(next);
      root.current?.scrollIntoView({ block: "start" });
    };
    if (reduce.current) swap();
    else {
      setLeaving(true);
      window.setTimeout(swap, 170);
    }
  }, []);

  /** Posts whatever they've answered, once. Beacon when the page is closing. */
  const sendAnswers = useCallback((beacon = false) => {
    const given = answersRef.current;
    if (answersSent.current || !sent.current || !Object.keys(given).length) return;
    answersSent.current = true;
    if (!production()) return;
    const d = detailsRef.current;
    const body = new URLSearchParams({ "form-name": ANSWERS_FORM, "bot-field": "", ...d, ...given });
    if (beacon && navigator.sendBeacon) {
      navigator.sendBeacon(location.pathname, body);
      return;
    }
    fetch(location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      keepalive: true,
    }).catch(() => {
      answersSent.current = false;
    });
  }, []);

  // Leaving halfway through still saves the answers they gave.
  useEffect(() => {
    const leave = () => sendAnswers(true);
    window.addEventListener("pagehide", leave);
    return () => window.removeEventListener("pagehide", leave);
  }, [sendAnswers]);

  const finish = useCallback(() => {
    sendAnswers();
    go("done");
  }, [go, sendAnswers]);

  const burst = useCallback(() => {
    const c = canvas.current;
    const box = root.current;
    const ctx = c?.getContext("2d");
    if (reduce.current || !c || !box || !ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = innerWidth;
    const H = innerHeight;
    c.width = W * dpr;
    c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(box);
    const colors = ["--gold", "--sky", "--text", "--gold"].map((v) => css.getPropertyValue(v).trim());
    const mark = box.querySelector(`.${styles.doneMark}`)?.getBoundingClientRect();
    const ox = mark ? mark.left + mark.width / 2 : W / 2;
    const oy = mark ? mark.top + mark.height / 2 : H / 3;
    const parts = Array.from({ length: 90 }, () => {
      const a = Math.random() * Math.PI * 2;
      const v = 3 + Math.random() * 8;
      return {
        x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4,
        w: 4 + Math.random() * 5, h: 7 + Math.random() * 7,
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.35,
        c: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    const t0 = performance.now();
    const frame = (t: number) => {
      const life = 1 - (t - t0) / 1700;
      ctx.clearRect(0, 0, W, H);
      if (life <= 0) return;
      for (const p of parts) {
        p.vy += 0.24; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save();
        ctx.globalAlpha = Math.min(1, life * 1.8);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!navigated.current) return;
    heading.current?.focus({ preventScroll: true });
    if (screen === "done") {
      const id = window.setTimeout(burst, 260);
      return () => window.clearTimeout(id);
    }
  }, [screen, burst]);

  const choose = useCallback(
    (i: number, label: string) => {
      if (busy.current) return;
      busy.current = true;
      const q = questions[i];
      answersRef.current = { ...answersRef.current, [q.field]: label };
      setAnswers(answersRef.current);
      setJustChose(q.field);
      try {
        navigator.vibrate?.(10);
      } catch {
        /* Not every phone allows it. */
      }
      fbq("trackCustom", "LiveSessionAnswer", { content_name: OFFER, question: q.field });
      window.setTimeout(() => (i + 1 < questions.length ? go(`q${i + 1}` as Screen) : finish()), reduce.current ? 150 : 440);
    },
    [go, finish],
  );

  // Number keys answer.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (!screen.startsWith("q")) return;
      const i = Number(screen.slice(1));
      const option = questions[i]?.options[Number.parseInt(e.key, 10) - 1];
      if (option) {
        e.preventDefault();
        choose(i, option.label);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, choose]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const v: Details = { name: details.name.trim(), email: details.email.trim(), phone: details.phone.trim() };
    const errs = validate(v);
    setErrors(errs);
    setDetails(v);
    detailsRef.current = v;
    const firstBad = (Object.keys(errs) as (keyof Details)[]).find((k) => errs[k]);
    if (firstBad) {
      document.getElementById(`live-${firstBad}`)?.focus();
      return;
    }
    if (sent.current) return go("q0");
    if (!production()) {
      sent.current = true;
      setStatus("Preview only. Your details haven't been sent.");
      return go("q0");
    }

    setSending(true);
    setStatus("");
    const click = metaClick();
    const body = new URLSearchParams({
      "form-name": FORM_NAME,
      "bot-field": "",
      ...v,
      ...tracking(),
      landing_path: location.pathname,
      fbclid: click.fbclid || "",
      fbc: click.fbc || "",
      fbp: click.fbp || "",
    });
    try {
      const res = await fetch(location.pathname, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      sent.current = true;
      const id = typeof window.crypto?.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
      fbq("track", "Lead", { content_name: OFFER }, { eventID: `lead-${id}` });
      go("q0");
    } catch {
      setStatus(`That didn't go through. Try again, or text Ivan on ${site.phone}.`);
    } finally {
      setSending(false);
    }
  }

  const sessionLine = (
    <ul className={live.facts}>
      <li><b>{SESSION.day}</b></li>
      <li>{SESSION.time}</li>
      <li>{SESSION.where}</li>
    </ul>
  );

  function renderScreen() {
    if (screen === "signup") {
      const field = (key: keyof Details, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <div className={`${styles.field} ${errors[key] ? styles.bad : ""}`}>
          <label htmlFor={`live-${key}`}>{label}</label>
          <input
            id={`live-${key}`}
            name={key}
            value={details[key]}
            onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))}
            aria-invalid={errors[key] ? true : undefined}
            aria-describedby={errors[key] ? `live-${key}-error` : undefined}
            {...props}
          />
          {errors[key] ? <p className={styles.err} id={`live-${key}-error`}>{errors[key]}</p> : null}
        </div>
      );
      return (
        <>
          <div className={live.hero}>
            <p className={live.eyebrow}>{SESSION.eyebrow}</p>
            <h1 ref={heading} tabIndex={-1} className={live.title}>
              {SESSION.headline.before}
              <mark>{SESSION.headline.mark}</mark>
              {SESSION.headline.after}
            </h1>
            <p className={live.sub}>{SESSION.subhead}</p>
            <p className={live.watch}>{SESSION.watch}</p>
          </div>
          <div className={live.video}>
            {VIDEO ? (
              <>
                <video
                  ref={vsl}
                  className="vsl"
                  aria-label="Jordan explains the live session"
                  data-name="Live session"
                  data-marks="25,50,75,100"
                  data-progress="sound-on"
                  src={VIDEO}
                  poster={VIDEO_POSTER || undefined}
                  muted
                  playsInline
                  preload="metadata"
                  controls={soundOn}
                  onVolumeChange={(e) => !e.currentTarget.muted && setSoundOn(true)}
                />
                {soundOn ? null : (
                  <button type="button" className={live.play} aria-label="Play the video with sound" onClick={withSound}>
                    <span className={live.pill}><span className={live.ring} aria-hidden="true" />Tap for sound</span>
                  </button>
                )}
              </>
            ) : (
              <div className={live.placeholder}>Video coming</div>
            )}
          </div>
          <div className={live.side}>
          {sessionLine}
          <form onSubmit={submit} noValidate className={live.form}>
            <h2 className={live.formTitle}>Save your spot</h2>
            <div className={styles.fields}>
              {field("name", "Your name", { autoComplete: "name", maxLength: 120 })}
              {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email", maxLength: 200, placeholder: "you@yourbusiness.co.nz" })}
              {field("phone", "Mobile", { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 40, placeholder: "021 123 4567" })}
            </div>
            <button type="submit" className={`${styles.btn} ${styles.wide}`} disabled={sending}>
              {sending ? "Saving…" : "Save my spot"} <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
            <p className={styles.status} role="status">{status}</p>
            <p className={live.price}>{SESSION.priceNote}</p>
            <p className={styles.small}>
              We&apos;ll use your details to send you the session link and reminders.{" "}
              <Link href="/quoting-privacy/">Privacy notice</Link>.
            </p>
          </form>
          </div>
        </>
      );
    }

    if (screen.startsWith("q")) {
      const i = Number(screen.slice(1));
      const q = questions[i];
      const chosen = answers[q.field];
      return (
        <>
          <div className={live.qTop}>
            {i > 0 ? (
              <button type="button" className={styles.back} onClick={() => !busy.current && go(`q${i - 1}` as Screen, true)}>
                <span aria-hidden="true">←</span> Back
              </button>
            ) : (
              <span className={`${styles.back} ${styles.spacer}`} aria-hidden="true">←</span>
            )}
            <button type="button" className={live.skip} onClick={() => !busy.current && finish()}>
              Skip
            </button>
          </div>
          {i === 0 ? (
            <p className={live.saved}>
              <Check /> You&apos;re in. Just before you go, a few quick ones so Jordan can pitch it right. All optional.
            </p>
          ) : null}
          <h2 ref={heading} tabIndex={-1}>{q.question}</h2>
          {q.note ? <p className={styles.lede}>{q.note}</p> : null}
          <div className={`${styles.opts} ${justChose === q.field ? styles.locked : ""}`} role="group" aria-label={q.question}>
            {q.options.map((o, j) => {
              const on = chosen === o.label;
              const cls = [styles.opt, on ? styles.chosen : "", on && justChose !== q.field ? styles.instant : ""].join(" ");
              return (
                <button
                  key={o.label}
                  type="button"
                  className={cls}
                  style={{ "--i": j } as React.CSSProperties}
                  aria-pressed={on}
                  onClick={() => choose(i, o.label)}
                >
                  <span className={styles.key} aria-hidden="true">{j + 1}</span>
                  <span className={styles.label}>{o.label}</span>
                  {o.level ? (
                    <span className={styles.lvl} aria-hidden="true">
                      {[1, 2, 3].map((n) => (
                        <b key={n} className={n <= (o.level ?? 0) ? styles.on : ""} />
                      ))}
                    </span>
                  ) : null}
                  <span className={styles.tick}><Check /></span>
                </button>
              );
            })}
          </div>
        </>
      );
    }

    const first = details.name.split(/\s+/)[0];
    return (
      <>
        <div className={styles.doneMark} aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle cx="26" cy="26" r="26" />
            <path d="M15 27l7.5 7.5L38 19" />
          </svg>
        </div>
        <h2 ref={heading} tabIndex={-1}>See you Tuesday{first ? `, ${first}` : ""}.</h2>
        <p className={styles.lede}>{SESSION.doneNote}{details.email ? ` We'll send it to ${details.email}.` : ""}</p>
        {sessionLine}
        {CAL ? (
          <div className={styles.ctaRow}>
            <a className={styles.btn} href={CAL.google} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
            <a className={live.ghost} href={CAL.ics} download="live-session.ics">Apple or Outlook</a>
          </div>
        ) : null}
      </>
    );
  }

  const asking = screen.startsWith("q");
  const qi = asking ? Number(screen.slice(1)) : 0;
  const pct = asking ? Math.max(3, ((qi + (justChose ? 1 : 0)) / questions.length) * 100) : 100;
  const screenClass = [styles.screen, fromLeft ? styles.fromLeft : "", leaving ? styles.leaving : ""].join(" ");

  return (
    <section ref={root} className={`${styles.quiz} ${live.page} ${screen === "signup" ? live.landing : ""}`} aria-label="Free live session sign-up">
      <canvas ref={canvas} className={styles.burst} aria-hidden="true" />
      <div className={`${styles.inner} ${live.inner} ${screen === "signup" ? live.wide : ""}`}>
        <header className={styles.top}>
          <div className={styles.topRow}>
            <Link href="/" className={styles.wordmark}>
              {site.name}
              <span>.</span>
            </Link>
            <span className={styles.count} aria-live="polite">
              {asking ? `Just before you go · ${qi + 1} of ${questions.length}` : ""}
            </span>
          </div>
          <div className={`${styles.bar} ${asking ? "" : styles.barHide}`} aria-hidden="true">
            <i className={styles.fill} style={{ width: `${pct}%` }} />
          </div>
        </header>
        <div className={styles.stage}>
          <div key={screen} className={`${screenClass} ${screen === "signup" ? live.signup : ""}`}>
            {renderScreen()}
          </div>
        </div>
      </div>
    </section>
  );
}

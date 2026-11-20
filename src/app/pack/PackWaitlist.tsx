"use client";

/*
 * /pack/ page: the waitlist for the free AI systems pack (Jordan's catalogue of 127 systems).
 * Same flow as /live/, with the pack cover in place of the video:
 * 1. Name, email and an optional mobile. That submission ("pack-waitlist") is the lead:
 *    Meta Lead fires on it and netlify/functions/submission-created.mjs sends it to Kit
 *    (pack-waitlist tag + "you're on the list" email), Twenty, tracking and the held Telegram alert.
 * 2. "Just before you go": the /essentials/ questions, all optional, one per screen.
 *    They post as "pack-waitlist-answers" when they finish, skip, or leave the page.
 * 3. You're on the list, plus a book-a-call card.
 * Contact details never reach the pixel or browser storage.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { questions } from "../essentials/questions";
import styles from "../essentials/quiz.module.css";
import live from "../live/live.module.css";
import own from "./pack.module.css";
import duo from "../essentials/duo.module.css";
import { CHEERS, useQuizSound } from "../essentials/duo";
import SoundButton from "../essentials/SoundButton";
import { ANSWERS_FORM, CAMPAIGN, COVER, FORM_NAME, OFFER, PACK } from "./pack";
import { FORM_NAME as LIVE_FORM, SESSION, VIDEO as LIVE_VIDEO, VIDEO_POSTER as LIVE_POSTER } from "../live/session";

type Screen = "signup" | "live" | "done" | `q${number}`;

/** The live-session offer shows only until the session starts, then the flow skips it. */
const liveOpen = () => Date.now() < Date.parse(SESSION.startUtc);

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

/** UTMs from the link (e.g. the Instagram bio link), with the campaign pinned to this page. */
function tracking() {
  const params = new URLSearchParams(location.search);
  const out: Record<string, string> = { utm_source: "flowstate", utm_medium: "pack-waitlist" };
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

/** Name and email are required. The mobile is optional, but checked if they give one. */
function validate(v: Details): Errors {
  const digits = v.phone.replace(/\D/g, "");
  const phoneOk = !v.phone || (/^\+?[\d\s().-]+$/.test(v.phone) && digits.length >= 7 && digits.length <= 15);
  return {
    name: v.name ? "" : "Add your name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? "" : "Check your email address, it looks incomplete.",
    phone: phoneOk ? "" : "Check your mobile, including the 02 prefix, or leave it blank.",
  };
}

/** Ivan's Calendly, the same 30-minute call as the other landing pages, prefilled with their details. */
function bookingLink(d: Details) {
  const url = new URL(PACK.calendly);
  if (typeof window !== "undefined") {
    const t = tracking();
    for (const key of TRACKED) if (t[key]) url.searchParams.set(key, t[key]);
  }
  if (d.name) {
    const [first, ...rest] = d.name.split(/\s+/);
    url.searchParams.set("name", d.name);
    url.searchParams.set("first_name", first);
    if (rest.length) url.searchParams.set("last_name", rest.join(" "));
  }
  if (d.email) url.searchParams.set("email", d.email);
  const digits = d.phone.replace(/\D/g, "");
  const phone = d.phone.trim().startsWith("+") ? `+${digits}` : digits.startsWith("0") ? `+64${digits.slice(1)}` : digits.startsWith("64") ? `+${digits}` : "";
  if (phone) url.searchParams.set("a1", phone);
  return url.toString();
}

const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function PackWaitlist() {
  const [screen, setScreen] = useState<Screen>("signup");
  const [fromLeft, setFromLeft] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [justChose, setJustChose] = useState<string | null>(null);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [joinedLive, setJoinedLive] = useState(false);
  const [joining, setJoining] = useState(false);
  const { soundOn, toggle: toggleSound, ding, fanfare } = useQuizSound();

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
  }, []);

  // Prefill from the link, e.g. /pack/?name=Jane%20Smith&email=jane@x.co.nz
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
    // Last step: "Hang on, before you go" offers the live session while it's still ahead.
    go(liveOpen() ? "live" : "done");
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
      const id = window.setTimeout(() => {
        burst();
        fanfare();
      }, 260);
      return () => window.clearTimeout(id);
    }
  }, [screen, burst, fanfare]);

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
      ding();
      fbq("trackCustom", "PackWaitlistAnswer", { content_name: OFFER, question: q.field });
      window.setTimeout(() => (i + 1 < questions.length ? go(`q${i + 1}` as Screen) : finish()), reduce.current ? 150 : 440);
    },
    [go, finish, ding],
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
      document.getElementById(`pack-${firstBad}`)?.focus();
      return;
    }
    const next: Screen = "q0";
    if (sent.current) return go(next);
    if (!production()) {
      sent.current = true;
      setStatus("Preview only. Your details haven't been sent.");
      return go(next);
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
      go(next);
    } catch {
      setStatus(`That didn't go through. Try again, or text Ivan on ${site.phone}.`);
    } finally {
      setSending(false);
    }
  }

  /**
   * One tap signs them up to the live session with the details they just gave, as the
   * "live-session" form, so they get its welcome email with the Meet link and Ivan gets
   * the live-session alert. Not a second Meta Lead.
   */
  async function joinLive() {
    if (joining) return;
    if (!production()) {
      setJoinedLive(true);
      return go("done");
    }
    setJoining(true);
    const body = new URLSearchParams({
      "form-name": LIVE_FORM,
      "bot-field": "",
      ...detailsRef.current,
      ...tracking(),
      landing_path: location.pathname,
    });
    try {
      const res = await fetch(location.pathname, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (!res.ok) throw new Error(String(res.status));
      setJoinedLive(true);
      fbq("trackCustom", "PackLiveSessionJoin", { content_name: OFFER });
      go("done");
    } catch {
      setStatus(`That didn't go through. Try again, or text Ivan on ${site.phone}.`);
    } finally {
      setJoining(false);
    }
  }

  function renderScreen() {
    if (screen === "signup") {
      const field = (key: keyof Details, label: React.ReactNode, props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <div className={`${styles.field} ${errors[key] ? styles.bad : ""}`}>
          <label htmlFor={`pack-${key}`}>{label}</label>
          <input
            id={`pack-${key}`}
            name={key}
            value={details[key]}
            onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))}
            aria-invalid={errors[key] ? true : undefined}
            aria-describedby={errors[key] ? `pack-${key}-error` : undefined}
            {...props}
          />
          {errors[key] ? <p className={styles.err} id={`pack-${key}-error`}>{errors[key]}</p> : null}
        </div>
      );
      return (
        <>
          <div className={live.hero}>
            <h1 ref={heading} tabIndex={-1} className={live.title}>
              {PACK.headline.before}
              <mark>{PACK.headline.mark}</mark>
              {PACK.headline.after}
            </h1>
            <p className={live.sub}>{PACK.subhead}</p>
          </div>
          <ul className={live.facts}>
            {PACK.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <div className={own.offer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={own.cover} src={COVER} alt="Cover of the Flow State Pack Catalogue: 127 packs, 13 areas of the business" width={909} height={1287} />
            <form onSubmit={submit} noValidate className={live.form}>
              <h2 className={live.formTitle}>{PACK.formTitle}</h2>
              <div className={styles.fields}>
                {field("name", "Your name", { autoComplete: "name", maxLength: 120 })}
                {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email", maxLength: 200, placeholder: "you@yourbusiness.co.nz" })}
                {field("phone", <>Mobile <span className={own.optional}>(optional)</span></>, { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 40, placeholder: "021 123 4567" })}
              </div>
              <button type="submit" className={`${styles.btn} ${styles.wide} ${duo.chunky}`} disabled={sending}>
                {sending ? "Saving…" : PACK.button} <span className={styles.arrow} aria-hidden="true">→</span>
              </button>
              <p className={styles.status} role="status">{status}</p>
              <p className={styles.small}>
                {PACK.consent} <Link href="/quoting-privacy/">Privacy notice</Link>.
              </p>
            </form>
          </div>
          <div className={live.faq}>
            <h2 className={live.faqTitle}>Questions</h2>
            {PACK.faq.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </>
      );
    }

    if (screen === "live") {
      return (
        <div className={own.liveScreen}>
          <p className={live.saved}>
            <Check /> {PACK.liveOffer.saved}
          </p>
          <h2 ref={heading} tabIndex={-1}>{PACK.liveOffer.title}</h2>
          <p className={styles.lede}>{PACK.liveOffer.body}</p>
          {LIVE_VIDEO ? (
            <div className={live.video}>
              {/* Jordan's live-session VSL, right here so they don't leave the page. Tap to play with sound. */}
              <video
                className="vsl"
                aria-label="Jordan explains the live session"
                data-name="Live session (pack page)"
                data-marks="25,50,75,100"
                src={LIVE_VIDEO}
                poster={LIVE_POSTER || undefined}
                playsInline
                controls
                preload="metadata"
              />
            </div>
          ) : null}
          <ul className={live.facts}>
            <li><b>{SESSION.day}</b></li>
            <li>{SESSION.time}</li>
            <li>{SESSION.where}</li>
          </ul>
          <div className={`${styles.ctaRow} ${live.doneCta}`}>
            <button type="button" className={`${styles.btn} ${duo.chunky}`} onClick={joinLive} disabled={joining}>
              {joining ? "Saving…" : PACK.liveOffer.yes}
            </button>
            <button type="button" className={live.skip} onClick={() => go("done")}>
              {PACK.liveOffer.no}
            </button>
          </div>
          <p className={styles.status} role="status">{status}</p>
        </div>
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
              <Check /> {PACK.saved}
            </p>
          ) : null}
          {CHEERS[i] ? <p className={duo.cheer}>{CHEERS[i]}</p> : null}
          <h2 ref={heading} tabIndex={-1}>{q.question}</h2>
          {q.note ? <p className={styles.lede}>{q.note}</p> : null}
          <div className={`${styles.opts} ${q.layout === "grid" ? duo.grid : ""} ${justChose === q.field ? styles.locked : ""}`} role="group" aria-label={q.question}>
            {q.options.map((o, j) => {
              const on = chosen === o.label;
              const cls = [styles.opt, duo.opt, on ? `${styles.chosen} ${duo.chosen}` : "", on && justChose !== q.field ? styles.instant : ""].join(" ");
              return (
                <button
                  key={o.label}
                  type="button"
                  className={cls}
                  style={{ "--i": j } as React.CSSProperties}
                  aria-pressed={on}
                  onClick={() => choose(i, o.label)}
                >
                  <span className={`${styles.key} ${duo.key}`} aria-hidden="true">{j + 1}</span>
                  <span className={`${styles.label} ${duo.label}`}>
                    {o.label}
                    {o.detail ? <small className={styles.detail}>{o.detail}</small> : null}
                  </span>
                  {o.level ? (
                    <span className={styles.lvl} aria-hidden="true">
                      {[1, 2, 3, 4].map((n) => (
                        <b key={n} className={n <= (o.level ?? 0) ? styles.on : ""} />
                      ))}
                    </span>
                  ) : null}
                  <span className={`${styles.tick} ${duo.tick}`}><Check /></span>
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
        <h2 ref={heading} tabIndex={-1}>You&apos;re on the list{first ? `, ${first}` : ""}.</h2>
        <p className={styles.lede}>{PACK.doneNote}{details.email ? ` Keep an eye on ${details.email}.` : ""}</p>
        {joinedLive ? <p className={styles.lede}>{PACK.liveOffer.done}</p> : null}
        <div className={live.callCard}>
          <h3>Want to talk about your business before then?</h3>
          <p>Book a free 30-minute call with Ivan. Pick a time that suits.</p>
          <a className={styles.btn} href={bookingLink(details)} target="_blank" rel="noopener noreferrer"
            onClick={() => fbq("trackCustom", "PackWaitlistBookCall", { content_name: OFFER })}>
            Book a call with Ivan
          </a>
        </div>
      </>
    );
  }

  const asking = screen.startsWith("q");
  const qi = asking ? Number(screen.slice(1)) : 0;
  const pct = asking ? Math.max(3, ((qi + (justChose ? 1 : 0)) / questions.length) * 100) : 100;
  const screenClass = [styles.screen, fromLeft ? styles.fromLeft : "", leaving ? styles.leaving : ""].join(" ");

  return (
    <section ref={root} className={`${styles.quiz} ${live.page} ${duo.duo} ${screen === "signup" ? live.landing : ""}`} aria-label="Free AI systems pack waitlist">
      <canvas ref={canvas} className={styles.burst} aria-hidden="true" />
      <div className={`${styles.inner} ${live.inner} ${screen === "signup" ? live.wide : ""}`}>
        <header className={styles.top}>
          <div className={styles.topRow}>
            <Link href="/" className={live.logo} aria-label="Flowstate home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/live/flowstate-logo-light.svg" alt="Flowstate" width={96} height={40} />
            </Link>
            <span className={duo.topRight}>
              <span className={styles.count} aria-live="polite">
                {asking ? `Just before you go · ${qi + 1} of ${questions.length}` : ""}
              </span>
              {screen === "signup" ? null : (
                <SoundButton on={soundOn} onToggle={toggleSound} />
              )}
            </span>
          </div>
          <div className={`${styles.bar} ${duo.bar} ${asking ? "" : styles.barHide}`} aria-hidden="true">
            <i className={`${styles.fill} ${duo.fill}`} style={{ width: `${pct}%` }} />
          </div>
        </header>
        <div className={`${styles.stage} ${duo.stage}`}>
          <div key={screen} className={`${screenClass} ${screen === "signup" ? live.signup : ""}`}>
            {renderScreen()}
          </div>
        </div>
      </div>
    </section>
  );
}

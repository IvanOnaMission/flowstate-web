"use client";

/*
 * /essentials/ quiz: seven one-tap questions, contact details, then the inline Calendly.
 * Answers and details go to Netlify Forms as "essentials-quiz" in one submission
 * (netlify/functions/submission-created.mjs turns it into the lead, CRM note and alert).
 * /assets/quoting/booking.js builds the calendar into the .booking box on
 * "flowstate:lead" and fires Meta Schedule only when Calendly confirms a booking.
 * Contact details never reach the pixel or browser storage.
 */
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { EMPLOYEE, questions } from "./questions";
import styles from "./quiz.module.css";

type Screen = "intro" | "details" | "calendar" | "done" | "exit" | `q${number}`;
type Details = { name: string; business: string; phone: string; email: string };
type Errors = Partial<Record<keyof Details, string>>;
type MetaClick = { fbclid?: string; fbc?: string; fbp?: string };

const FORM_NAME = "essentials-quiz";
const OFFER = "Business Essentials";
const CAMPAIGN = "business-essentials";
const CALENDLY =
  "https://calendly.com/ivan-flowstate/30min?utm_source=flowstate&utm_medium=direct-booking&utm_campaign=business-essentials";
const TRACKED = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const STEPS = questions.length + 2;
const ORDER: Screen[] = ["intro", ...questions.map((_, i) => `q${i}` as Screen), "details", "calendar", "done"];
const EMPTY: Details = { name: "", business: "", phone: "", email: "" };

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
  const out: Record<string, string> = { utm_source: "flowstate", utm_medium: "direct-booking" };
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

/** Calendly's phone question wants an international number. */
function calendlyPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (phone.trim().startsWith("+")) return `+${digits}`;
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  if (digits.startsWith("0")) return `+64${digits.slice(1)}`;
  if (digits.startsWith("64")) return `+${digits}`;
  return "";
}

function validate(v: Details): Errors {
  const digits = v.phone.replace(/\D/g, "");
  const phoneOk = /^\+?[\d\s().-]+$/.test(v.phone) && digits.length >= 7 && digits.length <= 15;
  return {
    name: v.name ? "" : "Add your name.",
    business: v.business ? "" : "Add your business name.",
    phone: phoneOk ? "" : "Add a number Ivan can reach you on, including the area or mobile prefix.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? "" : "Check your email address, it looks incomplete.",
  };
}

const Check = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function EssentialsQuiz() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [fromLeft, setFromLeft] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [justChose, setJustChose] = useState<string | null>(null);
  const [bump, setBump] = useState(false);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState("");

  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const calendarLink = useRef<HTMLAnchorElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const busy = useRef(false);
  const sent = useRef(false);
  const calendarOpened = useRef(false);
  const navigated = useRef(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((next: Screen, back = false) => {
    const swap = () => {
      busy.current = false;
      navigated.current = true;
      setFromLeft(back);
      setLeaving(false);
      setJustChose(null);
      setBump(false);
      setScreen(next);
      root.current?.scrollIntoView({ block: "start" });
    };
    if (reduce.current) swap();
    else {
      setLeaving(true);
      window.setTimeout(swap, 170);
    }
  }, []);

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

  // Move focus to each new screen's heading so keyboard and screen-reader users follow along.
  useEffect(() => {
    if (!navigated.current) return;
    heading.current?.focus({ preventScroll: true });
    if (screen === "done") {
      const id = window.setTimeout(burst, 260);
      return () => window.clearTimeout(id);
    }
  }, [screen, burst]);

  // booking.js announces a confirmed Calendly booking.
  useEffect(() => {
    const booked = () => go("done");
    document.addEventListener("flowstate:booked", booked);
    return () => document.removeEventListener("flowstate:booked", booked);
  }, [go]);

  const choose = useCallback(
    (i: number, label: string) => {
      if (busy.current) return;
      busy.current = true;
      const q = questions[i];
      setAnswers((a) => ({ ...a, [q.field]: label }));
      setJustChose(q.field);
      setBump(true);
      try {
        navigator.vibrate?.(10);
      } catch {
        /* Not every phone allows it. */
      }
      fbq("trackCustom", "EssentialsQuizAnswer", { content_name: OFFER, question: q.field });
      const next: Screen =
        q.field === "role" && label === EMPLOYEE ? "exit" : i + 1 < questions.length ? (`q${i + 1}` as Screen) : "details";
      window.setTimeout(() => go(next), reduce.current ? 150 : 440);
    },
    [go],
  );

  const start = useCallback(() => {
    fbq("trackCustom", "EssentialsQuizStarted", { content_name: OFFER });
    go("q0");
  }, [go]);

  // Number keys answer, Enter starts.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (screen === "intro" && e.key === "Enter" && (document.activeElement as HTMLElement | null)?.tagName !== "BUTTON") {
        e.preventDefault();
        start();
        return;
      }
      if (!screen.startsWith("q")) return;
      const i = Number(screen.slice(1));
      const n = Number.parseInt(e.key, 10);
      const option = questions[i]?.options[n - 1];
      if (option) {
        e.preventDefault();
        choose(i, option.label);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, choose, start]);

  function openCalendar(v: Details) {
    const link = calendarLink.current;
    if (link && !calendarOpened.current) {
      const url = new URL(link.href);
      const t = tracking();
      for (const key of TRACKED) if (t[key]) url.searchParams.set(key, t[key]);
      const [first, ...rest] = v.name.split(/\s+/);
      url.searchParams.set("name", v.name);
      url.searchParams.set("first_name", first);
      if (rest.length) url.searchParams.set("last_name", rest.join(" "));
      url.searchParams.set("email", v.email);
      const phone = calendlyPhone(v.phone);
      if (phone) url.searchParams.set("a1", phone);
      link.href = url.toString();
    }
    go("calendar");
    if (!calendarOpened.current) {
      calendarOpened.current = true;
      window.setTimeout(() => document.dispatchEvent(new CustomEvent("flowstate:lead")), reduce.current ? 0 : 220);
    }
  }

  async function submitDetails(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const v: Details = {
      name: details.name.trim(),
      business: details.business.trim(),
      phone: details.phone.trim(),
      email: details.email.trim(),
    };
    const errs = validate(v);
    setErrors(errs);
    setDetails(v);
    const firstBad = (Object.keys(errs) as (keyof Details)[]).find((k) => errs[k]);
    if (firstBad) {
      document.getElementById(`ess-${firstBad}`)?.focus();
      return;
    }
    if (sent.current) {
      openCalendar(v);
      return;
    }
    if (!production()) {
      sent.current = true;
      setStatus("Preview only. Your details haven't been sent.");
      openCalendar(v);
      return;
    }

    setSending(true);
    const click = metaClick();
    const body = new URLSearchParams({
      "form-name": FORM_NAME,
      "bot-field": "",
      ...v,
      ...answers,
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
      setStatus("");
      const id = typeof window.crypto?.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
      fbq("track", "Lead", { content_name: OFFER }, { eventID: `lead-${id}` });
    } catch {
      setStatus(`That didn't send. Pick a time below, or call Ivan on ${site.phone}.`);
    } finally {
      setSending(false);
    }
    openCalendar(v);
  }

  async function copyLink() {
    const url = `${location.origin}${location.pathname}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied("Link copied. Send it their way.");
    } catch {
      setCopied(url);
    }
  }

  // Progress: questions, then details, then the calendar.
  const k = ORDER.indexOf(screen);
  const showBar = screen !== "intro" && screen !== "exit";
  const doneSteps = screen === "done" ? STEPS : k - 1 + (bump ? 1 : 0);
  const pct = showBar ? Math.max(3, (doneSteps / STEPS) * 100) : 0;
  const countText = !showBar
    ? ""
    : screen.startsWith("q")
      ? `Question ${Number(screen.slice(1)) + 1} of ${questions.length}`
      : ({ details: "Your details", calendar: "Pick a time", done: "All done" } as Record<string, string>)[screen];

  const screenClass = [styles.screen, fromLeft ? styles.fromLeft : "", leaving ? styles.leaving : ""].join(" ");
  const back = (to: Screen, text = "Back") => (
    <button type="button" className={styles.back} onClick={() => !busy.current && go(to, true)}>
      <span aria-hidden="true">←</span> {text}
    </button>
  );

  function renderScreen() {
    if (screen === "intro") {
      return (
        <>
          <p className={styles.eyebrow}>Business Essentials</p>
          <h1 ref={heading} tabIndex={-1}>
            The <mark>AI foundation</mark> for your trades business
          </h1>
          <p className={styles.lede}>
            Answer 7 quick questions, then pick a time for your free 30-minute audit with Ivan.
          </p>
          <div className={styles.ctaRow}>
            <button type="button" className={styles.btn} onClick={start}>
              Let&apos;s go <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
            <span className={styles.hint}>
              About a minute
              <span className={styles.kb}>
                {" "}
                · press <kbd>Enter</kbd>
              </span>
            </span>
          </div>
          <ul className={styles.facts}>
            <li><Check />Free 30-minute audit</li>
            <li><Check />For NZ trade businesses</li>
            <li><Check />You approve everything</li>
          </ul>
        </>
      );
    }

    if (screen.startsWith("q")) {
      const i = Number(screen.slice(1));
      const q = questions[i];
      const chosen = answers[q.field];
      return (
        <>
          {back(i === 0 ? "intro" : (`q${i - 1}` as Screen))}
          <h2 ref={heading} tabIndex={-1}>{q.question}</h2>
          {q.note ? <p className={styles.lede}>{q.note}</p> : null}
          <div className={`${styles.opts} ${justChose === q.field ? styles.locked : ""}`} role="group" aria-label={q.question}>
            {q.options.map((o, j) => {
              const on = chosen === o.label;
              const cls = [styles.opt, on ? styles.chosen : "", on && justChose !== q.field ? styles.instant : ""].join(" ");
              return (
                <button
                  key={o.label}
                  id={`opt-${q.field}-${j}`}
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

    if (screen === "details") {
      const field = (key: keyof Details, label: string, props: React.InputHTMLAttributes<HTMLInputElement>) => (
        <div className={`${styles.field} ${errors[key] ? styles.bad : ""}`}>
          <label htmlFor={`ess-${key}`}>{label}</label>
          <input
            id={`ess-${key}`}
            name={key}
            value={details[key]}
            onChange={(e) => setDetails((d) => ({ ...d, [key]: e.target.value }))}
            aria-invalid={errors[key] ? true : undefined}
            aria-describedby={errors[key] ? `ess-${key}-error` : undefined}
            {...props}
          />
          {errors[key] ? <p className={styles.err} id={`ess-${key}-error`}>{errors[key]}</p> : null}
        </div>
      );
      return (
        <>
          {back(`q${questions.length - 1}` as Screen)}
          <h2 ref={heading} tabIndex={-1}>Who&apos;s Ivan talking to?</h2>
          <p className={styles.lede}>Last bit, then you pick a time.</p>
          <form onSubmit={submitDetails} noValidate>
            <div className={styles.fields}>
              {field("name", "Your name", { autoComplete: "name", maxLength: 120 })}
              {field("business", "Business name", { autoComplete: "organization", maxLength: 120 })}
              {field("phone", "Mobile", { type: "tel", inputMode: "tel", autoComplete: "tel", maxLength: 40, placeholder: "021 123 4567" })}
              {field("email", "Email", { type: "email", inputMode: "email", autoComplete: "email", maxLength: 200, placeholder: "you@yourbusiness.co.nz" })}
            </div>
            <button type="submit" className={`${styles.btn} ${styles.wide}`} disabled={sending}>
              {sending ? "Sending…" : "Pick a time"} <span className={styles.arrow} aria-hidden="true">→</span>
            </button>
            <p className={styles.small}>
              I&apos;ll use your details to contact you about the call.{" "}
              <Link href="/quoting-privacy/">Privacy notice</Link>. Or call Ivan on{" "}
              <a href={site.phoneHref}>{site.phone}</a>.
            </p>
          </form>
        </>
      );
    }

    if (screen === "calendar") {
      return (
        <>
          {back("details")}
          <h2 ref={heading} tabIndex={-1}>Pick a time for your audit</h2>
          <p className={styles.lede}>30 minutes with Ivan on Google Meet. Times are NZ time.</p>
          <p className={styles.status} role="status">{status}</p>
        </>
      );
    }

    if (screen === "done") {
      const first = details.name.split(/\s+/)[0];
      return (
        <>
          <div className={styles.doneMark} aria-hidden="true">
            <svg viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="26" />
              <path d="M15 27l7.5 7.5L38 19" />
            </svg>
          </div>
          <h2 ref={heading} tabIndex={-1}>You&apos;re booked in{first ? `, ${first}` : ""}.</h2>
          <p className={styles.lede}>
            Your calendar invite is on its way{details.email ? ` to ${details.email}` : ""}, with the Google Meet link.
          </p>
          <div className={styles.summary}>
            <p className={styles.summaryTitle}>Ivan sees this before your call</p>
            <dl>
              {questions.map((q) =>
                answers[q.field] ? (
                  <div className={styles.row} key={q.field}>
                    <dt>{q.summary}</dt>
                    <dd>{answers[q.field]}</dd>
                  </div>
                ) : null,
              )}
              {details.business ? (
                <div className={styles.row}>
                  <dt>Business</dt>
                  <dd>{details.business}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </>
      );
    }

    return (
      <>
        {back("q0", "Change my answer")}
        <h2 ref={heading} tabIndex={-1}>This one&apos;s built for business owners.</h2>
        <p className={styles.lede}>
          If you reckon it&apos;d help where you work, send this page to whoever runs the business.
        </p>
        <div className={styles.ctaRow}>
          <button type="button" className={styles.btn} onClick={copyLink}>Copy the link</button>
        </div>
        <p className={styles.status} aria-live="polite">{copied}</p>
      </>
    );
  }

  return (
    <section ref={root} className={styles.quiz} aria-label="Business Essentials quiz">
      <canvas ref={canvas} className={styles.burst} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.top}>
          <div className={styles.topRow}>
            <Link href="/" className={styles.wordmark}>
              {site.name}
              <span>.</span>
            </Link>
            <span className={styles.count} aria-live="polite">{countText}</span>
          </div>
          <div className={`${styles.bar} ${showBar ? "" : styles.barHide}`} aria-hidden="true">
            <i className={styles.fill} style={{ width: `${pct}%` }} />
          </div>
        </header>

        <div className={styles.stage}>
          <div key={screen} className={screenClass}>
            {renderScreen()}
          </div>
          {/* booking.js swaps this link for the inline calendar after the details are in.
              It stays mounted so React never removes nodes that script has replaced. */}
          <div
            className={`booking ${styles.booking}`}
            data-after-lead
            data-calendly-background="ffffff"
            data-calendly-text="06283d"
            data-calendly-primary="0f4b70"
            hidden={screen !== "calendar"}
          >
            <a ref={calendarLink} href={CALENDLY}>
              Choose a time
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

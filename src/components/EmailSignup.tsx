"use client";

import { useState } from "react";
import { site } from "@/lib/site";

/**
 * Email capture straight into Ivan's Kit list (account `flow-state-3`,
 * form 9735445 — the same form behind flow-state-3.kit.com/steal-my-ai-brain).
 *
 * Built as a real HTML form pointed at Kit's own endpoint, then enhanced with
 * fetch. Two reasons:
 *  - No API key in the bundle. The endpoint is public and takes a plain POST,
 *    so there is nothing here worth stealing.
 *  - With JS off or broken it still works. The form submits normally and Kit
 *    shows its own confirmation page — the subscriber is captured either way.
 *
 * The fetch path is fire-and-assume-success: Kit doesn't return a CORS-
 * readable response, so a network-level failure falls back to a native submit
 * rather than silently swallowing the address.
 */
const KIT_ENDPOINT = "https://app.kit.com/forms/9735445/subscriptions";

export default function EmailSignup() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const email = new FormData(form).get("email_address");
    if (!email) return; // let the browser's own validation handle it

    e.preventDefault();
    setState("sending");

    try {
      await fetch(KIT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: new FormData(form),
      });
      setState("done");
      form.reset();
    } catch {
      // Network refused it outright — hand back to a normal browser submit so
      // the person still gets on the list rather than hitting a dead button.
      form.submit();
    }
  }

  if (state === "done") {
    return (
      <p
        role="status"
        className="max-w-[34ch] text-[0.95rem] leading-relaxed text-ink"
      >
        You&apos;re on the list. Check your inbox to confirm it.
        Occasionally it lands in spam.
      </p>
    );
  }

  return (
    <form
      action={KIT_ENDPOINT}
      method="post"
      onSubmit={onSubmit}
      className="flex max-w-[26rem] flex-col gap-3 sm:flex-row"
    >
      <label htmlFor="email_address" className="sr-only">
        Your email address
      </label>
      <input
        id="email_address"
        name="email_address"
        type="email"
        required
        autoComplete="email"
        placeholder="you@yourbusiness.co.nz"
        className="min-h-11 flex-1 rounded-full border border-hair bg-white px-5 py-3 text-[0.95rem] text-ink placeholder:text-mute/70 focus:border-atlantic focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="min-h-11 cursor-pointer rounded-full bg-atlantic px-7 py-3 text-[0.9rem] font-bold text-white transition-[transform,filter] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:brightness-112 disabled:cursor-wait disabled:opacity-70"
      >
        {state === "sending" ? "Sending…" : "Send it"}
      </button>
      {/* Kit needs this when the form posts natively, i.e. JS off. */}
      <input type="hidden" name="utf8" value="✓" />
      <p className="sr-only">
        Emails go to {site.name}. Unsubscribe any time.
      </p>
    </form>
  );
}

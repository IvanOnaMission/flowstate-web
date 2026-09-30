import { site } from "@/lib/site";

/**
 * Carried over from the previous site so an existing lead path isn't lost in
 * the rebuild. Same mechanism: Netlify Forms, so submissions land in the same
 * place they always have and nothing new needs wiring up.
 *
 * Three things Netlify needs and that are easy to break:
 *  - `data-netlify="true"` plus a hidden `form-name` input matching the name.
 *  - A honeypot field, hidden from people, that bots fill in.
 *  - The form must exist in the DEPLOYED HTML for Netlify's build-time parser
 *    to find it. This is a server component with no JS gating for exactly that
 *    reason — if it were rendered client-side the form would never register.
 */
export default function ContactForm() {
  const field =
    "min-h-11 w-full rounded-lg border border-hair bg-white px-4 py-3 text-[1rem] text-ink placeholder:text-mute/60 focus:border-atlantic focus:outline-none";

  return (
    <form
      name="contact"
      method="POST"
      action="/contact/thanks/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="max-w-[34rem]"
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>
          Leave this empty if you&apos;re human: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="name"
            className="mb-2 block text-[0.9rem] font-semibold text-ink"
          >
            Your name
          </label>
          <input id="name" name="name" type="text" required className={field} />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-[0.9rem] font-semibold text-ink"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={field}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[0.9rem] font-semibold text-ink"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={field}
          />
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-[0.9rem] font-semibold text-ink"
          >
            What&apos;s eating your time?{" "}
            <span className="font-normal text-mute">(optional)</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            className={`${field} resize-y`}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 min-h-11 cursor-pointer rounded-full bg-atlantic px-8 py-4 text-[0.95rem] font-bold text-white transition-[transform,filter] duration-200 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:brightness-112"
      >
        Send it
      </button>
      <p className="mt-4 text-[0.85rem] text-mute">
        Goes straight to {site.email}. I&apos;ll contact you about the diagnostic.
      </p>
    </form>
  );
}

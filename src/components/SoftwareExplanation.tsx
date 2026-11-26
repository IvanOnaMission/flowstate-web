import Image from "next/image";

export default function SoftwareExplanation({ layout = "diagram" }: { layout?: "diagram" | "photo" }) {
  const copy = (
    <div className="max-w-[65ch] space-y-5 text-[1.0625rem] leading-relaxed text-mute">
      <p>{"Your team’s knowledge, instructions and information don’t all live in your job management software. They’re also in emails, documents, site notes and people’s heads."}</p>
      <p>{"Flow State builds AI around that wider picture, giving it the relevant business knowledge and instructions to help carry out your processes across the tools you use."}</p>
      <p>{"If your existing software already handles something well, Flow State uses it and focuses on the gaps that still take your team’s time and attention."}</p>
    </div>
  );

  return (
    <section className="mt-12 border-t border-hair pt-9">
      <h2 className="h-sec max-w-[32ch] text-ink">Your software manages the jobs. <span className="block text-atlantic">Flow State helps with the work around them.</span></h2>
      {layout === "photo" ? (
        <div className="v4-software mt-7 grid items-center">
          <img
            src="/assets/real/v4-software_jordan09-logo.jpg"
            alt="Jordan at his desk with his computer screens"
            width={1024}
            height={1024}
          />
          {copy}
        </div>
      ) : (
        <div className="mt-7 grid items-center gap-8 md:grid-cols-[1.2fr_1fr] lg:gap-12">
          {copy}
          <Image src="/assets/business-connections.svg" alt="Emails and documents connected through AI to existing business software." width={600} height={520} sizes="(max-width: 767px) 100vw, 40vw" className="h-auto w-full rounded-2xl" />
        </div>
      )}
    </section>
  );
}

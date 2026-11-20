"use client";

import duo from "./duo.module.css";

/** Sound on/off switch in the quiz header (see useQuizSound in duo.ts). */
export default function SoundButton({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={duo.sound} onClick={onToggle} aria-pressed={on} aria-label={on ? "Turn sound off" : "Turn sound on"}>
      <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor" />
        {on ? <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /> : <path d="M17 9l5 6M22 9l-5 6" />}
      </svg>
    </button>
  );
}

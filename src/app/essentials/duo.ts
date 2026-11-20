"use client";

/**
 * The Duolingo-style extras shared by the /pack/ and /live/ quizzes (styles in duo.module.css):
 * a cheer above each question and small synthesised sounds, with an on/off switch.
 */
import { useCallback, useEffect, useRef, useState } from "react";

/** A short cheer above each question after the first, by question number. */
export const CHEERS = ["", "Nice one!", "Good stuff!", "Halfway there!", "Keep going!", "Nearly there!", "Last one!"];

const SOUND_KEY = "flowstate-quiz-sound";

/**
 * Tones made in the browser, no audio files: a two-note ding per answer and a rising run at the end.
 * The AudioContext starts on the first tap, which phones require before any sound plays.
 */
export function useQuizSound() {
  const [soundOn, setSoundOn] = useState(true);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(SOUND_KEY) === "off") queueMicrotask(() => setSoundOn(false));
    } catch {
      /* Storage blocked: sound stays on. */
    }
  }, []);

  const play = useCallback(
    (notes: number[], gap = 0.09, length = 0.22) => {
      if (!soundOn) return;
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctx) return;
        const ctx = (audio.current ??= new Ctx());
        if (ctx.state === "suspended") void ctx.resume();
        const t0 = ctx.currentTime + 0.01;
        notes.forEach((freq, k) => {
          const t = t0 + k * gap;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.14, t + 0.012);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + length + 0.05);
        });
      } catch {
        /* No sound is fine. */
      }
    },
    [soundOn],
  );

  const ding = useCallback(() => play([880, 1318.5]), [play]);
  const fanfare = useCallback(() => play([523.25, 659.25, 783.99, 1046.5], 0.11, 0.35), [play]);

  const toggle = useCallback(() => {
    setSoundOn((on) => {
      try {
        localStorage.setItem(SOUND_KEY, on ? "off" : "on");
      } catch {
        /* Storage blocked: the choice lasts for this visit. */
      }
      return !on;
    });
  }, []);

  return { soundOn, toggle, ding, fanfare };
}

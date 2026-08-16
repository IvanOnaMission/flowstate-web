# Flowstate — Design System A: BOLD

AI systems for New Zealand trade businesses. Audience: electricians, plumbers, builders
who own the company. Aged 30–55. Busy, sceptical, on a phone, arrived from a short video.
One job for this site: book a 15-minute call.

## Colors — LOCKED, do not substitute

| Role | Hex |
|---|---|
| Primary — Atlantic | `#0F4B70` |
| On Primary | `#FFFFFF` |
| Secondary — Atlantic 500 | `#1A6FA3` |
| Accent / CTA — Soft Sky | `#C4F8FF` |
| On Accent | `#0F4B70` |
| Background | `#FFFFFF` |
| Surface | `#EBFDFF` |
| Foreground — Ink | `#06283D` |
| Muted foreground | `#3F5F73` |
| Border | `#D6E4EC` |

Two brand colors only: deep Atlantic blue and a bright pale Soft Sky. No purple. No pink.
No orange. No AI gradients. No teal-to-violet. Dark sections are solid Atlantic `#0F4B70`
with white or Soft Sky text. Soft Sky is used sparingly and always reads as the loudest
thing on the screen — it is the call-to-action color.

## Typography

- Headings: **Plus Jakarta Sans**, weight 800, tight tracking (-0.02em), very large.
- Body: **Plus Jakarta Sans**, weight 400, 17–18px, line-height 1.6.
- Eyebrow labels: uppercase, 12px, letter-spacing 0.12em, weight 600, muted foreground.
- Headline scale is the main visual event. Hero headline is enormous — 64px on mobile,
  up to 100px on desktop — set to a max of 17 characters per line.

## Style direction — BOLD

Confident, stark, structural. Big type as the hero. Hard edges. Visible structure.

- Corner radius: **0px on cards, sections and images.** Buttons are the only rounded
  element — full pill radius.
- Borders: 1px `#D6E4EC` hairlines dividing every section. Visible grid. Rules between
  list rows rather than boxed cards.
- Shadows: almost none. Depth comes from color blocks, not elevation.
- Layout: asymmetric. Off-center headlines, wide left column and narrow right, generous
  whitespace on one side and content pushed hard to the other. Full-bleed Atlantic
  sections that break the container.
- Numbers set huge (01 / 02 / 03) as graphic elements, not decoration.
- Generous vertical rhythm: 96–160px between sections.

## Motion

Standard tier. Scroll-triggered reveal with 60ms stagger, 300–450ms, ease-out. Respect
`prefers-reduced-motion` — render final state instantly.

## Page pattern

Trust & authority + conversion. Section order:
Hero (claim + CTA) → the argument → the three-rung ladder → the part everyone skips →
who you'd be working with → what happens in the 15 minutes → final CTA.

## Anti-patterns — never

- Emoji as icons. Use Lucide/Heroicons line SVG only.
- Purple or pink AI gradients.
- Stock photos of people in headsets, robots, glowing brains, circuit boards.
- Playful, rounded, cutesy design. This audience does not want cute.
- Fake logo walls, fake testimonials, fake numbers. There are none yet.
- Pricing anywhere.
- Text under 16px in body copy.
- Contrast below 4.5:1. Touch targets below 44×44px.

## Accessibility

Contrast 4.5:1 minimum on every pair. Visible focus rings, 3px, Atlantic. Keyboard
navigable. No horizontal scroll at 375px.

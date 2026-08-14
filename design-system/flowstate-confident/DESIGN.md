# Flowstate — Design System B: CONFIDENT

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
No orange. No AI gradients. Dark sections are solid Atlantic `#0F4B70` with white or Soft
Sky text. Soft Sky is the call-to-action color and the section-surface tint.

## Typography

- Headings: **Plus Jakarta Sans**, weight 700, tracking -0.015em.
- Body: **Plus Jakarta Sans**, weight 400, 17px, line-height 1.65.
- Eyebrow labels: uppercase, 12px, letter-spacing 0.1em, weight 600, Atlantic 500.
- Hero headline 40px mobile → 68px desktop. Large, but the layout carries as much weight
  as the type does.

## Style direction — CONFIDENT

Clean, warm, engineered. Reads as a serious operator, not a startup and not a brochure.

- Corner radius: **12px on cards, 8px on inputs, pill on buttons.** Soft but not bubbly.
- Surfaces: content sits in tinted `#EBFDFF` cards on white, with 1px `#D6E4EC` borders.
  Structure comes from surfaces, not from rules.
- Shadows: subtle only — `0 1px 2px rgba(6,40,61,.06)` at rest, lifting to
  `0 8px 20px -8px rgba(6,40,61,.18)` on hover.
- Layout: centered and balanced. Symmetric grids, generous max-width (~1120px), clear
  hierarchy. Two- and three-column bands. Alternating white and Soft-Sky-tinted sections.
- The ladder rungs are three cards side by side on desktop, stacked on mobile, each with a
  line icon, a number, a title and two lines of body.
- Vertical rhythm: 80–128px between sections.

## Motion

Standard tier. Fade-and-rise on scroll, 40ms stagger, 300–400ms, ease-out. Hover
transitions 200ms. Respect `prefers-reduced-motion`.

## Page pattern

Trust & authority + conversion. Section order:
Hero (claim + CTA) → the argument → the three-rung ladder → the part everyone skips →
who you'd be working with → what happens in the 15 minutes → final CTA.

## Anti-patterns — never

- Emoji as icons. Use Lucide/Heroicons line SVG only.
- Purple or pink AI gradients.
- Stock photos of people in headsets, robots, glowing brains, circuit boards.
- Fake logo walls, fake testimonials, fake numbers. There are none yet.
- Pricing anywhere.
- Text under 16px in body copy.
- Contrast below 4.5:1. Touch targets below 44×44px.

## Accessibility

Contrast 4.5:1 minimum on every pair. Visible focus rings, 3px, Atlantic. Keyboard
navigable. No horizontal scroll at 375px.

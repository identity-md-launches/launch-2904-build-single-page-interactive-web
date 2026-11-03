# Squeek Raid design system

The implemented idea is a dark arcade dungeon whose gold combat controls sit beside a real hamster's cyan telemetry. The page is a working game and utility, with the boss and primary action visible on the first 390px screen. Its local simulation and real Sepolia terminal are labeled explicitly. Source of truth: `styles.css`, `index.html`, `app.js` and the original local SVGs in `assets/`.

## Tokens and color roles

The canonical tokens are in `styles.css:1`.

| Token | Value | Role |
| --- | --- | --- |
| `--bg` | `#08080a` | Page and input background |
| `--surface` | `#121318` | Panels |
| `--surface-raised` | `#1b1d24` | Wallet rows and trait tags |
| `--surface-hover` | `#23262f` | Neutral hover treatment |
| `--text` / `--focus` | `#f3f1eb` | Main text and keyboard perimeter |
| `--muted` | `#a4a5af` | Supporting text and units |
| `--line` | `#2b2d35` | Structural dividers |
| `--strong-line` | `#4e515d` | Field and secondary-button borders |
| `--gold` | `#f8a838` | Main action, boss HP, combat damage/power |
| `--gold-soft` | `#2d2316` | Selected boss, wallet and burst surfaces |
| `--cyan` | `#2fd6e8` | Live wheel data, block progress and counter charge |
| `--cyan-soft` | `#10282c` | Formula and code surfaces |
| `--purple` | `#c2a0fa` | Block Breaker stance accent |
| `--success` | `#91d9a5` | Verified hardware, available metadata state |
| `--danger` | `#ff9191` | Recoverable form and transaction errors |

Status also has a written label, rather than relying on hue. The selected stance combines a border, background, radio marker and `aria-pressed`. The dark-only theme follows the brief; there is no unused light-mode palette.

Measured from the live rendered page: body text/page 17.72:1; intro supporting text/page 8.18:1; selected boss text/background 7.81:1; primary button text/gold 9.43:1; verified proof text/panel 11.19:1; status gold/panel 9.41:1. These are identified solid pairs, not a claim about every pixel of the artwork. Full probe limitations are in `artifacts/validation.md`.

## Typography

`--font` is the system sans stack (`-apple-system`, BlinkMacSystemFont, Segoe UI, Arial, Noto Sans, sans-serif). `--mono` is SFMono-Regular, Consolas, Liberation Mono, monospace. Fonts require no download. Chinese uses the platform's available CJK fallback.

The six sizes are 12, 14, 16, 20, 28 and 40px, exposed as `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-xl`, `--text-display`. Body UI is 14px/1.5; labels and dense metadata are 12px; inputs remain 16px. The display heading is 40px/1.12 with −0.045em tracking, changing to 28px/−0.035em at 850px. Section headings use 20px, nested headings 16px; compact panel headings become 16px at 850px. Weights are 400, 600 and 700.

Use sans for prose and controls; monospace with tabular numbers for changing telemetry, HP, XP, timers, formulas and addresses. Headings balance wrapping and paragraphs use `text-wrap: pretty`. Long addresses and signatures wrap with `overflow-wrap:anywhere`; no meaningful value is ellipsized without the full value being available in details or an accessible name.

## Layout and spacing

The centered `.page` has a 1440px maximum border-box width and 40px desktop side padding. The header can extend to 1600px. Gaps use a 4px-oriented rhythm with 8–14px between small controls and 16–24px within or between panels. Section changes generally add 28–38px. Panels use 16–22px internal padding.

The raid has a 2.15:1 arena/telemetry grid, then three stances, a combat/log pair, three NFT slots, a 1.2:1 settlement/calculator pair and three terminal actions. These are this page's compositions rather than mandatory future page layouts. DOM order remains meaningful when grids collapse. Hash links work on any static subpath.

| Breakpoint | Implemented adaptation |
| --- | --- |
| ≤1150px | 28px page/header gutters; compact boss tabs; arena action moves below metrics; tighter squad art |
| ≤850px | Header navigation becomes a second row; title is 28px; telemetry is 280px; smaller card metrics and stacked calculator fields |
| ≤680px | 16px page gutters; one-column raid/combat/data layouts; compact player XP row; three small boss choices remain together; stances stack; NFT cards become horizontal; terminal actions stack; wallet dialog becomes a bottom sheet |
| ≤359px | 12px gutters, smaller brand/art, text-only boss choices and extra health-caption wrapping |

At 390px, the initial boss, HP, power and 44px Enter raid action are visible within 844px height. Mobile controls are inset within the page and safe-area padding applies to the wallet sheet. There is no fixed bottom bar covering content. The accessible chart data table and combat log have disclosed, bounded scrolling; the main page has no horizontal scroll in tested widths 320–1920.

## Surfaces, shapes and art

Use `.panel` for structural surfaces: one 1px neutral border, 10px outer radius, no panel shadow. Secondary controls and fields use 5–6px corners; stance and squad surfaces use 8px. The dungeon has its own 6px clipped scene boundary, not a second dashboard card. Its authored brick arch, LED-dot pattern, torch shapes and perspective floor are `assets/dungeon.svg`. Three original boss SVGs use crisp integer geometry, with pixelated rendering; the favicon is an original pixel hamster.

Art may use bounded drop shadows, segmented HP and dot patterns. Normal text stays solid. The native dialog's backdrop uses `#000b` and 5px blur; it has a 12px radius on desktop and 16px upper corners on mobile. It supplies actual modality and focus containment rather than a custom positioned overlay.

## Reusable patterns

- **Actions:** `.primary` is the one filled gold arena action. It enters/resumes a raid and becomes Wheel burst during combat. `.secondary` is neutral outlined, `.wallet-button` and `.boost-button` are muted gold, `.text-button` is underlined utility text. Hover requires a hover-capable device; disabled controls are visibly dimmed. `:focus-visible` uses a 2px text-color outline at 4px offset.
- **Boss choices and stances:** native buttons with `aria-pressed`, stable selected geometry and visible state indicators. Locked stances disable until the next round. Loading/error updates do not rearrange unrelated panels.
- **Telemetry:** labeled number/unit pairs, `.feed-tag` with explicit Live/Cached/Unavailable text, native details for full hardware proof, manual refresh and stable missing-value dashes.
- **Squad:** labeled numeric inputs, load/random buttons and `.squeek-card`. Artwork is a validated SVG data URI used in an image element; metadata is escaped. Native details disclose owner and traits. Missing, cached and burned states are distinct and unavailable members contribute zero power.
- **Calculator:** two labeled fields, validity state and inline error/status, prominent computed result and native details containing all ten levels.
- **Terminal:** `.terminal-action` exposes the method, eligibility/gas context and full contract address in details. Buttons remain unavailable until the wallet is on Sepolia. Each action has its own persistent status region and explorer link.
- **Wallet sheet:** native `dialog`, one close control, per-wallet pending state, EIP-6963 provider names, raw provider fallback, mobile opening links and Disconnect. Escape/backdrop close; focus returns to Connect.
- **Feedback:** session combat log with a separate polite announcement; local persistent XP/ranks/badges; written pending, success, reverted, rejection and retry states. Dynamic data is never presented as a shared leaderboard.

## Motion and extending the system

Hover/focus color transitions name their properties and use 130ms `cubic-bezier(.2,0,0,1)`. Press scale is 0.96 when motion is allowed. Boss breathing, spinning wheel, running hamster and damage feedback are opt-in under `prefers-reduced-motion:no-preference`; a visible Pause motion control stops ambient motion. The rhythm marker is also stationary for reduced motion or paused motion, preserving playability. The game itself has separate pause/resume controls.

For another section, start with `.section-heading` and `.panel`, use existing field/action patterns, keep addresses wrapping, and add both language strings. Preserve the distinction between locally earned progress and confirmed chain transactions. Reuse the six type sizes and semantic colors. Do not add a CDN font, a competing primary fill or a new shadowed card layer. Recheck the actual export at 390px and desktop after changes.

Design guidance was adapted from Jakub Krehel's Better Interface (MIT). Documentation methodology was adapted from Paul Bakaus's Impeccable document reference (Apache-2.0). This document describes this implementation; attribution and original licenses are preserved in `THIRD_PARTY_NOTICES.md`.

# Squeek Raid

**Wheel-Powered Boss Dungeon & Tester Terminal** for Squeekchain. A single-page, hardware-driven local raid game with real on-chain Squeek artwork and a real Sepolia transaction terminal.

The production site is plain `index.html`, `styles.css`, `app.js` and local assets. It has **zero runtime packages, CDN imports, backend services or private keys**. TypeScript and Playwright are development tools only. The complete static export is in `dist/`.

## Install, preview and rebuild

Use Node.js 20.11 or newer.

```sh
npm ci
npm run build
npm run preview
```

Open `http://localhost:4173`. `PORT=8080 npm run preview` chooses another port. The dependency-free build copies only the three runtime files and `assets/` into `dist/`. Build and preview also work without installing development tools:

```sh
node scripts/build.mjs
node scripts/preview.mjs
```

Serve the contents of `dist/` on any static host. Asset URLs are relative and navigation uses page anchors; no rewrite rules or domain-specific base URL are needed. Serve over HTTP(S) rather than opening a `file://` URL. A host supplies the final URL for the relative Open Graph image.

## Play

1. Select Block Eater Golem, Sloth Leviathan or Latency Dragon and **Enter raid**. The primary button becomes **Wheel burst**, so the fight stays playable beside the boss. Boost in the gold zone for a perfect beat; Space also activates a boost when not editing a form or another control.
2. Select and lock a tactical stance. The lock lasts for the current 10-minute round. Overclock multiplies damage by 1.5 when RPM is nonzero or for 60 seconds after observed settled work increases. Night Watch earns 3 Raid Points per active second and charges 5% counter energy per second when the live API reports IDLE (1 point / 1% otherwise). Block Breaker predicts at least one new block in the next observed settled batch and awards 100 RP plus 50 XP on success.
3. Use Seed strike (8-second cooldown) or a fully charged Counter-attack in the combat panel. Pause/resume the raid at any time. Motion has its own pause control and respects reduced-motion preferences; reduced motion makes the timing target stationary.
4. Defeating a boss earns 250 XP and its loot badge. Ranks advance every 500 XP, up to Hamster legend. XP, Raid Points, badges, stance locks, selected token IDs and language persist in localStorage. Combat and rewards are local; they do not create chain balances or imply a shared leaderboard. The combat log is session-only. Combat pauses while the page is hidden and does not award elapsed offline progress.
5. Load any three distinct IDs from 1–9999, or summon a random squad. Defaults are #1, #42 and #888. Metadata names, artwork, power, levels, merge state, owner and traits come from the public API. Burned or unavailable members contribute no power. Using a token in this local simulator neither requires ownership nor moves it.

Base DPS is `12 + squadPower / 100`. Live speed adds a capped multiplier `1 + speedMmPerSecond / 1000` (maximum ×2). Boss shields depend on cumulative work, 24-hour work, speed and remaining HP; newly observed hardware work also deals bounded damage. These are this game's mechanics, not Squeekchain protocol rules.

The merge/staking calculator uses `W = P + S * (1 + P/1000) / c`, with `c` read from the API (40 SQK per power). Its 10-level pyramid uses the reported power and cooldown arrays. It never submits a merge or a staking transaction.

## Live sources and fallback

All public requests use `https://api.squeekchain.com/v1/`:

| Endpoint | Used for |
| --- | --- |
| `status` | Measurement state, RPM ÷ 1,000, speed, distance ÷ 1,000,000 to km, work, block height, progress ÷ 1e9 × 100, settled round, work per thousand blocks, signer and module proof |
| `settlements?range=24h` | Summary, 24 Canvas bars, accessible data table and recent Etherscan transaction links |
| `economy/state` | 18-decimal SQK supply, staked NFT power, SQK-per-power and all ten merge levels/cooldowns |
| `squeeks/{id}` | Live SVG data URI, name, level, base power, merge state, custody owner and attributes |

The three telemetry feeds refresh every 12 seconds while the page is visible; refreshes resume on return. Requests time out after 8.5 seconds, settle independently, retain last-good memory and localStorage data, and label cached data clearly. An empty first visit shows unavailable values without inventing telemetry, artwork or protocol power; the base game still works. NFTs refresh on squad load and are cached individually. The hardware badge reports the API's Trust-M identity/signature information; this browser does not independently verify its cryptographic signature. Reported core status and numeric measurements are displayed as received, even if the upstream reports IDLE with nonzero RPM.

Round IDs come from the economy API with the 10-minute UTC boundary extrapolated between responses. Without round data, the UI labels a local practice round. Stance predictions use the settled anchor, which advances even for zero-work batches omitted from recent settlements. If several batches are missed between successful refreshes, the next observed anchor represents their combined change. This is a local game prediction, not an on-chain wager.

## Sepolia terminal

Connect through the header. Browser wallets are discovered by EIP-6963, with `window.ethereum` as a fallback. The picker provides mobile wallet-browser links, Escape/backdrop dismissal, focus return and Disconnect. The explicit raw EIP-1193, zero-library brief takes precedence over the reference guide's wagmi/Coinbase SDK stack: no passkey Smart Wallet, WalletConnect relay or project ID is included. Mobile app-opening links depend on installed wallet apps and were not device-tested.

The chain is **Sepolia, 11155111 (`0xaa36a7`)**. Switching falls back to adding Sepolia with public RPC `https://ethereum-sepolia-rpc.publicnode.com`. Reads and sends use the visitor's wallet provider; there is no application RPC key.

| Action | Official destination | Call |
| --- | --- | --- |
| Ping SQK Token | `0x5501e1fa81be1c3f49225fa7668da0245d07db60` | `approve(0x4b67b739dfd832f4eac67a7aa3bc244fb74cea4f, 0)` |
| Claim Test Squeek | `0x1ff6485abfbb2d183cd673d78e1ab31c098e04dd` | `claim(1)` |
| Mining checkpoint | `0xcd46990f8349057335289ef282c276204b6cdc62` | `checkpoint()` |

Every action checks the current chain, runs the exact transaction as `eth_call`, rechecks account and network, and requests `eth_sendTransaction` with `value: '0x0'` and the brief's exact calldata. The wallet supplies gas estimates and asks for approval. Approve-zero resets any existing SQK allowance for that spender to zero. A successful receipt is required for the local Tester badge. The dispenser can reject a claim based on its eligibility rules.

Statuses distinguish simulation failure, wallet rejection, submitted, confirmed, reverted and still pending. Pending hashes survive reload; reconnect on Sepolia to resume receipt checks. Polling is bounded to about two minutes, after which a receipt can be checked again. No transaction is resubmitted automatically. **Sepolia ETH is required for gas even when contract value is zero.**

## Checks actually run

- Production build: `npm run build` — passed.
- Checked JavaScript typecheck: `npm run typecheck` — passed (TypeScript `checkJs`, no emit).
- Engine validation: `npm test` — 6 tests passed.
- Rendered interaction validation: `npm run test:browser` — 20 Chromium assertion groups passed. It serves the production export under `/preview/`, exercises eight widths from 320 to 1920, uses explicitly synthetic API/wallet fixtures, and checks combat, victories, ranks, stances, 12s refresh, first-visit/offline fallback, SVG art, squad validation, formula errors, language, wallet gating, exact call/send bytes, receipts and errors. No Sepolia transactions were broadcast.
- Pinned `taste.mjs --out test/scratch/taste` — all 16 checks passed. Final retained result: `artifacts/design-probe.json`.
- Assigned browser: real public APIs rendered successfully; inspected English and Chinese at 390px and the full 1440px page, no-wallet sheet, focus return and motion controls. No console errors or warnings were observed on the live page.

For local browser validation:

```sh
npx playwright install chromium webkit
npm run test:browser
```

In this run development packages and browser binaries were installed outside the repository; `PATH`, `SQUEEK_PLAYWRIGHT`, `IMD_PLAYWRIGHT` and `PLAYWRIGHT_BROWSERS_PATH` selected those tools. The exact external tooling paths are not part of the site. WebKit downloaded but **could not launch because the system lacks GTK/GStreamer and related shared libraries**; Safari remains unverified. The browser script reports that limitation separately. An actual wallet connection/signature, phone wallet deep links, native zoom and assistive-technology sessions were not tested. Automated coverage is not a full accessibility certification.

See `DESIGN.md` for the implemented system and `artifacts/validation.md` for six-domain coverage, fixes, contrast measurements and limitations. Screenshots in `artifacts/` show the actual export with live API data; test fixtures are never exported. `THIRD_PARTY_NOTICES.md` preserves the design-guide attribution and licenses.

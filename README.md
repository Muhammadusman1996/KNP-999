# KNP-999 Game Arena

A fresh standalone project. It does not import or modify the older KNP999 repository.

## Run
1. Install Node.js 20+
2. `npm install`
3. `npm run dev`
4. Open the local URL printed by Vite.

## Included
- 140 individually named catalogue entries, categories, color palettes and generated SVG logos.
- A separate game entry module for every title.
- Original browser-side practice gameplay engines for slots, crash, step progression, plinko, wheel, dice, fishing, arcade, card and puzzle mechanics.
- Search, category filters, mobile-responsive lobby and a practice-coin wallet.

## Important scope note
The exact full H555 140-title source list was not available in the current project context. This ZIP preserves the 20-title sample plus the three other names recovered from prior notes and fills the remaining catalogue with original placeholder titles. It is a playable original prototype package, not a verified recreation of proprietary H555 games, artwork, live services, or server-side outcomes. Practice coins have no cash value; no real-money betting or payouts are implemented.


## Expanded gameplay update
- Added bet controls, round counter, history display, help panel and optional synthesized sound effects.
- Added animated slot reels, crash multiplier/cash-out, plinko drop lane, wheel spin, dice prediction, fishing target practice, arcade scoring, sequence puzzle, blackjack, rummy and poker-style practice rounds.
- Practice coin balance is saved in the browser on the same device.
- Game modules remain individually addressable and each has its own logo/color identity.

This remains a local/browser practice build. It does not connect to H555 or any licensed game provider, does not reproduce proprietary game outcomes, and does not implement real-money deposits, withdrawals, gambling or certified RNG. The catalogue includes generated titles where the exact original 140-title list was unavailable.


## Server and multiplayer foundation added
- Express API server and SQLite-backed player practice wallets.
- Server-side round-result endpoint for practice rounds and a transaction ledger.
- Admin API for enabling/disabling games and toggling bonus availability (`ADMIN_KEY` required).
- Socket.IO game rooms with player counts and room chat events.
- Individual per-title game specification records (140), including controls, rule descriptions, bonus definitions, audio/animation profiles.
- Server-side practice outcome generation for supported engine families.

## Setup
- Use Node.js 20+.
- `npm install`
- Set `ADMIN_KEY` to a long private random value in the hosting environment.
- `npm run build`
- `npm start`
- Admin page: `/admin.html`

## Important limitations
This is a server-backed **practice-coins foundation**, not a licensed gambling platform. The current game UI has not yet been fully migrated so every visible button submits every round to `/api/round`; some existing local game interactions remain client-side. Socket.IO currently provides game-room presence and chat, not synchronized real-time game state or live dealer video. Exact title-specific rules, certified random number generation, provider audio/art, live dealer feeds, real-money wallet/deposits/withdrawals and production multiplayer require authorized provider specifications, licensed assets, security review and further integration. No H555 proprietary server or assets are included.

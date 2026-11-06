# KNP-999 Game Arena

## Current source package
- 140 game entries and 140 separate game modules under `src/engines/`.
- Every module contains its own game-home screen, category label, title-specific artwork, theme, bet selector, controls, rules and playable virtual-coin game flow.
- No game module imports a shared `runtime.js`; the previous shared runtime has been removed.
- The lobby continues to use the existing category filters and opens the matching game's own module.
- Each game has its own SVG logo asset with game title, unique initials, color palette and category-specific iconography.
- Bet choices start at 10 Coins: 10, 20, 50, 100, 200, 500, 1,000, 2,000, 5,000 and 10,000.
- All balances are virtual Coins only. They have no cash value, no withdrawals, and no real-money wagering or payment integration.

## Account security
- Passwords are stored as scrypt hashes, not plaintext.
- The registration SQL parameter-count issue is fixed.
- The browser retains the login token, but the account database itself must be on persistent storage.
- On Render, use a Persistent Disk mounted at `/var/data` and set `DB_PATH=/var/data/knp999.sqlite`, or migrate to PostgreSQL. Back up and migrate existing customer data before changing DB_PATH.

## Scope
These are original playable genre-based mini-games implemented locally for virtual Coins. They are not exact copies of proprietary third-party game software, licensed artwork, live dealer services, or real-money games. Game mechanics differ by genre and by game configuration, but they do not claim to reproduce every commercial title's original certified math, assets, jackpots, or live features.

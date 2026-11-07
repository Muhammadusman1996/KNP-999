# KNP-999 — 140 Individual Game Rooms

- 140 game modules now contain their own standalone screen flow and game logic; they no longer import `src/engines/runtime.js`.
- Each game has a separate home/intro page, category label, theme, artwork, bet selector and play controls.
- Each logo is a game-specific SVG with its own title, color palette and category motif (not a star placeholder).
- Bet sizes are virtual Coins: 10, 20, 50, 100, 200, 500, 1,000, 2,000, 5,000 and 10,000.
- This is an original virtual-coin arcade implementation inspired by broad game genres, not an exact reproduction of proprietary third-party games, their licensed art, live feeds, or real-money wagering.
- Virtual Coins have no cash value, cannot be withdrawn, and are not connected to a payment processor.

## Account security and persistence
- Passwords are stored as scrypt hashes, not plaintext.
- Registration SQL has been corrected to bind only the five placeholders; the initial `coins=100` is a SQL literal.
- Login tokens are stored by the browser client, but account persistence depends on a persistent database.
- To retain customer accounts across Render redeploys, configure a Render Persistent Disk mounted at `/var/data` and set `DB_PATH=/var/data/knp999.sqlite`, or migrate the existing data to PostgreSQL.
- Back up and migrate the existing database before changing DB_PATH. Do not point the service at a new empty database if existing customer accounts must remain available.

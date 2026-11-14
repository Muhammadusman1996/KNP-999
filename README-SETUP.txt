KNP-999 — Firebase Shared Wallet backend starter

Included in this package:
- Eight supplied game HTML pages and existing UI updates.
- Customer mobile/password account page.
- Admin user list and Add Coins UI.
- Firebase Cloud Functions for secure server-side profile creation, 50-coin welcome grant, wallet balance lookup, bet debit, win settlement, and admin coin credit.
- Firestore rules that block direct client-side balance edits.
- shared-wallet.js client helper exposing window.KNPWallet.balance(), debit(game, amount), credit(game, amount, roundId).

IMPORTANT STATUS — NOT LIVE YET
This is prepared source code, not a deployed Firebase service. I cannot create resources inside your Google account, publish rules/functions, or connect to a Firebase project without its project configuration and your deployment action. The eight games' individual bet/win handlers have NOT yet been rewritten to call KNPWallet.debit()/credit(); therefore do NOT treat their game balances as one working live wallet yet. The helper/backend are the secure integration layer to use when each game's actual bet and payout callbacks are connected.

What you must do once, using your own Google account:
1. Create/select a Firebase project at https://console.firebase.google.com/ and register a Web App.
2. Enable Authentication > Email/Password and create Firestore Database.
3. Copy the Web App config into firebase-config.js. Set KNP_ADMIN_EMAIL to the admin's Firebase Auth email.
4. Install Firebase CLI, run `firebase login`, then `firebase use --add` and select your project.
5. Copy `functions/.env.example` to `functions/.env` and set KNP_ADMIN_EMAIL to the same admin email.
6. Run `cd functions && npm install`, then from project root deploy with `firebase deploy --only firestore:rules,functions`.
7. Host the site over HTTPS.

Wallet function contract:
- `createPlayerProfile({name, phone})` creates profile and grants 50 coins once in a server transaction.
- `getWallet({})` returns current coin balance.
- `placeBet({game, amount})` deducts whole Coins atomically and rejects insufficient balance.
- `settleWin({game, amount, roundId})` credits a win once per unique roundId.
- `adminAddCoins({uid, amount})` credits coins only for the configured admin account.
- `shared-wallet.js` exposes `window.KNPWallet.balance()`, `.debit(game, amount)`, `.credit(game, amount, roundId)`.

Before production, every game must replace its local balance deductions and payout additions with these server calls and handle pending/error states. Game-specific callbacks need to be tested individually. Do not use this package for real-money play; it is a virtual coin wallet starter.

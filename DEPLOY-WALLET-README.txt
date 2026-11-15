KNP-999 WALLET BACKEND DEPLOYMENT

This package includes the current KNP-999 source and a Windows PowerShell deployment helper.

IMPORTANT: Cloud Functions and Firestore rules are not deployed by creating this ZIP. You must run the script while signed into the Google/Firebase account that owns project knp-999.

1) Open this extracted KNP-999-main folder in Windows PowerShell.
2) Confirm Node.js and npm are installed. Install Firebase CLI if needed: npm install -g firebase-tools
3) Create functions\.env with exactly one line (use the Firebase Auth email of the admin account):
   KNP_ADMIN_EMAIL=your-admin-email@example.com
   The Firestore rules currently authorize ms603329@gmail.com as admin; keep this value consistent with the admin account, or update the rules before deploying.
4) Run: .\DEPLOY-KNP-999.ps1
5) Wait for Firebase to report successful deployment, then refresh the website and test wallet balance.

KNOWN LIMITATIONS FROM THE SOURCE:
- The current settleWin Cloud Function intentionally rejects all win credits until server-side game outcome verification is implemented.
- The eight game HTML pages have not yet been connected to shared-wallet.js for every bet/win callback. This deployment can make the existing getWallet endpoint available, but it does NOT complete full shared-wallet gameplay across all eight games.
- Do not use for real-money play.

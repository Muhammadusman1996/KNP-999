$ErrorActionPreference = "Stop"

Write-Host "KNP-999 Firebase deployment" -ForegroundColor Cyan
if (-not (Get-Command firebase -ErrorAction SilentlyContinue)) {
  Write-Host "Firebase CLI missing. Install it with: npm install -g firebase-tools" -ForegroundColor Red
  exit 1
}
if (-not (Test-Path ".\functions\.env")) {
  Write-Host "Missing functions\.env. Create it and set KNP_ADMIN_EMAIL to your Firebase admin login email." -ForegroundColor Red
  exit 1
}
Write-Host "Signing in to Firebase (browser may open)..." -ForegroundColor Yellow
firebase login
if ($LASTEXITCODE -ne 0) { throw "Firebase login failed" }
Write-Host "Installing Cloud Functions dependencies..." -ForegroundColor Yellow
npm --prefix functions install
if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
Write-Host "Deploying Firestore rules and Cloud Functions to knp-999..." -ForegroundColor Yellow
firebase deploy --only firestore:rules,functions --project knp-999
if ($LASTEXITCODE -ne 0) { throw "Firebase deployment failed" }
Write-Host "Deployment command completed. Now reload KNP-999 and check the wallet." -ForegroundColor Green

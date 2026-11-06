# Android APK — KNP-999

## اہم بات
یہ ZIP اب Capacitor Android build configuration کے ساتھ تیار ہے۔ یہ خود تیار شدہ APK نہیں ہے۔ APK بنانے کے لیے Android Studio، Android SDK، JDK 17، Node.js 20+ اور Gradle درکار ہیں۔

## 1) سرور پہلے deploy کریں
KNP-999 کا Express API کسی HTTPS domain پر چلائیں۔ SQLite database کے لیے hosting پر persistent disk/volume لگائیں اور `DB_PATH` اسی persistent جگہ پر رکھیں۔ `ADMIN_KEY` کو secret رکھیں۔

## 2) Android build
پروجیکٹ فولڈر میں:
```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```
Android Studio میں Gradle sync مکمل ہونے کے بعد **Build > Build Bundle(s) / APK(s) > Build APK(s)** منتخب کریں۔

## 3) APK کو API سے جوڑیں
APK build سے پہلے `.env` یا build environment میں:
```bash
VITE_API_BASE_URL=https://YOUR-DEPLOYED-API-DOMAIN
```
پھر:
```bash
npm run android:sync
```
`VITE_API_BASE_URL` کو اصل HTTPS API domain سے بدلنا لازمی ہے۔ خالی رہنے پر Android app کی `/api` requests اپنے فون کے WebView host پر جائیں گی اور login/wallet/server کام نہیں کریں گے۔

## لوگو
`public/assets/knp-999-logo.png` اور `public/assets/icon-192.png`, `icon-512.png` ویب/PWA assets ہیں۔ Capacitor Android project بننے کے بعد Android Studio کے **Image Asset** tool میں یہی `knp-999-logo.png` منتخب کریں تاکہ Launcher/App icon بھی یہی ہو۔ اس ZIP میں Android native project اور APK binary شامل نہیں، کیونکہ APK compile کرنے کے لیے Android SDK/Gradle environment درکار ہے۔

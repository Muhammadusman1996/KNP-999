# KNP-999 Logo اور Admin WhatsApp رابطہ

- منتخب کیا گیا ڈیزائن: 12 لوگوز والی شیٹ کا نمبر 1 (اوپر بائیں، گولڈن کراؤن/اسپَیڈ شیلڈ)۔
- ویب سائٹ: `public/assets/knp-999-logo.png`؛ ہیڈر اور لاگ اِن اسکرین میں استعمال۔
- Browser icon / PWA: `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` اور `public/manifest.webmanifest`۔
- Android launcher icons: `android-icon-assets/app/src/main/res/mipmap-*` میں `ic_launcher.png` اور `ic_launcher_round.png`۔

## Admin Contact
- دکھایا جانے والا نمبر: `03111810070`
- WhatsApp لنک: `https://wa.me/923111810070`
- ویب سائٹ کے لاگ اِن صفحے اور گیم لابی کے footer میں شامل ہے۔

## APK کے بارے میں
اس ZIP میں Android launcher icon کے درست density assets شامل ہیں، لیکن اصل Android/Capacitor project اس ZIP میں موجود نہیں تھا؛ اس لیے APK binary یا موجودہ APK کے اندر icon replace ہونے کا دعویٰ نہیں کیا جا رہا۔ Android project بناتے وقت اوپر دیے گئے mipmap assets کو `android/app/src/main/res/` میں رکھیں اور AndroidManifest میں `@mipmap/ic_launcher` استعمال کریں۔

# KNP-999 فائنل اپڈیٹ — کسٹمر اکاؤنٹ اور Add Balance

- رجسٹریشن: Username، موبائل، ای میل، پاس ورڈ۔ نئے اکاؤنٹ کو 100 ڈیمو کوائنز۔
- لاگ اِن: Username، موبائل یا ای میل + پاس ورڈ۔
- کسٹمر Add Balance سے کوائنز کی درخواست بھیج سکتا ہے؛ ادائیگی کی تفصیل/ٹرانزیکشن ID بھی لکھ سکتا ہے۔ درخواست Pending رہتی ہے۔
- Admin Pending درخواست دیکھ کر Approve کرے تو ہی کوائنز والٹ میں شامل ہوتے ہیں۔ Admin دستی طور پر بھی کوائنز دے سکتا ہے۔
- Admin کی کسٹمر لسٹ میں صرف Username اور Balance ہیں۔ پاس ورڈ سیکیور hash میں محفوظ ہے، دکھایا نہیں جاتا؛ Admin نئے پاس ورڈ کے ذریعے reset کر سکتا ہے۔
- راؤنڈ ریکارڈ میں net (payout - stake) بھی محفوظ کیا جاتا ہے۔

## ضروری حفاظتی/عملی نوٹس
- یہ Add Balance فیچر ادائیگی خود وصول نہیں کرتا؛ یہ درخواست اور Admin approval کا نظام ہے۔ حقیقی Easypaisa/JazzCash/بینک ادائیگی کے لیے مجاز merchant/payment gateway کی credentials اور webhook درکار ہوں گے۔
- 100 ابتدائی کوائنز اور تمام گیمز practice/demo coins ہیں؛ ان کی نقد قیمت یا withdrawal نہیں۔
- موجودہ 140 گیم فائلیں الگ entry modules ہیں لیکن سب 140 کے 140 الگ مکمل طور پر منفرد engines نہیں؛ وہ چند gameplay families/runtime استعمال کرتی ہیں۔ اسی طرح ہر گیم کا ہر spin ابھی server round API سے منسلک نہیں۔ اسے مکمل production-grade 140 منفرد engines یا APK کہنا درست نہیں ہوگا۔
- موجودہ SQLite ڈیٹا برقرار رکھنے کے لیے hosting پر persistent disk لگائیں اور DB_PATH کو اس disk پر مقرر کریں؛ ephemeral filesystem پر ڈیٹا ضائع ہو سکتا ہے۔
- سرور پر ADMIN_KEY لازماً مضبوط secret رکھیں۔

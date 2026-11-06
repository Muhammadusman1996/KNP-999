# KNP-999 API اور اکاؤنٹ سسٹم
- Register: موبائل، ای میل، پاس ورڈ؛ پہلے اکاؤنٹ پر 100 demo coins۔
- Login: موبائل یا ای میل اور پاس ورڈ۔
- Password scrypt hash میں محفوظ؛ plain password admin کو نہیں دکھتا۔
- Session token، کامیاب/ناکام login logs، IP اور user-agent محفوظ۔
- `/api/history` راؤنڈ ہسٹری؛ `/api/admin/users` کسٹمرز/لاگ اِن؛ `/api/admin/users/:id/coins` admin coin credit۔
- سرور پر `ADMIN_KEY` لازمی؛ HTTPS لازمی۔ `DB_PATH` اختیاری SQLite path ہے۔
- بیرونی provider API صرف تب درکار ہے جب لائسنس یافتہ provider کے اصل games/rounds/assets چاہئیں۔ اپنی original practice games کے لیے API لازمی نہیں۔
## ابھی باقی
- ہر گیم کے ہر spin کو server-authoritative round endpoint سے جوڑنا باقی ہے؛ موجودہ runtime ابھی local wallet کو بھی mutate کرتا ہے، اس لیے اسے production secure wallet نہ سمجھیں۔
- موجودہ 140 entries ابھی 140 مکمل الگ mechanics نہیں؛ مشترکہ engine families استعمال کرتی ہیں۔
- email/SMS verification، password reset، rate limits، admin audit log، backup اور security review production سے پہلے لازم ہیں۔

# KNP-999 — NexusGGR انٹیگریشن نوٹس

## اس اپ ڈیٹ میں کیا شامل کیا گیا
- `server/integrations/nexusggr.js`: سرور سائیڈ NexusGGR API کلائنٹ۔
- 25 method wrappers: Provider/Game، Agent/User، Transfer، Player/Game History، RTP، Bonus، Seamless اور FreeSpin Tour۔
- `GET /api/admin/nexus/status`: ایڈمن کے لیے کنفیگریشن اسٹیٹس اور سپورٹڈ methods۔
- `POST /api/admin/nexus/call`: ایڈمن کی محفوظ سرور سائیڈ API کال؛ `x-admin-key` لازمی۔
- `.env.example` میں NexusGGR credentials کے placeholders۔

## ضروری سچائی / ابھی کیا مکمل نہیں
یہ اپ ڈیٹ NexusGGR کے لیے محفوظ backend adapter اور admin-only call gateway شامل کرتی ہے۔ یہ خودبخود live casino games، provider logos، provider launch URLs یا provider-side game assets نہیں بناتی۔ اس کے لیے حقیقی `agent_code`/`agent_token`، NexusGGR کی منظور شدہ اکاؤنٹ کنفیگریشن، ہر API کے مکمل request schemas، اور live provider response tests درکار ہیں۔

آپ کے بھیجے گئے صفحات میں بعض methods کے مکمل request fields نہیں تھے؛ اس لیے نامعلوم fields گھڑ کر کسی مخصوص launch یا transfer workflow کو خودکار نہیں کیا گیا۔ Admin gateway کے ذریعے صرف اسی method کے docs کے مطابق fields بھیجیں۔

## موجودہ KNP-999 گیمز
- اس ZIP میں 195 engine files اور الگ game logo assets موجود ہیں (فائلوں کی موجودہ تعداد سے تصدیق شدہ)۔
- موجودہ project notes کے مطابق کئی گیمز 13 بنیادی gameplay families کے مشترک mechanics استعمال کرتی ہیں؛ ہر game کا الگ نام/لوگو ہونا مکمل طور پر الگ commercial-grade game engine ہونے کے برابر نہیں۔
- UI کو KNP-999 کی اپنی شناخت میں رکھا گیا ہے۔ H555 کے لوگو، نام یا proprietary artwork کی نقل نہیں کی گئی، اور صارف کو کسی دوسرے پلیٹ فارم کا تاثر دینے کے لیے impersonation نہیں کیا گیا۔

## موجودہ مالی ماڈل
KNP-999 موجودہ طور پر virtual coins mode استعمال کرتا ہے۔ NexusGGR کے `user_deposit`, `user_withdraw`, `user_withdraw_reset`, `transfer_status` methods کا wrapper موجود ہے، لیکن انہیں customer-facing routes سے نہیں جوڑا گیا۔ اس طرح اس ZIP میں customer deposits/withdrawals/payouts فعال نہیں کیے گئے۔

## سیٹ اپ
1. `.env.example` کی کاپی `.env` بنائیں۔
2. اپنے server environment میں `NEXUSGGR_AGENT_CODE` اور `NEXUSGGR_AGENT_TOKEN` رکھیں۔
3. `.env` کو GitHub پر commit نہ کریں۔
4. `npm install`، پھر `npm run check` اور `npm run check:nexus` چلائیں۔
5. API method استعمال کرنے سے پہلے متعلقہ NexusGGR documentation کے مطابق `fields` object دیں۔
6. Admin API call میں `x-admin-key` header لازمی ہے۔

## Rate limits (آپ کے فراہم کردہ صفحے کے مطابق)
- `user_withdraw_reset` with `all_users=true`: ایک منٹ میں ایک بار
- `get_game_log`: ایک منٹ میں ایک بار
- `game_list`: ایک سیکنڈ میں ایک بار
- `provider_list`: ایک سیکنڈ میں ایک بار
- `agent_statistics`: ہر 5 سیکنڈ میں ایک بار

سرور کلائنٹ میں مذکورہ per-process rate limits نافذ ہیں۔ متعدد server instances چلانے کی صورت میں مشترکہ Redis/database rate limiter درکار ہوگا۔

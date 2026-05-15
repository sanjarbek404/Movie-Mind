# 🎬 MovieMind - Kinosayti

MovieMind - bu eng so'nggi va ommabop kinolarni izlash, ma'lumot olish va saqlash imkonini beruvchi zamonaviy web-ilova. Loyiha to'liq **O'zbek tilida** ishlab chiqilgan bo'lib, foydalanuvchilarga qulay va tezkor tajriba taqdim etadi.

Dastur **TMDb API** asosida ishlaydi va zamonaviy web-texnologiyalar yordamida yaratilgan.

## 🚀 Imkoniyatlar

- **Eng so'nggi va ommabop kinolar:** Har doim yangi va reytingi baland kinolardan xabardor bo'ling.
- **Qidiruv:** Istalgan kinoni nomi orqali tez va oson toping.
- **Janrlar bo'yicha filtrlash:** Kinolarni o'zingiz yoqtirgan janrlar bo'yicha ajratib oling.
- **Batafsil ma'lumot:** Kinoning qisqacha mazmuni, rejissyori, aktyorlari va treyleri haqida ma'lumot oling.
- **O'xshash kinolar:** Siz tanlagan kinoga o'xshash boshqa filmlarni ko'ring.
- **Saqlanganlar ro'yxati (Sevimlilar):** O'zingizga yoqqan kinolarni saqlab qo'ying va ularni alohida ro'yxatda boshqaring.
- **To'liq O'zbek tilida:** Barcha ma'lumotlar, interfeys va tavsiflar o'zbek tiliga moslashtirilgan.
- **Zamonaviy va Responsiv Dizayn:** Barcha qurilmalarda (kompyuter, planshet, mobil telefon) mukammal ishlaydigan UI/UX.

## 🛠 Texnologiyalar

Loyiha eng zamonaviy Frontend texnologiyalaridan foydalangan holda yaratilgan:

- **React (Vite bilan):** Tezkor va ishonchli UI yaratish uchun.
- **TypeScript:** Xatoliklarni oldini olish va kod sifatini oshirish uchun.
- **Tailwind CSS:** chiroyli va responsiv dizayn uchun.
- **Framer Motion:** Yumshoq va chiroyli animatsiyalar uchun.
- **Lucide React:** Zamonaviy SVG ikonkalardan foydalanish uchun.
- **TMDb API:** Kinolar haqidagi ma'lumotlarni olish uchun.

## 📦 O'rnatish va Ishga tushirish

Loyihani o'z kompyuteringizda ishga tushirish uchun quyidagi qadamlarni bajaring:

1. Reypozitoriyni yuklab oling:
   \`\`\`bash
   git clone <repo-url>
   cd <repo-folder>
   \`\`\`

2. Kerakli kutubxonalarni o'rnating:
   \`\`\`bash
   npm install
   \`\`\`

3. Muhit o'zgaruvchilarini sozlang:
   Loyiha ildizida \`.env\` faylini yarating va TMDb API kalitingizni kiriting:
   \`\`\`env
   VITE_TMDB_API_KEY=sayzning_tmdb_api_kalitingiz
   \`\`\`

4. Loyihani ishga tushiring:
   \`\`\`bash
   npm run dev
   \`\`\`

Ilova \`http://localhost:3000\` yoki ko'rsatilgan portda ochiladi.

## 🌐 GitHub Pages orqali joylashtirish

Loyiha **GitHub Actions** yordamida to'g'ridan-to'g'ri GitHub Pages'ga joylashtirish uchun sozlangan. 
`.github/workflows/deploy.yml` fayli orqali push qilinganda avtomatik ravishda build qilinadi va deploy bo'ladi.
(GitHub repository settings dan \`Pages\` -> \`Source: GitHub Actions\` ni tanlashni unutmang!)

## 👨‍💻 Muallif

**Sanjarbek Otabekov** tomonidan yaratilgan.
- Bog'lanish uchun: [sanjarbekdev28@gmail.com](mailto:sanjarbekdev28@gmail.com)

## 📄 Litsenziya

MIT License. Loyihadan erkin foydalanishingiz mumkin.

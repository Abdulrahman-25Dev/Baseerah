import { NextResponse } from 'next/server';
import axios from 'axios';

// روابط الكتب الرسمية داخل API الخاص بـ fawazahmed0
const bookEndpoints: Record<string, string> = {
  'ara-bukhari': 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json',
  'ara-muslim': 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.json',
  'ara-tirmidhi': 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-tirmidhi.json', // 👈 إضافة سنن الترمذي هنا
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book') || 'all';

  // تحويل اسم الكتاب القادم من الفرونت إند ليتوافق مع معرفات الـ API
  let apiBookName = 'ara-bukhari'; // الافتراضي
  let displayName = 'صحيح البخاري';
  let mohdithName = 'البخاري';
  let hadithHokm = 'صحيح';

  if (book === 'صحيح مسلم') {
    apiBookName = 'ara-muslim';
    displayName = 'صحيح مسلم';
    mohdithName = 'مسلم';
    hadithHokm = 'صحيح';
  } else if (book === 'سنن الترمذي') { // 👈 فحص إذا كان المطلوب سنن الترمذي
    apiBookName = 'ara-tirmidhi';
    displayName = 'سنن الترمذي';
    mohdithName = 'الترمذي';
    hadithHokm = 'حسن صحيح'; // لأن الترمذي يشتهر بـ حسن صحيح في سننه
  }

  try {
    // جلب ملف الأحاديث الخاص بالكتاب المحدد
    const response = await axios.get(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${apiBookName}.json`);
    
    const hadithsList = response.data.hadiths;

    if (hadithsList && hadithsList.length > 0) {
      // اختيار حديث عشوائي
      const randomIndex = Math.floor(Math.random() * hadithsList.length);
      const randomHadith = hadithsList[randomIndex];

      // تحويل شكل البيانات لتناسب واجهتك تماماً
      const formattedHadith = {
        hadith: randomHadith.text,
        rawi: "رواه الصحابي المذكور في المتن", 
        mohdith: mohdithName,
        book: displayName,
        hokm: hadithHokm
      };

      return NextResponse.json([formattedHadith]);
    }

    return NextResponse.json({ error: "No hadiths found" }, { status: 404 });

  } catch (error: any) {
    console.error("Error fetching from fawazahmed0 API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
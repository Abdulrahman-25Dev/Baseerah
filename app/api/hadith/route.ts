import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

// 1. القائمة العشوائية النقية المعتمدة
const RANDOM_BOOKS_POOL = [
  { key: "ara-bukhari", name: "البخاري" },
  { key: "ara-muslim", name: "مسلم" },
  { key: "ara-tirmidhi", name: "الترمذي" },
  { key: "ara-nasai", name: "النسائي" },
  { key: "ara-malik", name: "مالك" },
];

const BOOKS_API_MAP: Record<string, string> = {
  "صحيح البخاري": "ara-bukhari",
  "صحيح مسلم": "ara-muslim",
  "سنن الترمذي": "ara-tirmidhi",
  "سنن النسائي": "ara-nasai",
  "موطأ مالك": "ara-malik",
  "رياض الصالحين": "ara-malik",
  "الأربعون النووية": "ara-nawawi",
};

const MOHDITH_MAP: Record<string, string> = {
  "ara-bukhari": "البخاري",
  "ara-muslim": "مسلم",
  "ara-tirmidhi": "الترمذي",
  "ara-nasai": "النسائي",
  "ara-malik": "مالك",
  "ara-nawawi": "مذكور في المتن",
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookParam = searchParams.get("book") || "جميع الأحاديث (عشوائي)";

    let bookKey = "";
    let currentMohdith = "";

    // الفحص العشوائي لـ "جميع الأحاديث"
    if (
      bookParam === "جميع الأحاديث (عشوائي)" ||
      bookParam === "all" ||
      bookParam === "جميع الأحاديث"
    ) {
      const randomChoice =
        RANDOM_BOOKS_POOL[Math.floor(Math.random() * RANDOM_BOOKS_POOL.length)];
      bookKey = randomChoice.key;
      currentMohdith = randomChoice.name;
    } else {
      bookKey = BOOKS_API_MAP[bookParam];

      if (!bookKey) {
        if (bookParam.includes("بخاري")) bookKey = "ara-bukhari";
        else if (bookParam.includes("مسلم")) bookKey = "ara-muslim";
        else if (bookParam.includes("ترمذي")) bookKey = "ara-tirmidhi";
        else if (bookParam.includes("نسائي")) bookKey = "ara-nasai";
        else if (
          bookParam.includes("موطأ") ||
          bookParam.includes("مالك") ||
          bookParam.includes("رياض")
        )
          bookKey = "ara-malik";
        else if (bookParam.includes("أربعون") || bookParam.includes("نووية"))
          bookKey = "ara-nawawi";
        else bookKey = "ara-bukhari";
      }

      // هنا الفحص الذكي الصارم: لو الكتاب المختار رياض الصالحين نثبت المحدث "النووي"
      if (bookParam === "رياض الصالحين" || bookParam.includes("رياض")) {
        currentMohdith = "النووي";
      } else {
        currentMohdith = MOHDITH_MAP[bookKey] || "البخاري";
      }
    }

    const url = `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${bookKey}.min.json`;

    const res = await axios.get(url);
    const hadithsList = res.data?.hadiths || [];

    if (!hadithsList.length) {
      return NextResponse.json(
        { error: "لم يتم العثور على أحاديث" },
        { status: 404 },
      );
    }

    const randomHadith =
      hadithsList[Math.floor(Math.random() * hadithsList.length)];

    // الفحص والتعريب الذكي للحكم
    let translatedHokm = "";

    if (
      bookKey === "ara-nawawi" ||
      bookParam.includes("أربعون") ||
      bookParam.includes("نووية")
    ) {
      translatedHokm = "مذكور في المتن";
    } else {
      const gradeTerms: Record<string, string> = {
        sahih: "صحيح",
        hasan: "حسن",
        daif: "ضعيف",
        maudu: "موضوع",
        maqtu: "مقطوع",
        marfu: "مرفوع",
        maukuf: "موقوف",
        mauquf: "موقوف",
        mursal: "مرسل",
        munqati: "منقطع",
        lighairihi: "لغيره",
        lidzatihi: "لذاته",
      };

      const rawGradeStr = (
        randomHadith.grade ||
        (randomHadith.grades && randomHadith.grades[0]?.grade) ||
        "sahih"
      ).toLowerCase();
      // قمنا فقط بإضافة : string حول المتغير word وتأمين القاموس
      const translatedParts = rawGradeStr
        .split(" ")
        .map(
          (word: string) =>
            (gradeTerms as Record<string, string>)[word] || word,
        );
      translatedHokm = translatedParts.join(" ");
    }

    const formattedHadith = {
      hadith: randomHadith.text || randomHadith.hadith || "",
      rawi: randomHadith.rawi || randomHadith.narrator || "مذكور في السند",
      mohdith: currentMohdith, // سيظهر الآن "النووي" بدقة شديدة لرياض الصالحين
      book: bookParam,
      hokm: translatedHokm,
    };

    return NextResponse.json([formattedHadith]);
    } catch (error: unknown) {
      const err =
        error instanceof Error ? error : new Error(String(error ?? "Unknown error"));
      console.error("Final API Error:", err.message || error);
      return NextResponse.json(
        {
          error: "حدث خطأ أثناء جلب الحديث",
          details: err.message || "Unknown error",
        },
        { status: 500 },
      );
    }
}

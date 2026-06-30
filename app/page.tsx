"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  RefreshCw,
  Copy,
  Share2,
  ChevronLeft,
} from "lucide-react";
import { hadithApi, HadithData } from "@/utils/hadithApi";

export default function BaseerahPage() {
  // 1. حالات التحكم بالمراحل والبيانات (States)
  const [step, setStep] = useState<"welcome" | "book-select" | "hadith-view">(
    "welcome",
  );
  const [selectedBook, setSelectedBook] = useState<string>("all");
  const [hadith, setHadith] = useState<HadithData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // مصفوفة الكتب المتاحة للفلترة
  const books = [
    { id: "all", name: "جميع الأحاديث", desc: "تصفح عشوائي من كافة الكتب" },
    {
      id: "صحيح البخاري",
      name: "صحيح البخاري",
      desc: "للإمام محمد بن إسماعيل البخاري",
    },
    {
      id: "صحيح مسلم",
      name: "صحيح مسلم",
      desc: "للإمام مسلم بن الحجاج النيسابوري",
    },
    {
      id: "الأربعون النووية",
      name: "الأربعون النووية",
      desc: "٤٢ حديثاً جامعاً في أصول الدين",
    },
    {
      id: "رياض الصالحين",
      name: "رياض الصالحين",
      desc: "من كلام سيد المرسلين للإمام النووي",
    },
    { id: "سنن الترمذي", name: "سنن الترمذي", desc: "من كتاب سنن الترمذي" },
  ];

  // 2. دالة جلب الحديث عند الانتقال أو التحديث
  const loadHadith = async (bookId: string) => {
    setLoading(true);
    const data = await hadithApi.getHadithByBook(bookId);
    if (data) {
      setHadith(data);
    }
    setLoading(false);
  };

  // عند اختيار كتاب، ننتقل للمرحلة الثالثة ونجلب أول حديث
  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setStep("hadith-view");
    loadHadith(bookId);
  };

  // دالة نسخ نص الحديث
  const handleCopy = () => {
    if (!hadith) return;
    const textToCopy = `"${hadith.hadith}"\n\nالراوي: ${hadith.rawi}\nالمحدث: ${hadith.mohdith}\nالكتاب: ${hadith.book}\nحكم المحدث: ${hadith.hokm}\n\n- عبر تطبيق بصيرة`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // دالة مشاركة الحديث 
  const handleShare = async () => {
  if (!hadith) return;
  
  // تنسيق النص المراد مشاركته بشكل مرتب وسلس
  const shareText = `\n« ${hadith.hadith} »\n\nالراوي: ${hadith.rawi}\nالمصدر: ${hadith.book}\nخلاصة حكم المحدث: ${hadith.hokm}\n\nتمت المشاركة من تطبيق بصيرة 🌟`;

  // 1. استخدام ميزة المشاركة الرسمية للنظام إن وجدت
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'حديث شريف من تطبيق بصيرة',
        text: shareText,
        url: window.location.href
      });
    } catch (error) {
      console.log('تم إلغاء المشاركة أو حدث خطأ:', error);
    }
  } else {
    // 2. حل بديل: نسخ النص للحافظة إذا كان المتصفح لا يدعم المشاركة
    try {
      await navigator.clipboard.writeText(shareText);
      alert('المتصفح لا يدعم المشاركة المباشرة، تم نسخ نص الحديث كاملاً بنجاح لمشاركته يدوياً! 📋');
    } catch (err) {
      console.error('فشل عملية النسخ:', err);
    }
  }
};
  return (
    <div className="min-h-screen bg-[#060f0d] bg-radial-gradient text-zinc-100 flex flex-col items-center justify-center p-4 overflow-x-hidden relative select-none">
      {/* تأثيرات إضاءة خلفية خفيفة */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* ==================== 1. الشاشة الترحيبية ==================== */}
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center max-w-md px-4 space-y-8 z-10"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-emerald-950/40 border border-emerald-500/20 rounded-full flex items-center justify-center shadow-inner">
                <BookOpen className="w-10 h-10 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 
              style={{fontFamily: 'IBM Plex Sans Arabic'}}
              className="text-5xl pb-4 font-bold text-transparent bg-clip-text bg-linear-to-b from-emerald-300 via-emerald-400 to-emerald-600 font-[IBM Plex Arabic]">
                بصيرة
              </h1>
              <p 
              style={{fontFamily: 'IBM Plex Sans Arabic'}}
              className="text-zinc-400 text-sm sm:text-base leading-loose">
                نافذتك الرقمية الميسرة لتصفح وقراءة الأحاديث النبوية الشريفة من
                مصادرها المعتمدة بأسلوب عصري.
              </p>
            </div>
            <button
              style={{fontFamily:"IBM Plex Sans Arabic"}}
              onClick={() => setStep("book-select")}
              className="w-full sm:w-auto px-10 py-4 bg-linear-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-950/50 active:scale-[0.98]"
            >
              ابدأ الرحلة
            </button>
          </motion.div>
        )}

        {/* ==================== 2. شاشة اختيار الكتب ==================== */}
        {step === "book-select" && (
          <motion.div
            key="book-select"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full max-w-xl px-2 space-y-6 z-10"
          >
            <div className="text-center space-y-2">
              <h2 
              style={{fontFamily:"IBM Plex Sans Arabic"}}
              className="text-2xl font-bold text-emerald-300 font-serif">
                اختر الموسوعة أو الكتاب
              </h2>
              <p 
              style={{fontFamily:"IBM Plex Sans Arabic"}}
              className="text-xs text-zinc-400">
                حدد المصدر المفضل لبدء عرض الأحاديث الشريفة منه
              </p>
            </div>

            {/* ابحث عن هذا الديف وضف عليه الفئات الثلاثة الأخيرة */}
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1 scrollbar-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
              {books.map((book) => (
                <button
                  key={book.id}
                  onClick={() => handleBookSelect(book.id)}
                  className="w-full p-4 bg-zinc-900/40 border border-zinc-800 hover:border-emerald-700/40 hover:bg-zinc-900/80 rounded-xl text-right transition-all group flex flex-col space-y-1 active:scale-[0.99]"
                >
                  <span 
                  style={{fontFamily:"IBM Plex Sans Arabic"}}
                  className="group-hover:text-emerald-400 text-base font-semibold transition-colors font-serif">
                    {book.name}
                  </span>
                  <span
                  style={{fontFamily:"IBM Plex Sans Arabic"}}
                   className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    {book.desc}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("welcome")}
              className="text-xs text-zinc-500 hover:text-emerald-400 flex items-center gap-1 mx-auto transition-colors"
            >
              <ChevronLeft className="w-3 h-3 rotate-180" /> العودة للرئيسية
            </button>
          </motion.div>
        )}

        {/* ==================== 3. شاشة عرض الأحاديث ==================== */}
        {step === "hadith-view" && (
          <motion.div
            key="hadith-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-2xl px-2 md:px-4 z-10 flex flex-col space-y-4"
          >
            {/* الكرت الزجاجي الفخم المطور */}
            <div className="relative overflow-hidden bg-linear-to-b from-zinc-900/85 to-zinc-900/60 backdrop-blur-xl border border-emerald-900/40 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between min-h-75">
              {/* ترويسة الكرت */}
              <div className="flex justify-between items-center border-b border-zinc-800/60 pb-3 mb-4">
                <span className="text-xs font-serif bg-emerald-950/60 text-emerald-400 px-3 py-1.5 border border-emerald-800/30 rounded-lg">
                  {books.find((b) => b.id === selectedBook)?.name}
                </span>
                <button
                  onClick={() => setStep("book-select")}
                  className="text-xs bg-zinc-950/60 px-3 py-1.5 border border-zinc-800/60 rounded-lg text-zinc-100 hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  تغيير الكتاب
                </button>
              </div>

              {/* متن الحديث */}
              <div className="grow flex items-center justify-center py-4">
                {loading ? (
                  <div className="flex flex-col items-center space-y-3">
                    <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
                    <p className="text-xs text-zinc-500">
                      جاري البحث في الموسوعة...
                    </p>
                  </div>
                ) : hadith ? (
                  <p 
                  style={{fontFamily: "Amiri Quran"}}
                  className="text-lg sm:text-xl font-serif text-zinc-100 text-center leading-loose font-bold">
                    <span 
                    style={{fontFamily: "IBM Plex Sans Arabic"}}
                    className="text-emerald-300">{hadith.hadith}</span>
                  </p>
                ) : (
                  <p 
                  style={{fontFamily: "IBM Plex Sans Arabic"}}
                  className="text-sm text-red-400">
                    فشل في جلب الحديث، جرب التحديث مرة أخرى.
                  </p>
                )}
              </div>

              {/* تذييل الكرت (الراوي والمحدث) */}
              {hadith && !loading && (
                <div className="mt-6 pt-4 border-t border-zinc-800/60 bg-zinc-950/20 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span style={{fontFamily: "IBM Plex Sans Arabic"}}>
                      الراوي:{" "}
                      <strong
                      style={{fontFamily: "IBM Plex Sans Arabic"}}
                       className="text-zinc-300">{hadith.rawi}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span style={{fontFamily: "IBM Plex Sans Arabic"}}>
                      المحدث:{" "}
                      <strong
                      style={{fontFamily: "IBM Plex Sans Arabic"}}
                       className="text-zinc-300">
                        {hadith.mohdith}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    <span style={{fontFamily: "IBM Plex Sans Arabic"}}>
                      خلاصة الحكم:{" "}
                      <strong
                      style={{fontFamily: "IBM Plex Sans Arabic"}}
                       className="text-emerald-400">
                        {hadith.hokm}
                      </strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* أزرار التحكم والعمليات التفاعلية (Responsive Grid) */}
            <div className="grid grid-cols-3 gap-2 w-full">
              <button
                onClick={handleCopy}
                disabled={loading || !hadith}
                className="p-3 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 active:scale-[0.97] transition-all rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
              >
                <Copy className="w-4 h-4 text-zinc-400" />
                <span>{copied ? "تم النسخ!" : "نسخ"}</span>
              </button>

              <button
                onClick={handleShare}
                disabled={loading || !hadith}
                className="p-3 bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 active:scale-[0.97] transition-all rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium"
              >
                <Share2 className="w-4 h-4 text-zinc-400" />
                <span>مشاركة</span>
              </button>

              <button
                onClick={() => loadHadith(selectedBook)}
                disabled={loading}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] transition-all rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-white shadow-lg shadow-emerald-950/40"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span>حديث آخر</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import axios from 'axios';

export interface HadithData {
  hadith: string;
  rawi: string;
  mohdith: string;
  book: string;
  hokm: string;
}

export const hadithApi = {
  // تأكد أن الاسم مطابق لما تستدعيه في الـ UI (سواء كان getHadithByBook أو loadHadith)
  getHadithByBook: async (bookName: string): Promise<HadithData | null> => {
    try {
      // نرسل اسم الكتاب المختار، وإذا كان "جميع الأحاديث (عشوائي)" سيرسل كلمة "all" تلقائياً
      const response = await axios.get(`/api/hadith?book=${encodeURIComponent(bookName)}`);

      // الـ Route الجديد يرجع مصفوفة وبداخلها كائن الحديث المنظم [formattedHadith]
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      
      // إذا أرجع الـ API الكائن مباشرة بدون مصفوفة (كخطة بديلة لحمايتك من الكراش)
      if (response.data && response.data.hadith) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Error fetching hadith من الدالة الداخيلة:', error);
      return null;
    }
  },
};

// تصدير افتراضي إضافي تلافياً لأي خطأ في الـ Import بملف page.tsx
export default hadithApi;
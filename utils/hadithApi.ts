import axios from 'axios';

export interface HadithData {
  hadith: string;
  rawi: string;
  mohdith: string;
  book: string;
  hokm: string;
}

export const hadithApi = {
  getHadithByBook: async (bookName: string): Promise<HadithData | null> => {
    try {
      // يطلب من الـ API Route الداخلي حقك
      const response = await axios.get(`/api/hadith?book=${encodeURIComponent(bookName)}`);
      
      if (response.data && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    } catch (error) {
      console.error("Error fetching hadith:", error);
      return null;
    }
  }
};
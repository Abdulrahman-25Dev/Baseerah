import { NextResponse } from 'next/server';
import localData from '@/utils/hadiths.json'; // قراءة الملف المحلي

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book') || 'all';

  try {
    const hadithList = (localData as Record<string, any[]>)[book] || (localData as Record<string, any[]>)['all'];

    if (!hadithList || hadithList.length === 0) {
      return NextResponse.json({ error: "No hadiths found" }, { status: 404 });
    }

    // اختيار حديث عشوائي
    const randomIndex = Math.floor(Math.random() * hadithList.length);
    
    // إرجاعه داخل مصفوفة ليتوافق مع نظام كودك الحالي
    return NextResponse.json([hadithList[randomIndex]]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
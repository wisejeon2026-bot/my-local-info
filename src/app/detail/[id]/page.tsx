import React from 'react';
import localInfo from '../../../../public/data/local-info.json';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 정적 페이지 생성을 위한 설정 (Cloudflare 배포용)
export async function generateStaticParams() {
  const eventParams = localInfo.events.map((event) => ({
    id: event.id.toString(),
  }));
  const benefitParams = localInfo.benefits.map((benefit) => ({
    id: benefit.id.toString(),
  }));
  
  return [...eventParams, ...benefitParams];
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);
  
  const event = localInfo.events.find(e => e.id === id);
  const benefit = localInfo.benefits.find(b => b.id === id);
  const item = event || benefit;

  if (!item) {
    notFound();
  }

  const isEvent = !!event;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xl font-bold text-gray-700 group-hover:text-orange-600 transition-colors">목록으로</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-3 h-full ${isEvent ? 'bg-gradient-to-b from-orange-400 to-red-400' : 'bg-gradient-to-b from-amber-400 to-yellow-500'}`}></div>
          
          <div className="mb-8">
            <span className={`inline-block text-sm font-bold px-4 py-2 rounded-full mb-6 ${isEvent ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
              {item.category}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              {item.name}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 bg-orange-50/50 p-6 md:p-8 rounded-2xl border border-orange-100/50">
            <div>
              <p className="text-sm text-gray-500 font-bold mb-1">기간/일시</p>
              <p className="text-lg font-semibold text-gray-800">{item.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold mb-1">장소</p>
              <p className="text-lg font-semibold text-gray-800">{item.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-bold mb-1">대상</p>
              <p className="text-lg font-semibold text-gray-800">{item.target}</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">상세 안내</h2>
            <div className="prose prose-orange max-w-none">
              <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                {item.summary}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center py-4 px-8 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl text-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              원본 사이트에서 자세히 보기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
            <Link 
              href="/"
              className="flex-1 sm:flex-none inline-flex items-center justify-center py-4 px-8 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl text-lg font-bold transition-all duration-300 border border-gray-200"
            >
              목록으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

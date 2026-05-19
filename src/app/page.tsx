import React from 'react';
import Link from 'next/link';
import localInfo from '../../public/data/local-info.json';

// SVG Icons
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

interface InfoItem {
  id: number;
  name: string;
  category: string;
  date: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

const InfoCard = ({ item, isEvent }: { item: InfoItem, isEvent: boolean }) => {
  return (
    <div className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
      <div className={`absolute top-0 left-0 w-2 h-full ${isEvent ? 'bg-gradient-to-b from-orange-400 to-red-400' : 'bg-gradient-to-b from-amber-400 to-yellow-500'}`}></div>
      
      <div className="flex justify-between items-start mb-4">
        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${isEvent ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
          {item.category}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
        {item.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed flex-grow">
        {item.summary}
      </p>
      
      <div className="space-y-2.5 text-sm text-gray-600 mb-6 bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
        <div className="flex items-center font-medium">
          <CalendarIcon />
          <span>{item.date}</span>
        </div>
        <div className="flex items-center font-medium">
          <MapPinIcon />
          <span>{item.location}</span>
        </div>
        <div className="flex items-center font-medium">
          <UsersIcon />
          <span>{item.target}</span>
        </div>
      </div>
      
      <Link href={`/detail/${item.id}`} className="mt-auto inline-flex items-center justify-center w-full py-3 px-4 bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white rounded-xl text-sm font-bold transition-all duration-300">
        자세히 보기
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
};

export default function Home() {
  const { events, benefits } = localInfo;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🌸</span>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 tracking-tight">
              성남시 생활 정보
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8 pb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-sm font-bold mb-4 shadow-sm">
            ✨ 매일 업데이트되는 지역 소식
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            우리 동네 소식을 <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">한눈에</span> 확인하세요
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            성남시의 최신 축제, 행사 정보와 놓치면 아쉬운 다양한 혜택들을 빠르게 전달해 드립니다.
          </p>
        </section>

        {/* Events Section */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">이번 달 행사/축제</h2>
            <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">{events.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <InfoCard key={event.id} item={event} isEvent={true} />
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">지원금/혜택 정보</h2>
            <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">{benefits.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map(benefit => (
              <InfoCard key={benefit.id} item={benefit} isEvent={false} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-orange-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="font-bold text-gray-700 text-lg mb-1">성남시 생활 정보</h3>
            <p>공공데이터포털(data.go.kr)의 데이터를 바탕으로 제공됩니다.</p>
          </div>
          <div className="text-center md:text-right">
            <p className="font-medium bg-white/60 px-3 py-1 rounded-full inline-block border border-gray-200">
              마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
            </p>
            <p className="mt-3 text-xs">© 2024 성남시 생활 정보. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

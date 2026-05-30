import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🌸</span>
            <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 tracking-tight">
              성남시 생활 정보
            </Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-orange-600 font-bold transition-colors">홈</Link>
            <Link href="/blog" className="text-gray-600 hover:text-orange-600 font-bold transition-colors">블로그</Link>
            <Link href="/about" className="text-orange-600 font-bold border-b-2 border-orange-600 transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Title Section */}
        <section className="text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-sm font-bold shadow-sm">
            💡 서비스 소개 및 투명성 안내
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            성남시 생활 정보는 <br />
            어떻게 운영되나요?
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            성남시와 경기도 주민분들의 삶을 풍요롭게 만드는 꿀정보들을 가장 똑똑하고 신뢰할 수 있는 방식으로 전달해 드리는 공간입니다.
          </p>
        </section>

        {/* Core Values Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-400"></div>
            <span className="text-4xl block mb-6">🎯</span>
            <h3 className="text-xl font-bold text-gray-800 mb-3">운영 목적</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              복잡하고 흩어져 있는 지자체 지원금, 혜택, 문화 축제 정보를 한곳에 모아, 지역 주민들이 단 하나의 권리도 놓치지 않고 혜택을 누릴 수 있도록 돕습니다.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
            <span className="text-4xl block mb-6">📑</span>
            <h3 className="text-xl font-bold text-gray-800 mb-3">데이터 출처</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              대한민국정부 공식 통로인 **공공데이터포털(data.go.kr)**의 검증된 공공서비스 정보를 실시간으로 활용하여, 거짓 없는 팩트 기반의 투명한 소식을 전달합니다.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-red-400"></div>
            <span className="text-4xl block mb-6">🤖</span>
            <h3 className="text-xl font-bold text-gray-800 mb-3">콘텐츠 제작 방식</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              첨단 인공지능(Google Gemini)을 도구로 활용해 복잡한 행정 문서를 읽기 쉬운 블로그 톤으로 초안을 지은 뒤, 사람이 꼼꼼하게 최종 사실 검증(Fact-Check)을 진행하여 작성합니다.
            </p>
          </div>
        </section>

        {/* E-E-A-T Pledge */}
        <section className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-orange-400 to-red-400"></div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            신뢰와 책임을 약속하는 E-E-A-T 선언 🤝
          </h2>
          <div className="space-y-4 text-gray-600 text-sm md:text-base leading-relaxed font-medium">
            <p>
              인터넷에 넘쳐나는 거짓 정보와 미끼용 스팸성 혜택 광고 사이에서, **성남시 생활 정보**는 오직 공신력 있는 기관의 검증된 API 데이터를 기반으로 정직한 글을 생산합니다.
            </p>
            <p>
              AI 도구를 도입해 정보 전달의 신속성을 올리면서도, 발행되는 모든 콘텐츠는 **반드시 휴먼 에디터의 검수 및 가공 단계를 철저하게 거치도록 약속**되어 있습니다.
            </p>
            <p>
              독자분들의 알 권리와 안전한 혜택 활용을 최우선으로 생각하며, 항상 투명한 소통과 신뢰 가치를 지켜나갈 것을 엄숙히 선언합니다.
            </p>
          </div>
          <div className="pt-6 border-t border-orange-100 flex items-center justify-between flex-wrap gap-4 text-sm text-gray-500">
            <span>최종 업데이트: 2026-05-30</span>
            <Link href="/blog" className="inline-flex items-center text-orange-600 hover:text-orange-800 font-bold">
              블로그 보러가기 ➔
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-200/50 bg-white/40 backdrop-blur-md">
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

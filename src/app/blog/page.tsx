import React from 'react';
import Link from 'next/link';
import { getSortedPostsData } from '../../lib/posts';

export default function BlogListPage() {
  const posts = getSortedPostsData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-3xl animate-bounce" style={{ animationDuration: '3s' }}>🌸</span>
            <Link href="/" className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600 tracking-tight hover:opacity-80 transition-opacity">
              성남시 생활 정보
            </Link>
          </div>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-orange-600 font-bold transition-colors">홈</Link>
            <Link href="/blog" className="text-orange-600 font-bold border-b-2 border-orange-600 transition-colors">블로그</Link>
            <Link href="/about" className="text-gray-600 hover:text-orange-600 font-bold transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Title Section */}
        <section className="text-center space-y-4 pt-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800 text-sm font-bold shadow-sm">
            📚 유용한 꿀팁 저장소
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            정보 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">블로그</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto font-medium">
            일상 생활에 유익한 혜택과 지식을 한곳에 모았습니다.
          </p>
        </section>

        {/* Blog Posts List */}
        <section className="space-y-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-8">
              <span className="text-5xl block mb-4">📭</span>
              <p className="text-gray-500 font-medium">아직 등록된 블로그 글이 없습니다.</p>
              <p className="text-gray-400 text-sm mt-1">곧 유익한 포스트로 찾아뵙겠습니다!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {posts.map((post) => (
                <div
                  key={post.slug}
                  className="group bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-orange-400 to-red-400"></div>
                  
                  <div className="flex-grow space-y-3 md:pr-8">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">{post.date}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-2">
                      {post.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="text-xs text-gray-400 font-medium">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex-shrink-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center justify-center py-3 px-6 bg-orange-50 group-hover:bg-orange-600 text-orange-600 group-hover:text-white rounded-2xl text-sm font-bold transition-all duration-300 w-full md:w-auto"
                    >
                      읽어보기
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

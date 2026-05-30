import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Metadata } from 'next';
import { getPostData, getSortedPostsData } from '../../../lib/posts';
import localInfo from '../../../../public/data/local-info.json';
import AdBanner from '../../../components/AdBanner';
import CoupangBanner from '../../../components/CoupangBanner';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다 | 성남시 생활 정보",
    };
  }

  return {
    title: `${post.title} | 성남시 생활 정보`,
    description: post.summary || "성남시 주민을 위한 유용한 행사, 혜택, 축제 정보를 소개해 드립니다.",
    openGraph: {
      title: post.title,
      description: post.summary || "성남시 주민을 위한 유용한 행사, 혜택, 축제 정보를 소개해 드립니다.",
      type: "article",
      publishedTime: post.date,
      authors: ["성남시 생활 정보 에디터"],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  // local-info.json에서 매칭되는 원문 출처 검색
  const events = localInfo.events || [];
  const benefits = localInfo.benefits || [];
  const allItems = [...events, ...benefits];
  const matchedItem = allItems.find(item => post.title.includes(item.name) || item.name.includes(post.title));
  const sourceLink = matchedItem ? matchedItem.link : '#';

  // BlogPosting 구조화 데이터 구성
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "description": post.summary || "성남시 주민을 위한 유용한 행사, 혜택, 축제 정보를 소개해 드립니다.",
    "author": {
      "@type": "Organization",
      "name": "성남시 생활 정보",
      "url": "https://my-local-info.pages.dev"
    },
    "publisher": {
      "@type": "Organization",
      "name": "성남시 생활 정보",
      "logo": {
        "@type": "ImageObject",
        "url": "https://my-local-info.pages.dev/favicon.ico"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans selection:bg-orange-200 selection:text-orange-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }}
      />
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/blog" className="flex items-center space-x-2 group">
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xl font-bold text-gray-700 group-hover:text-orange-600 transition-colors">블로그 목록으로</span>
          </Link>
          <nav className="flex space-x-6">
            <Link href="/" className="text-gray-600 hover:text-orange-600 font-bold transition-colors">홈</Link>
            <Link href="/about" className="text-gray-600 hover:text-orange-600 font-bold transition-colors">소개</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white/80 backdrop-blur-md border border-white/60 rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-b from-orange-400 to-red-400"></div>
          
          <div className="mb-8 border-b border-gray-100 pb-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-sm font-bold px-3 py-1.5 rounded-full bg-orange-100 text-orange-700">
                {post.category}
              </span>
              <span className="text-sm text-gray-400 font-medium">{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-500 font-semibold px-2.5 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Markdown Content */}
          <div className="prose prose-orange max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-orange-600 prose-img:rounded-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Google AdSense Ad Banner */}
          <AdBanner />

          {/* Coupang Partners Ad Banner */}
          <CoupangBanner />

          {/* E-E-A-T Information */}
          <div className="mt-12 pt-8 border-t border-gray-100 space-y-4 text-sm text-gray-500 bg-orange-50/50 p-6 rounded-2xl border border-orange-100/50">
            <p className="font-semibold text-gray-700 flex items-center">
              <span className="text-lg mr-2">ℹ️</span> 생활 정보 안내 고지
            </p>
            <p>이 글은 공공데이터포털(data.go.kr)의 정보를 바탕으로 AI가 작성하였습니다. 정확한 내용은 원문 링크를 통해 확인해주세요.</p>
            
            {sourceLink && sourceLink !== '#' && (
              <div className="pt-1.5">
                <span className="font-bold text-gray-700">🔗 원문 출처: </span>
                <a href={sourceLink} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-800 underline font-medium">
                  공공서비스 상세 보기 (공식 홈페이지)
                </a>
              </div>
            )}
            
            <div className="text-xs text-gray-400 pt-2 border-t border-orange-100/30">
              최종 업데이트: {post.date}
            </div>
          </div>

          <div className="flex gap-4 pt-10 mt-12 border-t border-gray-100">
            <Link 
              href="/blog"
              className="inline-flex items-center justify-center py-3.5 px-8 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-2xl text-base font-bold transition-all duration-300 border border-gray-200"
            >
              블로그 목록
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostData, getSortedPostsData } from '../../../lib/posts';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 font-sans selection:bg-orange-200 selection:text-orange-900">
      {/* Header */}
      <header className="bg-white/60 backdrop-blur-xl border-b border-white/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/blog" className="flex items-center space-x-2 group">
            <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-xl font-bold text-gray-700 group-hover:text-orange-600 transition-colors">블로그 목록으로</span>
          </Link>
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

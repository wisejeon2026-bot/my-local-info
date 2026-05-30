import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://my-local-info.pages.dev';

  // 1. 기본 페이지 경로 설정
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];

  // 2. 마크다운 포스트 파일 기반 동적 블로그 포스트 경로 생성
  const postsDirectory = path.join(process.cwd(), 'src/content/posts');
  let postRoutes: MetadataRoute.Sitemap = [];

  if (fs.existsSync(postsDirectory)) {
    const filenames = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
    postRoutes = filenames.map(filename => {
      const slug = filename.replace(/\.md$/, '');
      const filePath = path.join(postsDirectory, filename);
      const stat = fs.statSync(filePath);

      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified: stat.mtime,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      };
    });
  }

  return [...routes, ...postRoutes];
}

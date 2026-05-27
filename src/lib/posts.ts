import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostData {
  slug: string;
  title: string;
  date: string; // YYYY-MM-DD format
  summary: string;
  category: string;
  tags: string[];
  content: string;
}

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export function getSortedPostsData(): PostData[] {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      const { data, content } = matter(fileContents);

      // Handle Date object conversion to YYYY-MM-DD
      let dateStr = '';
      if (data.date) {
        if (data.date instanceof Date) {
          const year = data.date.getFullYear();
          const month = String(data.date.getMonth() + 1).padStart(2, '0');
          const day = String(data.date.getDate()).padStart(2, '0');
          dateStr = `${year}-${month}-${day}`;
        } else {
          dateStr = String(data.date);
        }
      }

      return {
        slug,
        title: data.title || '',
        date: dateStr,
        summary: data.summary || '',
        category: data.category || '',
        tags: Array.isArray(data.tags) ? data.tags : [],
        content,
      };
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else if (a.date > b.date) {
      return -1;
    } else {
      return 0;
    }
  });
}

export function getPostData(slug: string): PostData | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    let dateStr = '';
    if (data.date) {
      if (data.date instanceof Date) {
        const year = data.date.getFullYear();
        const month = String(data.date.getMonth() + 1).padStart(2, '0');
        const day = String(data.date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else {
        dateStr = String(data.date);
      }
    }

    return {
      slug,
      title: data.title || '',
      date: dateStr,
      summary: data.summary || '',
      category: data.category || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
    };
  } catch (error) {
    return null;
  }
}

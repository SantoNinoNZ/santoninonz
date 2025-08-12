import { promises as fs } from 'fs';
import path from 'path';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml: string;
}

export async function getSortedPostsData(): Promise<Post[]> {
  const indexPath = path.join(process.cwd(), 'public', 'posts-index.json');
  const fileContent = await fs.readFile(indexPath, 'utf8');
  const allPostsData: Post[] = JSON.parse(fileContent);

  // Sort posts by date in descending order
  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

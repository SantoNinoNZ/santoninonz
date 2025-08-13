import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml: string;
}

export async function getSortedPostsData(): Promise<Post[]> {
  const indexPath = path.join(process.cwd(), 'public', 'posts-index.yaml');
  const fileContent = await fs.readFile(indexPath, 'utf8');
  const allPostsData: Post[] = yaml.load(fileContent) as Post[];

  // Sort posts by date in descending order
  return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

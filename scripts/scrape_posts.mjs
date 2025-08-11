import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';
import yaml from 'js-yaml';

async function fetchWithRetry(url, retries = 5, initialDelay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      } else {
        console.warn(`Fetch failed for ${url}, status: ${res.status}. Retrying...`);
      }
    } catch (error) {
      console.error(`Fetch error for ${url}: ${error}. Retrying...`);
    }
    const delay = initialDelay * Math.pow(2, i); // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
}

async function getAllPosts() {
  let allPosts = [];
  let page = 1;
  const perPage = 100; // Max posts per page for WordPress API

  while (true) {
    try {
      const posts = await fetchWithRetry(`https://santonino-nz.org/wp-json/wp/v2/posts?_embed&per_page=${perPage}&page=${page}`);
      if (posts.length === 0) {
        break;
      }
      allPosts = allPosts.concat(posts);
      console.log(`Fetched page ${page}, total posts: ${allPosts.length}`);
      page++;
    } catch (error) {
      console.error(`Error fetching posts on page ${page}: ${error.message}`);
      break;
    }
  }
  return allPosts;
}

function decodeHtmlEntities(html) {
  return html
    .replace(/&#8211;/g, '–')
    .replace(/&/g, '&') // Corrected to handle &
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/"/g, '"')
    .replace(/&hellip;/g, '...');
}

async function downloadFile(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to download ${url}: ${response.statusText}`);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`Error downloading file ${url}: ${error.message}`);
    return false;
  }
}

async function scrapePosts() {
  const posts = await getAllPosts();
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const outputDir = path.join(__dirname, 'scraped_posts');
  const assetsDir = path.join(outputDir, 'assets'); // New directory for other assets like PDFs
  const imagesDir = path.join(assetsDir, 'images');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const turndownService = new TurndownService();
  const allPostsMetadata = [];

  for (const post of posts) {
    const slug = post.slug;
    const title = decodeHtmlEntities(post.title.rendered);
    const contentHtml = decodeHtmlEntities(post.content.rendered);
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString();

    let imageUrl = null;
    const imageUrlMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
    if (imageUrlMatch) {
      imageUrl = imageUrlMatch[1].replace(/&#038;/g, '&');
    } else if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'].length > 0) {
      const featuredMedia = post._embedded['wp:featuredmedia'][0];
      imageUrl = featuredMedia.media_details?.sizes?.medium?.source_url || featuredMedia.source_url || null;
    }

    let processedContentHtml = contentHtml;
    const imageMatches = contentHtml.matchAll(/<img[^>]+src="([^">]+)"/g);
    for (const match of imageMatches) {
      const originalImageUrl = match[1].replace(/&#038;/g, '&');
      const imageFileName = path.basename(new URL(originalImageUrl).pathname);
      const localImagePath = path.join(imagesDir, imageFileName);
      const relativeImagePath = path.join('assets', 'images', imageFileName);

      if (await downloadFile(originalImageUrl, localImagePath)) {
        processedContentHtml = processedContentHtml.replace(originalImageUrl, relativeImagePath);
      }
    }

    // Handle PDF links
    const pdfMatches = contentHtml.matchAll(/<a[^>]+href="([^">]+\.pdf)"[^>]*>/g);
    for (const match of pdfMatches) {
      const originalPdfUrl = match[1].replace(/&#038;/g, '&');
      const pdfFileName = path.basename(new URL(originalPdfUrl).pathname);
      const localPdfPath = path.join(assetsDir, pdfFileName);
      const relativePdfPath = path.join('assets', pdfFileName);

      if (await downloadFile(originalPdfUrl, localPdfPath)) {
        processedContentHtml = processedContentHtml.replace(originalPdfUrl, relativePdfPath);
      }
    }

    const markdownContent = turndownService.turndown(processedContentHtml);

    const frontMatter = `---
title: "${title}"
date: "${formattedDate}"
slug: "${slug}"
${imageUrl ? `imageUrl: "${imageUrl}"` : ''}
---

`;

    const fileName = path.join(outputDir, `${slug}.md`);
    fs.writeFileSync(fileName, frontMatter + markdownContent);
    console.log(`Scraped: ${title} -> ${fileName}`);

    allPostsMetadata.push({
      title: title,
      slug: slug,
      date: date.toISOString(), // Store as ISO string for consistent sorting
    });
  }

  // Sort posts by date in descending order
  allPostsMetadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Write index.yaml
  const indexYamlPath = path.join(outputDir, 'index.yaml');
  fs.writeFileSync(indexYamlPath, yaml.dump(allPostsMetadata));
  console.log(`Generated index.yaml at ${indexYamlPath}`);

  console.log('Scraping complete!');
}

scrapePosts();

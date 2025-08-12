import { promises as fs } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const postsDirectory = path.join(process.cwd(), 'public', 'posts');
const outputFilePath = path.join(process.cwd(), 'public', 'posts-index.json');

async function generatePostIndex() {
  try {
    const filenames = await fs.readdir(postsDirectory);
    const markdownFiles = filenames.filter(file => file.endsWith('.md'));

    const posts = [];

    for (const filename of markdownFiles) {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = await fs.readFile(filePath, 'utf8');

      // Extract YAML front matter
      const frontMatterMatch = fileContent.match(/^---\n([\s\S]*?)\n---/);
      if (frontMatterMatch && frontMatterMatch[1]) {
        try {
          const frontMatter = yaml.load(frontMatterMatch[1]);
          const slug = filename.replace(/\.md$/, '');
          
          let dateString = frontMatter.date;
          let parsedDate = null;

          if (dateString) {
            // Attempt to parse DD/MM/YYYY format
            const parts = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
            if (parts) {
              dateString = `${parts[3]}-${parts[2]}-${parts[1]}`; // Convert to YYYY-MM-DD
            }
            parsedDate = new Date(dateString);
          }

          if (frontMatter.title && parsedDate && !isNaN(parsedDate)) {
            posts.push({
              slug,
              title: frontMatter.title,
              date: parsedDate.toISOString().split('T')[0], // Store date as YYYY-MM-DD string
              imageUrl: frontMatter.imageUrl || undefined // Include imageUrl if present
            });
          } else {
            console.warn(`Skipping ${filename}: Missing title or date, or invalid date format in front matter.`);
          }
        } catch (yamlError) {
          console.error(`Error parsing YAML in ${filename}:`, yamlError);
        }
      } else {
        console.warn(`Skipping ${filename}: No YAML front matter found.`);
      }
    }

    // Sort posts by date in descending order
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    await fs.writeFile(outputFilePath, JSON.stringify(posts, null, 2), 'utf8');
    console.log(`Successfully generated post index at ${outputFilePath}`);
  } catch (error) {
    console.error('Error generating post index:', error);
  }
}

generatePostIndex();

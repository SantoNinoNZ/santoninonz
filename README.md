# Santo Niño NZ Website Modernization

This project is a Next.js application aimed at modernizing the `santonino-nz.org` website by fetching content directly from its WordPress REST API.

## Features

-   **Local Markdown Content**: Posts are now managed as local Markdown files with YAML front matter, providing full control over content and reducing external dependencies.
-   **Modern Card Layout**: Displays WordPress posts in a responsive grid using a clean, card-based design.
-   **Lighter Theme**: Implements a lighter color scheme with a custom palette, replacing the default dark background.
-   **Responsive Navigation and Footer**: The site's navigation bar and footer have been restyled to match the new theme.
-   **HTML Entity Decoding**: Ensures proper display of special characters by decoding HTML entities in fetched content.
-   **Static Export Compatibility**: Configured for static export (`output: 'export'`) with unoptimized images to ensure compatibility.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Build and Deployment

This project is configured to be exported as a static site using `output: 'export'` in `next.config.ts`. Due to this setting, Next.js Image Optimization is disabled (`images: { unoptimized: true }`).

To create an optimized production build:

```bash
npx next build
```

After building, the static output will be available in the `out/` directory.

## Managing Posts

This site uses Markdown files with YAML front matter for posts, indexed in `public/posts-index.yaml`.

### Adding a New Post

1.  Create a new Markdown file (`.md`) in the `public/posts/` directory.
2.  At the top of the new Markdown file, include YAML front matter with the following required fields:
    *   `title`: The title of the post.
    *   `date`: The publication date in `YYYY-MM-DD` format.
    *   `imageUrl` (optional): A relative path to a featured image, e.g., `/posts/assets/images/your-image.jpg`.
    Example front matter:
    ```yaml
    ---
    title: Your Post Title
    date: 2025-01-01
    imageUrl: /posts/assets/images/your-image.jpg
    ---
    ```
3.  Add your post content below the front matter.
4.  Run the post index generation script to update `posts-index.yaml`:
    ```bash
    node scripts/generate-post-index.mjs
    ```

### Editing an Existing Post

1.  Locate the Markdown file (`.md`) for the post you wish to edit in the `public/posts/` directory.
2.  Make your desired changes to the content or front matter.
3.  Run the post index generation script to ensure the changes are reflected in `posts-index.yaml`:
    ```bash
    node scripts/generate-post-index.mjs
    ```

### Deleting a Post

1.  Delete the Markdown file (`.md`) of the post you wish to remove from the `public/posts/` directory.
2.  Run the post index generation script to remove the post from `posts-index.yaml`:
    ```bash
    node scripts/generate-post-index.mjs
    ```

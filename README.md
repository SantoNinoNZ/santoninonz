# Santo Niño NZ Website Modernization

This project is a Next.js application aimed at modernizing the `santonino-nz.org` website by fetching content directly from its WordPress REST API.

## Features

-   **WordPress API Integration**: Fetches posts, titles, excerpts, and images from `https://santonino-nz.org/wp-json/wp/v2/posts?_embed`.
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

## WordPress API Usage

The application fetches content from the WordPress REST API. The main endpoint used is `https://santonino-nz.org/wp-json/wp/v2/posts?_embed`. The `_embed` parameter is crucial for including featured media and other embedded content in the API response.

## Build and Deployment

This project is configured to be exported as a static site using `output: 'export'` in `next.config.ts`. Due to this setting, Next.js Image Optimization is disabled (`images: { unoptimized: true }`).

To create an optimized production build:

```bash
npx next build
```

After building, the static output will be available in the `out/` directory.

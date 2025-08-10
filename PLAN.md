# Project Modernization Plan: Santonino NZ

## 1. Introduction
This document outlines the plan to modernize the Santonino NZ website, transitioning from its current WordPress platform to a modern, scalable, and maintainable stack. The goal is to create a visually appealing, mobile-friendly, and feature-rich blog site for the Catholic organization, incorporating modern UI/UX principles and AI-assisted content generation.

## 2. Technology Stack
Based on the requirements, the following technology stack is proposed:
*   **Frontend Framework**: Next.js (with TypeScript) for server-side rendering (SSR), static site generation (SSG), and API routes.
*   **Backend/Database**: Supabase (PostgreSQL database, authentication, and real-time subscriptions) for content management, user data, and event storage.
*   **Hosting**: Vercel for seamless deployment and optimal performance, leveraging Next.js's capabilities.
*   **Styling**: A modern UI library (e.g., Tailwind CSS, Chakra UI, or Material UI) for themeable components, with a focus on red and gold color schemes.
*   **Content Migration**: Custom scripts to fetch data from the existing WordPress site (via WordPress REST API or direct MySQL DB access if possible).

This project repository is named `santoninonz`.

## 3. Core Features & Design Principles

### 3.1 Modern UI/UX
*   **Visually Appealing Layout**: Clean, intuitive, and modern design.
*   **Themeable**: Easily customizable themes, with primary colors being red and gold.
*   **Mobile-Friendly (Responsive Design)**: Optimized for various screen sizes, ensuring a consistent experience across devices.
*   **Accessibility**: Adherence to WCAG guidelines for inclusive design.

### 3.2 Key Functionalities
*   **Blog/Articles**:
    *   Display imported articles from WordPress.
    *   New backend for posting and managing articles.
    *   Rich text editor for content creation.
*   **Calendar of Events**:
    *   Display upcoming events.
    *   Ability to add/manage events via the backend.
    *   Integration with a calendar API (e.g., Google Calendar) for easy management.
*   **Prayer Request Form**:
    *   Submission form for prayer requests.
    *   Backend to manage and display (optionally) requests.
*   **House Visit Request Form**:
    *   Submission form for house visit requests.
    *   Backend to manage requests.
*   **Donation Integration**:
    *   Link to or embed a secure donation platform (e.g., Stripe, PayPal).
    *   This will likely be an external integration rather than a custom payment gateway.

### 3.3 AI Integration
*   **AI-Assisted Blog Post Writing**:
    *   Integration with a generative AI model (e.g., OpenAI GPT, Google Gemini) to assist content creators in drafting, summarizing, or expanding blog posts. This would be a backend feature accessible to content editors.
*   **Generative Content (Periodic)**:
    *   Explore options for periodically generating content (e.g., short inspirational quotes, summaries of past events) to keep the site fresh without constant manual input. This would be a scheduled backend process.
    *   *Note*: This would not be a chatbot for cost efficiency.

## 4. Data Migration Strategy

### 4.1 WordPress Data Extraction
*   **Option 1: WordPress REST API**:
    *   Develop scripts to fetch posts, pages, categories, tags, and media from the public WordPress REST API. This is the preferred method if the API provides sufficient data.
*   **Option 2: MySQL Database Export**:
    *   If API access is insufficient, attempt to obtain a direct export of the MySQL database. This would allow for a more comprehensive migration of all content, including comments, users, and custom fields.
*   **Data Mapping**: Map WordPress data structures (posts, pages, comments, users, media) to the new Supabase schema.

### 4.2 Supabase Data Import
*   **Schema Design**: Design a robust Supabase schema to accommodate blog posts, events, prayer requests, house visit requests, and user data.
*   **Scripted Import**: Write Node.js/TypeScript scripts to parse the extracted WordPress data and insert it into the Supabase database.
*   **Media Handling**: Migrate images and other media files to a cloud storage solution (e.g., Supabase Storage, Vercel Blob, or a dedicated CDN) and update their URLs in the database.

## 5. Development Phases

### Phase 1: Setup & Core Infrastructure
*   Initialize Next.js project with TypeScript.
*   Configure Supabase project and set up initial database schema.
*   Integrate a UI component library and establish basic theming (red/gold palette).
*   Set up Vercel deployment.

### Phase 2: Data Migration & Backend Development
*   Develop WordPress data extraction scripts.
*   Implement Supabase data import scripts.
*   Create Next.js API routes for backend functionalities (e.g., article posting, event management, form submissions).
*   Implement authentication for backend users (content editors) using Supabase Auth.

### Phase 3: Frontend Development
*   Develop core UI components (header, footer, navigation, blog post cards, event listings).
*   Build pages for blog posts, events calendar, prayer requests, house visits, and donations.
*   Implement responsive design for all pages.
*   Integrate forms with Supabase backend.

### Phase 4: AI Integration & Enhancements
*   Integrate AI API for blog post assistance (backend feature).
*   Develop and test generative content features.
*   Implement SEO best practices (meta tags, sitemaps, structured data).

### Phase 5: Testing & Deployment
*   Unit, integration, and end-to-end testing.
*   Performance optimization.
*   Security audits.
*   Final deployment to Vercel.

## 6. SEO Considerations
*   **Next.js Advantages**: Leverage Next.js's SSR/SSG capabilities for better crawlability and initial page load performance.
*   **Semantic HTML**: Use appropriate HTML5 semantic elements.
*   **Meta Tags**: Implement dynamic meta titles, descriptions, and Open Graph tags for social sharing.
*   **Sitemaps & Robots.txt**: Generate and maintain sitemaps and configure `robots.txt`.
*   **Structured Data (Schema.org)**: Implement schema markup for articles, events, and organization details to enhance search engine understanding.
*   **Image Optimization**: Optimize images for web performance and include `alt` attributes.
*   **Mobile-First Indexing**: Ensure the site is fully responsive and performs well on mobile devices.

## 7. Next Steps
1.  Create the Next.js project.
2.  Set up the Supabase project.
3.  Begin designing the database schema.
4.  Start developing data migration scripts.

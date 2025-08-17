# Santo Niño NZ Website Modernization

[![Build Status](https://github.com/SantoNinoNZ/santoninonz.github.io/actions/workflows/nextjs.yml/badge.svg)](https://github.com/SantoNinoNZ/santoninonz.github.io/actions/workflows/nextjs.yml)
Visit the live website: [santonino-nz.org](https://santoninonz.github.io/)

This project is a Next.js application aimed at modernizing the `santonino-nz.org` website by fetching content directly from its WordPress REST API.

## ✨ Features

-   **Local Markdown Content**: Posts are now managed as local Markdown files with YAML front matter, providing full control over content and reducing external dependencies.
-   **Modern Card Layout**: Displays WordPress posts in a responsive grid using a clean, card-based design.
-   **Lighter Theme**: Implements a lighter color scheme with a custom palette, replacing the default dark background.
-   **Responsive Navigation and Footer**: The site's navigation bar and footer have been restyled to match the new theme.
-   **HTML Entity Decoding**: Ensures proper display of special characters by decoding HTML entities in fetched content.
-   **Static Export Compatibility**: Configured for static export (`output: 'export'`) with unoptimized images to ensure compatibility.
-   **Upcoming Events Calendar**: Displays upcoming recurring and dated events in a calendar view, with clickable entries linking to detailed event pages.

## 🚀 Getting Started

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


## 📦 Build and Deployment

This project is configured to be exported as a static site using `output: 'export'` in `next.config.ts`. Due to this setting, Next.js Image Optimization is disabled (`images: { unoptimized: true }`).

To create an optimized production build:

```bash
npx next build
```

After building, the static output will be available in the `out/` directory.

## 📝 Managing Posts

This site uses Markdown files with YAML front matter for posts, indexed in `public/posts-index.yaml`. The `posts-index.yaml` file is a manually maintained index of your posts.

### What is Markdown?

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It's widely used for writing content on the web because of its simplicity and readability.

Here are some common Markdown syntax examples:

*   **Headings**:
    ```markdown
    # Heading 1
    ## Heading 2
    ### Heading 3
    ```
*   **Paragraphs**: Just type your text. New lines are created by leaving a blank line between paragraphs.
*   **Bold and Italic**:
    ```markdown
    **bold text** or __bold text__
    *italic text* or _italic text_
    ```
*   **Lists**:
    ```markdown
    - Item 1
    - Item 2
      - Sub-item 2.1
    * Item A
    * Item B

    1. First item
    2. Second item
    ```
*   **Links**:
    ```markdown
    [Link Text](https://www.example.com)
    ```
*   **Images**:
    ```markdown
    ![Alt text for image](/path/to/image.jpg)
    ```
*   **Code Blocks**:
    ```markdown
    ```javascript
    // Your code here
    console.log("Hello, Markdown!");
    ```
    ```

For a more comprehensive guide to Markdown syntax, refer to [Markdown Guide: Basic Syntax](https://www.markdownguide.org/basic-syntax/).

### ➕ Adding a New Post

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
4.  Manually add a new entry to `public/posts-index.yaml` for your new post. Ensure the `slug` matches the filename (without `.md`), and the `title`, `date`, and `imageUrl` (if applicable) match your front matter. The order of entries in `posts-index.yaml` determines the display order on the site.

### ✏️ Editing an Existing Post

1.  Locate the Markdown file (`.md`) for the post you wish to edit in the `public/posts/` directory.
2.  Make your desired changes to the content or front matter.
3.  If you changed the `title`, `date`, or `imageUrl` in the front matter, manually update the corresponding entry in `public/posts-index.yaml`.

### 🗑️ Deleting a Post

1.  Delete the Markdown file (`.md`) of the post you wish to remove from the `public/posts/` directory.
2.  Manually remove the corresponding entry for that post from `public/posts-index.yaml`.

## 🗓️ Managing Events

This site uses Markdown files with YAML front matter for events, indexed in `public/events-index.yaml`. The `events-index.yaml` file is a manually maintained index of your events.

### Event Markdown File Structure

Events can be either `recurring` or `dated`.

#### Recurring Event Structure (`type: recurring`)

For events that happen regularly (e.g., "Every First and Third Friday of the Month"):

```yaml
---
title: Event Title
type: recurring
recurrence: Every First and Third Friday of the Month # or "Every Friday", "First Friday", "Third Friday"
time: 7:30 PM
venue: Venue Name
address: Full Venue Address
slug: unique-event-slug # Must be unique and matching the filename (without .md)
---
Optional additional content about the recurring event.
```

#### Dated Event Structure (`type: dated`)

For events with a specific start and end date (e.g., a Novena or Fiesta):

```yaml
---
title: Event Title
type: dated
startDate: January 10, 2025 # Format: Month Day, Year
endDate: January 18, 2025   # Format: Month Day, Year
venue: Venue Name
address: Full Venue Address
rosaryTime: 6:30 pm # Optional
slug: unique-event-slug # Must be unique and matching the filename (without .md)
days: # Array of daily schedules for multi-day events
  - dayNumber: 1
    date: Friday, 10 January 2025
    choir: Choir Name
    sponsorsPilgrims: Sponsors and Pilgrims details
    areaCoordinators: Area Coordinators names
  - dayNumber: 2
    date: Saturday, 11 January 2025
    # ... more days
parkingInfo: Detailed parking information # Optional
---
Optional additional content about the dated event.
```

### ➕ Adding a New Event

1.  Create a new Markdown file (`.md`) in the `public/events/` directory.
2.  At the top of the new Markdown file, include YAML front matter according to whether it's a `recurring` or `dated` event (see structures above).
3.  Add any additional event content below the front matter.
4.  Manually add a new entry to `public/events-index.yaml` for your new event. Ensure the `slug` matches the filename (without `.md`), and other relevant fields (`title`, `type`, `recurrence`/`startDate`/`endDate`, `venue`, `address`, `rosaryTime`) match your front matter. The order of entries in `events-index.yaml` does not affect display order on the calendar.

### ✏️ Editing an Existing Event

1.  Locate the Markdown file (`.md`) for the event you wish to edit in the `public/events/` directory.
2.  Make your desired changes to the content or front matter.
3.  Manually update the corresponding entry in `public/events-index.yaml` if you changed any front matter fields that are indexed there.

### 🗑️ Deleting an Event

1.  Delete the Markdown file (`.md`) of the event you wish to remove from the `public/events/` directory.
2.  Manually remove the corresponding entry for that event from `public/events-index.yaml`.

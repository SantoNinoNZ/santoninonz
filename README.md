# Santonino NZ Web Modernization Project

This repository contains the modernized website for Santonino NZ, transitioning from a WordPress-based blog to a modern Next.js application with Supabase backend.

## Project Plan
For a detailed plan of the project, including technology stack, features, data migration strategy, and development phases, please refer to `PLAN.md`.

## Technology Stack
*   **Frontend**: Next.js (TypeScript)
*   **Backend/Database**: Supabase (PostgreSQL)
*   **Hosting**: Vercel

## Getting Started

### Prerequisites
*   Node.js (LTS version recommended)
*   npm or yarn
*   Git

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/SantoNinoNZ/santoninonz.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd santoninonz
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables
Create a `.env.local` file in the root of the project based on the `.env.example` (if available) or the following structure:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
# Add other environment variables as needed for AI integration, etc.
```

### Running Locally
```bash
npm run dev
# or
yarn dev
```
This will start the development server at `http://localhost:3000`.

## Development Phases
Refer to `PLAN.md` for a detailed breakdown of development phases, including data migration, backend development, frontend development, and AI integration.

## Contributing
Contributions are welcome! Please refer to `PLAN.md` for the overall project direction and `CONTRIBUTING.md` (to be created) for contribution guidelines.

## Deployment to Vercel
This project is configured for deployment on Vercel. Follow these steps to deploy your instance:

1.  **Sign up for Vercel**: If you don't have an account, sign up at [vercel.com](https://vercel.com/).
2.  **Install Vercel CLI (Optional but Recommended)**:
    ```bash
    npm install -g vercel
    ```
3.  **Link Your Git Repository**:
    *   Go to your Vercel Dashboard and click "Add New..." -> "Project".
    *   Import your Git repository (e.g., from GitHub, GitLab, Bitbucket).
    *   Vercel will automatically detect that it's a Next.js project and configure the build settings.
    *   Ensure the "Root Directory" is set to `santoninonz-web-app` if you created the Next.js project inside a subdirectory.
4.  **Environment Variables**:
    *   Add your Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.) in the Vercel project settings under "Environment Variables".
5.  **Deploy**:
    *   Once configured, Vercel will automatically deploy your project on every push to the main branch (or your configured production branch).
    *   You can also trigger a manual deployment from the Vercel Dashboard or via the CLI:
        ```bash
        vercel deploy
        ```

## License
[Specify your license here, e.g., MIT License]

import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import Header from "@/components/Header";
import fs from 'fs/promises';
import path from 'path';

async function getProcessedContent(content: string) {
  const processedContent = await remark().use(html).process(content);
  return processedContent.toString();
}

const AboutSinulogPage = async () => {
  const filePath = path.join(process.cwd(), 'public', 'pages', 'about-sinulog.md');
  const mainSinulogContent = await fs.readFile(filePath, 'utf8');

  const contentHtml = await getProcessedContent(mainSinulogContent);

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          About Sinulog
        </h1>
        <div
          className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
};

export default AboutSinulogPage;

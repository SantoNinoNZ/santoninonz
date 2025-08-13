import React from 'react';
import { remark } from 'remark';
import html from 'remark-html';
import Header from "@/components/Header";
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

async function getProcessedContent(content: string) {
  const processedContent = await remark().use(html).process(content);
  return processedContent.toString();
}

const TheTrustPage = async () => {
  const filePath = path.join(process.cwd(), 'public', 'pages', 'the-trust.md');
  const mainTrustContent = await fs.readFile(filePath, 'utf8');

  const mainContentHtml = await getProcessedContent(mainTrustContent);

  const trusteesDirectory = path.join(process.cwd(), 'public', 'pages', 'trustees');
  const trusteeFileNames = await fs.readdir(trusteesDirectory);

  const allTrustees = await Promise.all(
    trusteeFileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(async (fileName) => {
        const fullPath = path.join(trusteesDirectory, fileName);
        const fileContents = await fs.readFile(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          name: data.name as string,
          imagePath: data.imagePath as string | undefined,
          profileHtml: content ? await getProcessedContent(content) : '',
          order: parseInt(fileName.split('-')[0]),
        };
      })
  );

  const processedTrustees = allTrustees.sort((a, b) => a.order - b.order);

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          The Trust
        </h1>
        <div
          className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
          dangerouslySetInnerHTML={{ __html: mainContentHtml }}
        />

        <h2 className="text-3xl md:text-4xl font-lora font-bold mt-8 mb-4 text-[#2B1E1A] leading-tight">
          Board of Trustees
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedTrustees.map((trustee, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm">
          {trustee.name && (
                <img
                  src={trustee.imagePath ? trustee.imagePath : '/assets/images/the-trust/placeholder.png'}
                  alt={trustee.name}
                  width={150}
                  height={150}
                  className="rounded-full object-cover mb-4"
                />
              )}
              <h3 className="text-xl font-lora font-semibold text-[#2B1E1A] mb-2">{trustee.name}</h3>
              {trustee.profileHtml && (
                <div
                  className="prose prose-sm max-w-none text-[#2B1E1A] font-roboto text-left"
                  dangerouslySetInnerHTML={{ __html: trustee.profileHtml }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default TheTrustPage;

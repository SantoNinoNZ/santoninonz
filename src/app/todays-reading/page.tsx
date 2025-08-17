import React from 'react';
import fs from 'fs/promises';
import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import Header from "@/components/Header"; // Import Header component

async function getTodaysReadingContent() {
  const nzTimeZone = 'Pacific/Auckland';
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: nzTimeZone
  };
  const formatter = new Intl.DateTimeFormat('en-NZ', options);
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const formattedDateForFile = `${year}-${month}-${day}`;

  const filePath = path.join(process.cwd(), 'public', 'word-of-the-day', `word-of-the-day-${formattedDateForFile}.md`);
  let fileContent;

  try {
    fileContent = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Failed to read today's markdown file: ${error}`);
    // Fallback to 2025/08/17 for testing if today's file isn't found
    const fallbackFilePath = path.join(process.cwd(), 'public', 'word-of-the-day', `word-of-the-day-2025-08-17.md`);
    try {
      fileContent = await fs.readFile(fallbackFilePath, 'utf8');
    } catch (fallbackError) {
      console.error(`Failed to read fallback markdown file: ${fallbackError}`);
      return { contentHtml: '<p>Content not available.</p>', liturgicalIndication: 'N/A' };
    }
  }

  const processedContent = await remark().use(html).process(fileContent);
  const contentHtml = processedContent.toString();

  // Extract liturgical indication from the first line (H1)
  const lines = fileContent.split('\n');
  const liturgicalIndication = lines[0].startsWith('# ') ? lines[0].substring(2).trim() : 'N/A';

  return { contentHtml, liturgicalIndication };
}

export default async function TodaysReadingPage() {
  const { contentHtml, liturgicalIndication } = await getTodaysReadingContent();

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          {liturgicalIndication}
        </h1>
        <div
          className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </main>
  );
}

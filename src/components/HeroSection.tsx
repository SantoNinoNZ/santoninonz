"use client";

import React, { useState, useEffect } from 'react';

interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  imageUrl?: string;
  contentHtml?: string;
}

interface HeroSectionProps {
  latestPost: Post | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ latestPost }) => {
  const [liturgicalIndication, setLiturgicalIndication] = useState<string>("");
  const [readingContent, setReadingContent] = useState<string>("");
  const [gospelContent, setGospelContent] = useState<string>("");
  const [currentNZDate, setCurrentNZDate] = useState<string>("");

  useEffect(() => {
    const fetchWordOfTheDay = async () => {
      try {
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
        const displayDate = new Intl.DateTimeFormat('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' }).format(now);
        setCurrentNZDate(displayDate);

        const markdownFilePath = `/word-of-the-day/word-of-the-day-${formattedDateForFile}.md`;
        const response = await fetch(markdownFilePath);
        
        if (!response.ok) {
          // Fallback to 2025/08/17 for testing if today's file isn't found
          const fallbackDateForFile = "2025-08-17";
          const fallbackMarkdownFilePath = `/word-of-the-day/word-of-the-day-${fallbackDateForFile}.md`;
          const fallbackResponse = await fetch(fallbackMarkdownFilePath);
          if (!fallbackResponse.ok) {
            throw new Error(`Failed to fetch markdown for today or fallback date: ${response.statusText}`);
          }
          const fallbackText = await fallbackResponse.text();
          parseMarkdownContent(fallbackText);
          setCurrentNZDate(new Intl.DateTimeFormat('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date('2025-08-17')));
        } else {
          const markdownText = await response.text();
          parseMarkdownContent(markdownText);
        }

      } catch (error) {
        console.error("Failed to fetch or parse word of the day:", error);
        setLiturgicalIndication("N/A");
        setReadingContent("Failed to load reading.");
        setGospelContent("Failed to load gospel.");
      }
    };

    const parseMarkdownContent = (markdown: string) => {
      const lines = markdown.split('\n');
      let currentSection = '';
      const tempReading: string[] = [];
      const tempGospel: string[] = [];

      for (const line of lines) {
        if (line.startsWith('# ')) {
          setLiturgicalIndication(line.substring(2).trim());
        } else if (line.startsWith('## Reading of the day')) {
          currentSection = 'reading';
          tempReading.push(line);
        } else if (line.startsWith('## Gospel of the day')) {
          currentSection = 'gospel';
          tempGospel.push(line);
        } else {
          if (currentSection === 'reading') {
            tempReading.push(line);
          } else if (currentSection === 'gospel') {
            tempGospel.push(line);
          }
        }
      }
      setReadingContent(tempReading.join('\n'));
      setGospelContent(tempGospel.join('\n'));
    };

    fetchWordOfTheDay();
  }, []);

  const extractBookAndExcerpt = (content: string, maxLength: number = 100) => {
    const lines = content.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 3) return { book: '', excerpt: '' }; // Need at least title, book line, verse line, and some content

    const bookLine = lines[1]; // This should be "A reading from the Book of Judges" or "From the Gospel according to Matthew"
    const verseLine = lines[2]; // This should be "2:11-19" or "19:16-22"

    const bookMatch = bookLine.match(/(?:A reading from the|From the) (?:Book of|Letter of St\. Paul to the|Gospel according to)\s+(.+)/);
    let book = bookMatch && bookMatch[1] ? bookMatch[1].trim() : 'Unknown Book';
    const verse = verseLine.trim();

    // Clean up book name if it contains HTML tags or extra spaces (though it shouldn't with markdown)
    book = book.replace(/<\/?br\s*\/?>/g, '').trim();

    let excerpt = lines.slice(3).join(' ').replace(/<\/?p>/g, '').trim(); // Start excerpt after book and verse lines
    if (excerpt.length > maxLength) {
      excerpt = excerpt.substring(0, maxLength) + '...';
    }

    return { book: `${book} ${verse}`.trim(), excerpt };
  };

  const readingInfo = extractBookAndExcerpt(readingContent);
  const gospelInfo = extractBookAndExcerpt(gospelContent);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center">
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-screen-xl px-4 py-12 flex flex-col text-white"> {/* Changed to flex-col */}
        {/* Date and Liturgical Indication */}
        <div className="text-lg font-bold text-right mb-4 ml-auto"> {/* Moved inside and used ml-auto */}
          <p>{currentNZDate}</p>
          <p>{liturgicalIndication}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* New grid container */}
          {/* Left Column: Latest Post */}
        <div className="relative group bg-white/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-2xl font-lora font-bold mb-4">Latest Post</h3>
          {latestPost && (
            <a href={`/posts/${latestPost.slug}`} className="block">
              <h4 className="text-xl font-bold group-hover:text-gray-300 transition-colors duration-300">{latestPost.title}</h4>
              <p className="text-gray-200 text-sm mb-2">{new Date(latestPost.date.split('/').reverse().join('-')).toLocaleString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-gray-100">{latestPost.excerpt || 'Click to read more...'}</p>
              {/* Transparent overlay on hover */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
            </a>
          )}
        </div>

        {/* Right Column: Today's Gospel Reading and Catholic Season */}
        <div className="relative group bg-white/10 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
          <a href="/todays-reading" className="block">
            <h3 className="text-2xl font-lora font-bold mb-4 group-hover:text-gray-300 transition-colors duration-300">Today's Readings</h3>
            {readingInfo.book && (
              <p className="mb-2">
                <strong>{readingInfo.book}:</strong> {readingInfo.excerpt}
              </p>
            )}
            {gospelInfo.book && (
              <p className="mb-4">
                <strong>{gospelInfo.book}:</strong> {gospelInfo.excerpt}
              </p>
            )}
            {/* Transparent overlay on hover */}
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
          </a>
        </div>
      </div> {/* Closing div for grid container */}
      </div> {/* Closing div for max-w-screen-xl container */}
    </div>
  );
};

export default HeroSection;

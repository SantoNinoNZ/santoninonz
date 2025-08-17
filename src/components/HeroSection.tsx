"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Event, RecurringEvent, DatedEvent } from '@/lib/events'; // Only import types

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
  upcomingEvents: Event[]; // Add upcomingEvents prop
}

function isRecurringEvent(event: Event): event is RecurringEvent {
  return event.type === 'recurring';
}

function isDatedEvent(event: Event): event is DatedEvent {
  return event.type === 'dated';
}

const HeroSection: React.FC<HeroSectionProps> = ({ latestPost, upcomingEvents }) => {
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
    if (lines.length < 3) return { book: '', excerpt: '' };

    const bookLine = lines[1];
    const verseLine = lines[2];

    const bookMatch = bookLine.match(/(?:A reading from the|From the) (?:Book of|Letter of St\. Paul to the|Gospel according to)\s+(.+)/);
    let book = bookMatch && bookMatch[1] ? bookMatch[1].trim() : 'Unknown Book';
    const verse = verseLine.trim();

    book = book.replace(/<\/?br\s*\/?>/g, '').trim();

    let excerpt = lines.slice(3).join(' ').replace(/<\/?p>/g, '').trim();
    if (excerpt.length > maxLength) {
      excerpt = excerpt.substring(0, maxLength) + '...';
    }

    return { book: `${book} ${verse}`.trim(), excerpt };
  };

  const readingInfo = extractBookAndExcerpt(readingContent);
  const gospelInfo = extractBookAndExcerpt(gospelContent);

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-screen-xl px-4 py-8 sm:py-12 flex flex-col text-white">
        {/* Date and Liturgical Indication */}
        <div className="text-lg font-bold text-right mb-4 ml-auto pt-4">
          <p>{currentNZDate}</p>
          <p>{liturgicalIndication}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Latest Post */}
          <div className="relative group bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl sm:text-2xl font-lora font-bold mb-2 sm:mb-4">Latest Post</h3>
            {latestPost && (
              <Link href={`/posts/${latestPost.slug}`} className="block">
                <h4 className="text-xl font-bold group-hover:text-gray-300 transition-colors duration-300">{latestPost.title}</h4>
                <p className="text-gray-200 text-sm mb-2">{new Date(latestPost.date.split('/').reverse().join('-')).toLocaleString('en-NZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-100">{latestPost.excerpt || `Click to read more...`}</p>
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
              </Link>
            )}
          </div>

          {/* Right Column: Today's Gospel Reading and Catholic Season */}
          <div className="relative group bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href="/todays-reading" className="block">
              <h3 className="text-xl sm:text-2xl font-lora font-bold mb-2 sm:mb-4 group-hover:text-gray-300 transition-colors duration-300">Today's Readings</h3>
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
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-lg"></div>
            </Link>
          </div>
        </div> {/* Closing div for grid container */}

        {/* Upcoming Events Section */}
        {upcomingEvents.length > 0 && (
          <div className="mt-8 bg-white/10 p-4 sm:p-6 rounded-lg shadow-lg">
            <h3 className="text-xl sm:text-2xl font-lora font-bold mb-2 sm:mb-4 text-white">Upcoming Events</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`} className="block group">
                  <div className="bg-white/5 p-4 rounded-md hover:bg-white/10 transition-colors duration-300">
                    <h4 className="text-xl font-semibold mb-1 text-white group-hover:text-gray-300">
                      {event.title}
                    </h4>
                    {isRecurringEvent(event) && (
                      <p className="text-gray-300 text-sm">
                        {event.recurrence} at {event.time}
                      </p>
                    )}
                    {isDatedEvent(event) && (
                      <p className="text-gray-300 text-sm">
                        {format(new Date(event.startDate), 'MMM dd, yyyy')} - {format(new Date(event.endDate), 'MMM dd, yyyy')}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {event.venue}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link href="/events" className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium">
                View All Events &rarr;
              </Link>
            </div>
          </div>
        )}
      </div> {/* Closing div for max-w-screen-xl container */}
    </div>
  );
};

export default HeroSection;

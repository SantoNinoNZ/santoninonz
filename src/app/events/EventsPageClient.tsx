"use client";

import React from 'react';
import Link from 'next/link';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay, getDate } from 'date-fns';
import { enNZ } from 'date-fns/locale';
import { Event, RecurringEvent, DatedEvent } from '@/lib/events';
import Header from '@/components/Header'; // Import the Header component
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

// Helper function to check if a day matches a recurring event's recurrence pattern
function isMatchingRecurringDay(day: Date, event: RecurringEvent, startOfCurrentMonth: Date, endOfCurrentMonth: Date): boolean {
  const dayOfWeekIndex = getDay(day); // 0 for Sunday, 1 for Monday, etc.
  const dayOfWeekName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeekIndex];

  // First, check if the day of the week matches
  if (!event.recurrence.includes(dayOfWeekName)) {
    return false;
  }

  // Get all occurrences of this specific day of the week within the current month
  const allOccurrencesOfThisWeekdayInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth })
    .filter(d => getDay(d) === dayOfWeekIndex);

  // Determine the specific recurrence type based on the recurrence string
  const hasFirst = event.recurrence.includes('First');
  const hasThird = event.recurrence.includes('Third');
  const hasEvery = event.recurrence.includes('Every');

  if (hasFirst && hasThird) {
    // Handle "First and Third [DayOfWeek]"
    const firstOccurrence = allOccurrencesOfThisWeekdayInMonth[0];
    const thirdOccurrence = allOccurrencesOfThisWeekdayInMonth[2]; // 0-indexed, so index 2 is the third occurrence

    return (firstOccurrence && isSameDay(firstOccurrence, day)) ||
           (thirdOccurrence && isSameDay(thirdOccurrence, day));
  } else if (hasFirst) {
    // Handle "First [DayOfWeek]" (only if "Third" is not also present)
    const firstOccurrence = allOccurrencesOfThisWeekdayInMonth[0];
    return firstOccurrence && isSameDay(firstOccurrence, day);
  } else if (hasThird) {
    // Handle "Third [DayOfWeek]" (only if "First" is not also present)
    const thirdOccurrence = allOccurrencesOfThisWeekdayInMonth[2];
    return thirdOccurrence && isSameDay(thirdOccurrence, day);
  } else if (hasEvery && !hasFirst && !hasThird) { // Only check 'Every' if 'First' or 'Third' are not present
    // Handle "Every [DayOfWeek]" (only if neither "First" nor "Third" are specified)
    return true;
  }

  return false; // No specific recurrence pattern matched
}

interface EventsPageClientProps {
  allEventsData: Event[];
}

export default function EventsPageClient({ allEventsData }: EventsPageClientProps) {
  const searchParams = useSearchParams(); // Get searchParams from hook
  const today = new Date();
  const currentMonth = searchParams.get('month') ? parseInt(searchParams.get('month')!) - 1 : today.getMonth();
  const currentYear = searchParams.get('year') ? parseInt(searchParams.get('year')!) : today.getFullYear();

  const date = new Date(currentYear, currentMonth);
  const startOfCurrentMonth = startOfMonth(date);
  const endOfCurrentMonth = endOfMonth(date);

  const daysInMonth = eachDayOfInterval({ start: startOfCurrentMonth, end: endOfCurrentMonth });

  // Filter dated events for the current month
  const datedEventsInMonth = allEventsData.filter(event =>
    (event as DatedEvent).startDate && (new Date((event as DatedEvent).startDate).getFullYear() === currentYear && new Date((event as DatedEvent).startDate).getMonth() === currentMonth ||
     (event as DatedEvent).endDate && new Date((event as DatedEvent).endDate).getFullYear() === currentYear && new Date((event as DatedEvent).endDate).getMonth() === currentMonth)
  ) as DatedEvent[];

  // Get recurring events
  const recurringEvents = allEventsData.filter(event => event.type === 'recurring') as RecurringEvent[];

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header /> {/* Render the Header component */}
      <div className="container mx-auto px-4 py-8 text-white">
        <h1 className="text-4xl font-bold text-center mb-12">Upcoming Events Calendar</h1>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Link href={`/events?year=${format(subMonths(date, 1), 'yyyy')}&month=${format(subMonths(date, 1), 'MM')}`} className="text-blue-400 hover:text-blue-300">
            &larr; Previous Month
          </Link>
          <h2 className="text-3xl font-semibold">
            {format(date, 'MMMM yyyy', { locale: enNZ })}
          </h2>
          <Link href={`/events?year=${format(addMonths(date, 1), 'yyyy')}&month=${format(addMonths(date, 1), 'MM')}`} className="text-blue-400 hover:text-blue-300">
            Next Month &rarr;
          </Link>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 border border-gray-700 rounded-lg overflow-hidden">
          {/* Days of Week Headers */}
          {daysOfWeek.map(day => (
            <div key={day} className="bg-gray-800 p-2 text-center font-medium text-sm">
              {day}
            </div>
          ))}

          {/* Empty cells for days before the 1st of the month */}
          {Array.from({ length: startOfCurrentMonth.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white/5 p-2 min-h-[100px] border-t border-gray-700"></div>
          ))}

          {/* Days with Events */}
          {daysInMonth.map(day => {
            const eventsOnThisDay: Event[] = [];

            // Add dated events
            datedEventsInMonth.forEach(event => {
              if (isSameDay(new Date(event.startDate), day) || (new Date(event.startDate) <= day && new Date(event.endDate) >= day)) {
                eventsOnThisDay.push(event);
              }
            });

            // Add recurring events
            recurringEvents.forEach(event => {
              if (isMatchingRecurringDay(day, event, startOfCurrentMonth, endOfCurrentMonth)) {
                eventsOnThisDay.push(event);
              }
            });

            return (
              <div key={format(day, 'yyyy-MM-dd')} className={`bg-white/5 p-2 min-h-[100px] border-t border-gray-700 ${isSameDay(day, today) ? 'border-2 border-blue-500' : ''}`}>
                <p className="text-sm font-medium mb-1">{format(day, 'd')}</p>
                <div className="space-y-1">
                  {eventsOnThisDay.map(event => (
                    <Link key={event.slug} href={`/events/${event.slug}`} className="block">
                      <div className="bg-blue-600 text-white text-xs p-1 rounded hover:bg-blue-500 transition-colors duration-200">
                        {event.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

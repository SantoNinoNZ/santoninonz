import { getSortedEventsData } from '@/lib/events';
import EventsPageClient from './EventsPageClient'; // Import the new client component
import React from 'react'; // Import React for Suspense

export default async function EventsPage() {
  const allEventsData = await getSortedEventsData();

  return (
    <React.Suspense fallback={<div>Loading calendar...</div>}>
      <EventsPageClient allEventsData={allEventsData} />
    </React.Suspense>
  );
}

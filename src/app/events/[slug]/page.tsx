import { getEventData, getSortedEventsData, Event, RecurringEvent, DatedEvent } from '@/lib/events';
import { format } from 'date-fns';

function isRecurringEvent(event: Event): event is RecurringEvent {
  return event.type === 'recurring';
}

function isDatedEvent(event: Event): event is DatedEvent {
  return event.type === 'dated';
}

export async function generateStaticParams() {
  const allEvents = await getSortedEventsData();
  return allEvents.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventData(params.slug);

  if (!event) {
    return <div className="text-white text-center py-12">Event not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">{event.title}</h1>

      {isRecurringEvent(event) && (
        <div className="bg-white/10 rounded-lg shadow-lg p-6 mb-8">
          <p className="text-lg mb-2">
            <span className="font-medium">Recurrence:</span> {event.recurrence}
          </p>
          <p className="text-lg mb-2">
            <span className="font-medium">Time:</span> {event.time}
          </p>
          <p className="text-lg">
            <span className="font-medium">Venue:</span> {event.venue}, {event.address}
          </p>
          {event.contentHtml && (
            <div
              className="prose prose-invert mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: event.contentHtml }}
            />
          )}
        </div>
      )}

      {isDatedEvent(event) && (
        <div className="bg-white/10 rounded-lg shadow-lg p-6 mb-8">
          <p className="text-lg mb-2">
            <span className="font-medium">Dates:</span> {format(new Date(event.startDate), 'MMM dd, yyyy')} - {format(new Date(event.endDate), 'MMM dd, yyyy')}
          </p>
          <p className="text-lg mb-2">
            <span className="font-medium">Venue:</span> {event.venue}, {event.address}
          </p>
          {event.rosaryTime && (
            <p className="text-lg mb-2">
              <span className="font-medium">Rosary starts:</span> {event.rosaryTime}
            </p>
          )}
          {event.parkingInfo && (
            <p className="text-lg mb-2">
              <span className="font-medium">Parking:</span> {event.parkingInfo}
            </p>
          )}

          <h2 className="text-3xl font-semibold mt-8 mb-4">Daily Schedule</h2>
          <div className="space-y-6">
            {event.days.map((day) => (
              <div key={day.dayNumber} className="bg-white/5 rounded-md p-4">
                <h3 className="text-xl font-semibold mb-2">Day {day.dayNumber}: {day.date}</h3>
                <p className="text-gray-300 text-base mb-1">
                  <span className="font-medium">Choir:</span> {day.choir}
                </p>
                <p className="text-gray-300 text-base mb-1">
                  <span className="font-medium">Sponsors & Pilgrims:</span> {day.sponsorsPilgrims}
                </p>
                <p className="text-gray-300 text-base">
                  <span className="font-medium">Area Coordinators:</span> {day.areaCoordinators}
                </p>
              </div>
            ))}
          </div>

          {event.contentHtml && (
            <div
              className="prose prose-invert mt-6 max-w-none"
              dangerouslySetInnerHTML={{ __html: event.contentHtml }}
            />
          )}
        </div>
      )}
    </div>
  );
}

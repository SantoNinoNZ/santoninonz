import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <h2 className="text-4xl font-bold text-red-800 mb-6">Welcome to Santonino NZ</h2>
      <p className="text-lg text-gray-700 text-center max-w-2xl mb-8">
        Keeping the Faith in New Zealand. Join us in celebrating our devotion and staying updated with our latest news and events.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Placeholder for Latest Blog Posts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-red-700 mb-4">Latest Blog Posts</h3>
          <p className="text-gray-600">Content coming soon from WordPress migration.</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Read More</button>
        </div>

        {/* Placeholder for Upcoming Events */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-red-700 mb-4">Upcoming Events</h3>
          <p className="text-gray-600">Check our calendar for upcoming events.</p>
          <button className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">View Calendar</button>
        </div>

        {/* Placeholder for Quick Links / Sidebar items */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-red-700 mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#" className="hover:text-red-700">Prayer Request</a></li>
            <li><a href="#" className="hover:text-red-700">House Visit</a></li>
            <li><a href="#" className="hover:text-red-700">Donation</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

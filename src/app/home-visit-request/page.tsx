import React from 'react';
import Header from "@/components/Header";

const HomeVisitRequestPage = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          Home Visit Request
        </h1>
        <div className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto">
          <p>Legend has it that the Child Jesus Senyor Santo Niño sneaks out of the basilica at night to visit sick children in their homes and heal them as they sleep. In the morning, the altar boys are dumbfounded to find the Christ Child has muddy, worn-out shoes inside his glass casing.</p>
          <p>For 24 years now, the NZ-Filipino Devotees of Senyor Sto Niño has been organizing a 2 week house to house visitation of the pilgrim Sto Niño. We encourage you to invite him to your homes. We have received stories of healing and answered prayers through heartfelt worship. The real miracle is that Sto Niño has made a way for us to communicate love for others through means of prayers, comforting our restless souls.</p>
          <p>Let us know which 2 weeks of the year you would like to volunteer and host Him into your homes. May He enrich your lives.</p>

          <form className="mt-8 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#2B1E1A]">Name (required)</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2B1E1A]">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-[#2B1E1A]">Contact Information</label>
              <input
                type="text"
                id="contact"
                name="contact"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="requestedDateTime" className="block text-sm font-medium text-[#2B1E1A]">Please enter your requested day and time for house visit (required)</label>
              <textarea
                id="requestedDateTime"
                name="requestedDateTime"
                rows={5}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            <div>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#A78BFA] hover:bg-[#8B5CF6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default HomeVisitRequestPage;

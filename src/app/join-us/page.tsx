import React from 'react';
import Header from "@/components/Header";

const JoinUsPage = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          Join Us
        </h1>
        <form className="space-y-4 text-[#2B1E1A] font-roboto">
          <div>
            <label htmlFor="name" className="block text-lg font-medium text-[#2B1E1A]">
              Name (required)
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-medium text-[#2B1E1A]">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-lg font-medium text-[#2B1E1A]">
              Phone (required)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-lg font-medium text-[#2B1E1A]">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-lg font-medium text-[#2B1E1A]">
              Your Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
          <div className="flex items-center">
            <input
              id="volunteer"
              name="volunteer"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="volunteer" className="ml-2 block text-lg text-[#2B1E1A]">
              I want to volunteer as an active member
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="share-story"
              name="share-story"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="share-story" className="ml-2 block text-lg text-[#2B1E1A]">
              I want to share my story/testimonial
            </label>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#A73D3D] hover:bg-[#8B2F2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A73D3D]"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
};

export default JoinUsPage;

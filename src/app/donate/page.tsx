import React from 'react';
import Header from "@/components/Header";

const DonatePage = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg text-[#2B1E1A] font-roboto">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-6">Contact Us</h1>

        

        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-lg font-semibold mb-1">Name (required)</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4B34C]"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-lg font-semibold mb-1">Email (required)</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4B34C]"
            />
          </div>
          <div>
            <label htmlFor="subject" className="block text-lg font-semibold mb-1">Message Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4B34C]"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-lg font-semibold mb-1">Enter your Message (required)</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4B34C]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#861D1D] text-white font-bold py-3 px-4 rounded-md hover:bg-[#F4B34C] transition-colors duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  );
};

export default DonatePage;

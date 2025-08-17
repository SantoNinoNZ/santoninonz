import React from 'react';
import Header from "@/components/Header";

const PrayerRequestPage = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-screen-xl bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl md:text-5xl font-lora font-bold mb-4 text-[#2B1E1A] leading-tight">
          Prayer Request
        </h1>
        <div className="prose prose-lg max-w-none text-[#2B1E1A] font-roboto">
          <p>In these moments of deliverance we do not realize that someone, somewhere, is praying for us. Great is the power of prayer for one another – as with an unseen hand.</p>
          <p>We will include your prayer request in the novena masses for Señor Sto Niño.</p>
          <p>Many devotees have experienced both physical and spiritual healing which continue to happen each day.</p>
          <p>Inspired by HIS promise that never was it known that anyone who fled to His protection, implored His help, or sought His intercession was left unaided – we are assured of His love.</p>
          <p>We encourage you to share with us your victory as it happen so we can thank Him.</p>
          <p>Please note that your email address is for our records only. Your email address will remain confidential and will not be sold or shared with anyone.</p>

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
              <label htmlFor="prayerRequest" className="block text-sm font-medium text-[#2B1E1A]">Prayer Request (required)</label>
              <textarea
                id="prayerRequest"
                name="prayerRequest"
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

export default PrayerRequestPage;

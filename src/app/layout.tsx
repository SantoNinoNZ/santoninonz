import type { Metadata } from "next";
import { Roboto, Lora } from "next/font/google";
import Link from "next/link"; // Import Link component
import "./globals.css";

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Santo Niño NZ",
  description: "Official website for Santo Nin NZ - Keeping the Faith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${lora.variable}`}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-[#861D1D] text-[#E8E2D1] py-12 shadow-md">
            <nav className="container mx-auto flex flex-col sm:flex-row justify-between items-center py-0 relative">
              <img src="/assets/images/santoninocebu.png" alt="Santo Niño NZ" className="h-64 w-auto absolute top-18 left-0 transform -translate-y-1/2 z-999999" />
              <div className="flex items-center space-x-4 w-full sm:w-auto pl-80">
                <ul className="flex space-x-4 flex-grow justify-center sm:justify-end">
                  <li><Link href="/" className="hover:text-[#F4B34C] transition-colors duration-300">Home</Link></li>
                  <li><Link href="/about" className="hover:text-[#F4B34C] transition-colors duration-300">About Us</Link></li>
                  <li><Link href="/posts" className="hover:text-[#F4B34C] transition-colors duration-300">Blog</Link></li>
                  <li><Link href="/events" className="hover:text-[#F4B34C] transition-colors duration-300">Events</Link></li>
                  <li><Link href="/contact" className="hover:text-[#F4B34C] transition-colors duration-300">Contact</Link></li>
                </ul>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="p-2 rounded-md bg-[#E8E2D1] text-[#2B1E1A] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#F4B34C] transition-all duration-300 w-24 sm:w-40 md:w-48"
                  />
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8 max-w-screen-xl">
            {children}
          </main>
          <footer className="bg-[#861D1D] text-[#E8E2D1] p-6 text-center shadow-md mt-12">
            <p className="text-lg">&copy; {new Date().getFullYear()} Santo Niño NZ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Santonino NZ",
  description: "Official website for Santonino NZ - Keeping the Faith",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-red-700 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-yellow-400">Santonino NZ</h1>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-yellow-400">Home</a></li>
                <li><a href="#" className="hover:text-yellow-400">About Us</a></li>
                <li><a href="#" className="hover:text-yellow-400">Blog</a></li>
                <li><a href="#" className="hover:text-yellow-400">Events</a></li>
                <li><a href="#" className="hover:text-yellow-400">Contact</a></li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-4">
            {children}
          </main>
          <footer className="bg-red-700 text-white p-4 text-center shadow-md mt-8">
            <p>&copy; {new Date().getFullYear()} Santonino NZ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <header className="bg-[#861D1D] text-[#E8E2D1] p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold text-[#F4B34C]">Santo Niño NZ</h1>
              <ul className="flex space-x-4">
                <li><a href="#" className="hover:text-[#F4B34C]">Home</a></li>
                <li><a href="#" className="hover:text-[#F4B34C]">About Us</a></li>
                <li><a href="#" className="hover:text-[#F4B34C]">Blog</a></li>
                <li><a href="#" className="hover:text-[#F4B34C]">Events</a></li>
                <li><a href="#" className="hover:text-[#F4B34C]">Contact</a></li>
              </ul>
            </nav>
          </header>
          <main className="flex-grow container mx-auto p-8">
            {children}
          </main>
          <footer className="bg-[#861D1D] text-[#E8E2D1] p-4 text-center shadow-md mt-8">
            <p>&copy; {new Date().getFullYear()} Santo Niño NZ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

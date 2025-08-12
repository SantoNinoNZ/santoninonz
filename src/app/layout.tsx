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
  title: "Santo Niño New Zealand",
  description: "Official website for Santo Niño New Zealand - Keeping the Faith",
  icons: {
    icon: '/santonino.svg',
  },
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
          {children}
          <footer className="bg-[#861D1D] text-[#E8E2D1] p-6 text-center shadow-md mt-auto"> {/* Changed mt-12 to mt-auto to push footer to bottom */}
            <p className="text-lg">&copy; {new Date().getFullYear()} Santo Niño NZ. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

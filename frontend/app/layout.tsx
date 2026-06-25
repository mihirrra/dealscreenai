import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BB2022Realty - DealScreenAI",
  description: "Commercial Properties Illinois",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950">
        <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">BB</div>
              <span className="text-white font-bold text-sm">BB2022Realty</span>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-gray-300 hover:text-white transition text-sm">Chat</a>
              <a href="/properties" className="text-gray-300 hover:text-white transition text-sm">Properties</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
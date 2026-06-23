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
              <span className="text-white font-bold text-sm">DealScreenAI</span>
            </div>
            <div className="flex gap-2 md:gap-4 overflow-x-auto">
              <a href="/" className="text-gray-300 hover:text-white transition text-xs md:text-sm whitespace-nowrap">Chat</a>
              <a href="/properties" className="text-gray-300 hover:text-white transition text-xs md:text-sm whitespace-nowrap">Properties</a>
              <a href="/dashboard" className="text-gray-300 hover:text-white transition text-xs md:text-sm whitespace-nowrap">Dashboard</a>
              <a href="/admin" className="text-gray-300 hover:text-white transition text-xs md:text-sm whitespace-nowrap">Admin</a>
              <a href="/admin/questions" className="text-gray-300 hover:text-white transition text-xs md:text-sm whitespace-nowrap">Questions</a>
              <a href="/admin/crexi" className="text-gray-300 hover:text-white transition text-xs md:text-sm whitespace-nowrap">Crexi</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
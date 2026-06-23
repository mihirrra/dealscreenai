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
        <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">BB</div>
            <span className="text-white font-bold">DealScreenAI</span>
          </div>
          <div className="flex gap-4 ml-auto">
            <a href="/" className="text-gray-300 hover:text-white transition text-sm">Chat</a>
            <a href="/properties" className="text-gray-300 hover:text-white transition text-sm">Properties</a>
            <a href="/dashboard" className="text-gray-300 hover:text-white transition text-sm">Dashboard</a>
            <a href="/admin" className="text-gray-300 hover:text-white transition text-sm">Admin</a>
            <a href="/admin/questions" className="text-gray-300 hover:text-white transition text-sm">Questions</a>
            <a href="/admin/crexi" className="text-gray-300 hover:text-white transition text-sm">Crexi</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
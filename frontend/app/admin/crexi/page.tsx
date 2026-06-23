"use client";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8000";
const BROKER_ID = "bb2022realty";

export default function CrexiPage() {
  const [emailBody, setEmailBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const parseEmail = async () => {
    if (!emailBody.trim()) {
      alert("Please paste email content!");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const response = await axios.post(`${BACKEND_URL}/crexi/parse`, {
        broker_id: BROKER_ID,
        email_body: emailBody,
        subject: "Crexi Listing"
      });

      setResult(response.data.property);
      setEmailBody("");
    } catch (err) {
      setError("Failed to parse email. Please try again.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-2xl font-bold">Crexi Email Parser</h1>
          <p className="text-gray-400">Paste Crexi listing email to auto-import property</p>
        </div>

        {/* Success Result */}
        {result && (
          <div className="bg-green-900 border border-green-500 rounded-2xl p-6 mb-6">
            <h2 className="text-green-300 font-bold text-lg mb-4">✅ Property Imported!</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-400 text-sm">Type</p>
                <p className="text-white font-medium">{result.property_type}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white font-medium">{result.location}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price</p>
                <p className="text-green-400 font-bold">{result.price}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Source</p>
                <p className="text-white font-medium">{result.source}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400 text-sm">Description</p>
                <p className="text-white">{result.description}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              
                <a href="/properties"
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                View Properties
              </a>
              <button
                onClick={() => setResult(null)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Parse Another
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-900 border border-red-500 rounded-2xl p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Email Input */}
        {!result && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <p className="text-gray-400 text-sm mb-3">
              Paste Crexi listing email content below:
            </p>
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder={`Paste email here...\n\nExample:\nNew Listing Alert - Crexi\nProperty: Holiday Inn Express\nLocation: Chicago, IL\nPrice: $3,500,000\nCap Rate: 7.2%\nRooms: 85 rooms\nYear Built: 2005\nDescription: Well maintained hotel...`}
              rows={15}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={parseEmail}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
              >
                {loading ? "Parsing..." : "🤖 Parse & Import"}
              </button>
              <button
                onClick={() => setEmailBody("")}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl transition"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-bold mb-3">How to use:</h3>
          <ol className="space-y-2 text-gray-400 text-sm">
            <li>1. Open your Crexi listing email</li>
            <li>2. Select all email content (Ctrl+A)</li>
            <li>3. Copy it (Ctrl+C)</li>
            <li>4. Paste here (Ctrl+V)</li>
            <li>5. Click "Parse & Import"</li>
            <li>6. Property auto-added to your listings!</li>
          </ol>
        </div>

      </div>
    </main>
  );
}
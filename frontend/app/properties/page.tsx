"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "https://dealscreenai-production.up.railway.app";
const BROKER_ID = "bb2022realty";

const TYPE_ICONS: Record<string, string> = {
  "Hotel": "🏨",
  "Gas Station": "⛽",
  "Liquor Store": "🍷",
  "Convenience Store": "🏪",
  "REO/Bank-Owned": "🏦",
  "default": "🏢"
};

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/properties/all/${BROKER_ID}`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
    setFetching(false);
  };

  const searchProperties = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/properties/search/${BROKER_ID}?query=${query}`
      );
      setProperties(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">BB</span>
          </div>
          <h1 className="text-white text-2xl md:text-3xl font-bold">BB2022Realty Listings</h1>
          <p className="text-gray-400 mt-1">Exclusive Commercial Properties — Illinois</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Live Listings</span>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchProperties()}
            placeholder="🔍 Search... (e.g. Hotel under $2M in Chicago)"
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={searchProperties}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold transition disabled:opacity-50 text-sm"
          >
            {loading ? "..." : "Search"}
          </button>
          {searched && (
            <button
              onClick={() => { setSearched(false); fetchAllProperties(); setQuery(""); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-xl transition text-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          {["All", "Hotel", "Gas Station", "Liquor Store", "Convenience Store"].map((type) => (
            <button
              key={type}
              onClick={() => {
                if (type === "All") { fetchAllProperties(); setSearched(false); setQuery(""); }
                else { setQuery(type); setTimeout(() => searchProperties(), 100); }
              }}
              className="bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-full text-xs whitespace-nowrap transition"
            >
              {TYPE_ICONS[type] || "🏢"} {type}
            </button>
          ))}
        </div>

        {/* Properties */}
        {fetching ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-white text-xl font-bold mb-2">No Properties Found</h2>
            <p className="text-gray-400">Try a different search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {properties.map((property: any, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500 transition group">
                
                {/* Property Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">
                      {TYPE_ICONS[property.property_type] || "🏢"}
                    </span>
                    <span className="bg-blue-700 text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                      {property.source === 'crexi' ? '📋 Crexi' : '✅ Verified'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg mt-2">{property.property_type}</h3>
                  <p className="text-blue-300 text-sm">📍 {property.location}</p>
                </div>

                {/* Property Body */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-400 font-bold text-xl">{property.price}</span>
                    <span className="text-gray-500 text-xs">Illinois</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{property.description}</p>

                  <div className="flex gap-2">
                    
                       <a href="tel:917043612194"
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-sm font-medium transition text-center"
                    >
                      📞 Call Broker
                    </a>
                    
                       <a href="https://wa.me/917043612194"
                      target="_blank"
                      className="flex-1 bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition text-center"
                    >
                      💬 WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-6">
          <p className="text-gray-600 text-sm">BB2022Realty · Licensed Real Estate Broker · Illinois</p>
          <p className="text-gray-600 text-sm">📞 630-550-3598 · BB2022Realty@gmail.com</p>
        </div>

      </div>
    </main>
  );
}
"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8000";
const BROKER_ID = "bb2022realty";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchAllProperties();
  }, []);

  const fetchAllProperties = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/properties/all/${BROKER_ID}`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
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
      console.error("Error searching properties:", error);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">BB</span>
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">BB2022Realty Listings</h1>
            <p className="text-gray-400">Exclusive Commercial Properties - Illinois</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchProperties()}
            placeholder="Search properties... (e.g. Hotel under $2M in Chicago)"
            className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchProperties}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
          {searched && (
            <button
              onClick={() => { setSearched(false); fetchAllProperties(); setQuery(""); }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Properties Grid */}
        {properties.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <h2 className="text-white text-xl font-bold mb-2">No Properties Yet</h2>
            <p className="text-gray-400">Properties will appear here once added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: any, idx) => (
              <div key={idx} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-blue-500 transition">
                
                {/* Property Type Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                    {property.property_type}
                  </span>
                  <span className="text-green-400 font-bold">{property.price}</span>
                </div>

                {/* Property Info */}
                <h3 className="text-white font-bold text-lg mb-2">{property.location}</h3>
                <p className="text-gray-400 text-sm mb-4">{property.description}</p>

                {/* Source */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">Source: {property.source}</span>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                    Contact Broker
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
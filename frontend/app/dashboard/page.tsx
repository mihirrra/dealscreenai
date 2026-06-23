"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8000";
const BROKER_ID = "bb2022realty";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/leads/all/${BROKER_ID}`);
      setLeads(response.data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  const getScoreColor = (score: string) => {
    if (score === "HOT") return "bg-red-900 text-red-300";
    if (score === "WARM") return "bg-yellow-900 text-yellow-300";
    if (score === "COLD") return "bg-blue-900 text-blue-300";
    return "bg-gray-800 text-gray-300";
  };

  const getScoreEmoji = (score: string) => {
    if (score === "HOT") return "🔥";
    if (score === "WARM") return "⚡";
    if (score === "COLD") return "❄️";
    return "⏳";
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">BB</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">Broker Dashboard</h1>
              <p className="text-gray-400">BB2022Realty - Lead Management</p>
            </div>
          </div>
          <button
            onClick={fetchLeads}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition"
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-white">{leads.length}</p>
            <p className="text-gray-400 text-sm">Total Leads</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">
              {leads.filter((l: any) => l.lead_score === "HOT").length}
            </p>
            <p className="text-gray-400 text-sm">🔥 Hot Leads</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">
              {leads.filter((l: any) => l.lead_score === "WARM").length}
            </p>
            <p className="text-gray-400 text-sm">⚡ Warm Leads</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">
              {leads.filter((l: any) => l.nda_signed).length}
            </p>
            <p className="text-gray-400 text-sm">✅ NDA Signed</p>
          </div>
        </div>

        {/* Leads Table */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-400">Loading leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-white text-xl font-bold mb-2">No Leads Yet</h2>
            <p className="text-gray-400">Leads will appear here once buyers start chatting.</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-gray-400 p-4">Lead</th>
                  <th className="text-left text-gray-400 p-4">Score</th>
                  <th className="text-left text-gray-400 p-4">NDA</th>
                  <th className="text-left text-gray-400 p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: any, idx) => (
                  <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition">
                    <td className="p-4">
                      <p className="text-white font-medium">
                        {lead.lead_name || "Unknown"}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {lead.lead_email || lead.session_id?.slice(0, 8) + "..."}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(lead.lead_score)}`}>
                        {getScoreEmoji(lead.lead_score)} {lead.lead_score}
                      </span>
                    </td>
                    <td className="p-4">
                      {lead.nda_signed ? (
                        <span className="text-green-400 font-medium">✅ Signed</span>
                      ) : (
                        <span className="text-gray-500">⏳ Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400 text-sm">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
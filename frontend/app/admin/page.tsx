"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8000";
const BROKER_ID = "bb2022realty";

export default function AdminPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    property_type: "",
    location: "",
    price: "",
    description: "",
    source: "manual"
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/properties/all/${BROKER_ID}`);
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const addProperty = async () => {
    if (!form.property_type || !form.location || !form.price) {
      alert("Please fill all required fields!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/properties/add`, {
        ...form,
        broker_id: BROKER_ID
      });
      setForm({
        property_type: "",
        location: "",
        price: "",
        description: "",
        source: "manual"
      });
      setShowForm(false);
      fetchProperties();
      alert("Property added successfully!");
    } catch (error) {
      alert("Error adding property!");
    }
    setLoading(false);
  };

  const deleteProperty = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/properties/${id}`);
      fetchProperties();
    } catch (error) {
      alert("Error deleting property!");
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            <p className="text-gray-400">Manage your property listings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
          >
            {showForm ? "Cancel" : "+ Add Property"}
          </button>
        </div>

        {/* Add Property Form */}
        {showForm && (
          <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
            <h2 className="text-white font-bold text-lg mb-4">Add New Property</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Property Type *</label>
                <select
                  value={form.property_type}
                  onChange={(e) => setForm({...form, property_type: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select type...</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Gas Station">Gas Station</option>
                  <option value="Liquor Store">Liquor Store</option>
                  <option value="Convenience Store">Convenience Store</option>
                  <option value="REO/Bank-Owned">REO/Bank-Owned</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Location *</label>
                <input
                  type="text"
                  placeholder="e.g. Chicago, IL"
                  value={form.location}
                  onChange={(e) => setForm({...form, location: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Price *</label>
                <input
                  type="text"
                  placeholder="e.g. $1,500,000"
                  value={form.price}
                  onChange={(e) => setForm({...form, price: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Source</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm({...form, source: e.target.value})}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="manual">Manual</option>
                  <option value="crexi">Crexi</option>
                  <option value="mls">MLS</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                <textarea
                  placeholder="Property description..."
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={3}
                  className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={addProperty}
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-500 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Property"}
            </button>
          </div>
        )}

        {/* Properties List */}
        <div className="bg-gray-900 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 p-4">Type</th>
                <th className="text-left text-gray-400 p-4">Location</th>
                <th className="text-left text-gray-400 p-4">Price</th>
                <th className="text-left text-gray-400 p-4">Source</th>
                <th className="text-left text-gray-400 p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((prop: any, idx) => (
                <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="p-4">
                    <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {prop.property_type}
                    </span>
                  </td>
                  <td className="p-4 text-white">{prop.location}</td>
                  <td className="p-4 text-green-400 font-bold">{prop.price}</td>
                  <td className="p-4 text-gray-400">{prop.source}</td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteProperty(prop.id)}
                      className="bg-red-900 hover:bg-red-800 text-red-300 px-3 py-1 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}
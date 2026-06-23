"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const BACKEND_URL = "https://dealscreenai-production.up.railway.app";

function NDAContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);

  const signNDA = async () => {
    if (!agreed || !name || !email) return;
    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/nda/signed`, {
        session_id: sessionId,
        lead_email: email
      });
      setSigned(true);
      setTimeout(() => {
        window.location.href = "/properties";
      }, 3000);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (signed) {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-white text-2xl font-bold mb-2">NDA Signed!</h1>
          <p className="text-gray-400 mb-6">Redirecting to properties...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">BB</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Non-Disclosure Agreement</h1>
          <p className="text-gray-400 mt-2">BB2022Realty - Commercial Properties Illinois</p>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 mb-6 h-48 overflow-y-auto">
          <p className="text-gray-300 text-sm leading-relaxed">
            This Non-Disclosure Agreement ("Agreement") is entered into between BB2022Realty 
            ("Broker") and the undersigned party ("Recipient").
            <br/><br/>
            1. CONFIDENTIALITY: Recipient agrees to keep all property information, pricing, 
            seller details, and listing information strictly confidential.
            <br/><br/>
            2. LIMITED USE: Information shared by Broker shall be used solely for the purpose 
            of evaluating potential property acquisitions.
            <br/><br/>
            3. NO DISCLOSURE: Recipient shall not disclose any information to third parties 
            without prior written consent from Broker.
            <br/><br/>
            4. TERM: This agreement remains in effect for 2 years from the date of signing.
            <br/><br/>
            5. GOVERNING LAW: This agreement shall be governed by the laws of Illinois.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-start gap-3 mb-6">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 accent-blue-500"
          />
          <label htmlFor="agree" className="text-gray-300 text-sm">
            I have read and agree to the Non-Disclosure Agreement terms above.
          </label>
        </div>

        <button
          onClick={signNDA}
          disabled={!agreed || !name || !email || loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing..." : "Sign NDA & View Properties"}
        </button>
      </div>
    </main>
  );
}

export default function NDAPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white">Loading...</p>
    </div>}>
      <NDAContent />
    </Suspense>
  );
}
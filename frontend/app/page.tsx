"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

const BACKEND_URL = "https://dealscreenai-production.up.railway.app";
const BROKER_ID = "bb2022realty";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Welcome to BB2022Realty! I'm here to help you find commercial properties in Illinois. May I know your name and email to get started?"
    }
  ]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(false);
  const [triggerNDA, setTriggerNDA] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await axios.post(`${BACKEND_URL}/leads/chat`, {
        broker_id: BROKER_ID,
        session_id: sessionId,
        message: userMessage
      }, { timeout: 60000 });

      const data = response.data;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message
      }]);

      if (data.trigger_nda) {
        setTriggerNDA(true);
      }

    } catch (error: any) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again."
      }]);
    }

    setLoading(false);
  };

  return (
    <main className="bg-gray-950 flex items-center justify-center p-2 md:p-4" style={{height: 'calc(100vh - 52px)'}}>
      <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl flex flex-col" style={{height: '100%'}}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-t-2xl p-3 md:p-4 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
              BB
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-900"></div>
          </div>
          <div>
            <h1 className="text-white font-bold text-base md:text-lg">BB2022Realty</h1>
            <p className="text-blue-300 text-xs">Commercial Properties · Illinois · AI Assistant</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-green-400 text-xs font-medium">● Online 24/7</p>
            <p className="text-blue-300 text-xs">Powered by AI</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-950 px-4 py-2 flex items-center gap-2 border-b border-blue-900">
          <span className="text-blue-400 text-xs">🏢</span>
          <p className="text-blue-300 text-xs">Hotels · Gas Stations · Liquor Stores · Convenience Stores · Illinois Focus</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}>
              
              {msg.role === "assistant" && (
                <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1">
                  BB
                </div>
              )}
              
              <div className={`max-w-[80%] rounded-2xl px-3 md:px-4 py-2 md:py-3 text-sm shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-gray-800 text-gray-100 rounded-bl-sm"
              }`}>
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 mb-1">
                  👤
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-end gap-2">
              <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                BB
              </div>
              <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* NDA Banner */}
          {triggerNDA && (
            <div className="bg-gradient-to-r from-yellow-900 to-orange-900 border border-yellow-600 rounded-2xl p-4 text-center shadow-lg">
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-yellow-300 font-bold text-base mb-1">You Qualify!</p>
              <p className="text-yellow-200 text-xs mb-3">Sign our NDA to unlock exclusive property listings</p>
              
                <a href={`/nda?session=${sessionId}`}
                className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-2 rounded-full font-bold transition text-sm shadow"
              >
                ✍️ Sign NDA & View Properties
              </a>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-gray-800">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center transition flex-shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 text-xs text-center mt-2">🔒 Secure · AI-powered · BB2022Realty</p>
        </div>

      </div>
    </main>
  );
}
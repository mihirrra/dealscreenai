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
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages(prev => [...prev, { role: "user", content: userMessage }]);

    try {
      console.log("Sending to backend:", userMessage);
      console.log("Session ID:", sessionId);

      const response = await axios.post(`${BACKEND_URL}/leads/chat`, {
        broker_id: BROKER_ID,
        session_id: sessionId,
        message: userMessage
      }, { timeout: 60000 });

      console.log("Backend response:", response.data);

      const data = response.data;

      if (!data.message) {
        throw new Error("No message in response");
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.message
      }]);

      if (data.trigger_nda) {
        setTriggerNDA(true);
      }

    } catch (error: any) {
      console.error("Full error:", error);
      console.error("Error response:", error?.response?.data);
      console.error("Error message:", error?.message);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `Error: ${error?.message || "Something went wrong"}`
      }]);
    }

    setLoading(false);
  };

 return (
    <main className="bg-gray-950 flex items-center justify-center p-2 md:p-4" style={{height: 'calc(100vh - 52px)'}}>
  <div className="w-full max-w-2xl bg-gray-900 rounded-2xl shadow-2xl flex flex-col" style={{height: '100%'}}>
        
        {/* Header */}
        <div className="bg-blue-900 rounded-t-2xl p-3 md:p-4 flex items-center gap-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            BB
          </div>
          <div>
            <h1 className="text-white font-bold text-base md:text-lg">BB2022Realty</h1>
            <p className="text-blue-300 text-xs md:text-sm">Commercial Properties Illinois</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-xs md:text-sm">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-2 md:py-3 text-sm md:text-base ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* NDA Banner */}
          {triggerNDA && (
            <div className="bg-yellow-900 border border-yellow-500 rounded-2xl p-3 md:p-4 text-center">
              <p className="text-yellow-300 font-bold mb-2 text-sm md:text-base">🎉 You Qualify!</p>
              <p className="text-yellow-200 text-xs md:text-sm mb-3">Please sign our NDA to view exclusive listings</p>
              
               <a href={`/nda?session=${sessionId}`}
                className="bg-yellow-500 text-black px-4 md:px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition text-sm"
              >
                Sign NDA Now
              </a>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 md:p-4 border-t border-gray-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 text-white rounded-full px-3 md:px-4 py-2 md:py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-4 md:px-6 py-2 md:py-3 font-bold transition disabled:opacity-50 text-sm"
          >
            Send
          </button>
        </div>

      </div>
    </main>
 )
};
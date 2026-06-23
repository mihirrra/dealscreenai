"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = "http://127.0.0.1:8000";
const BROKER_ID = "bb2022realty";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/questions/${BROKER_ID}`);
      setQuestions(response.data.questions);
    } catch (error) {
      // Use default questions if none saved
      setQuestions([
        "What type of property are you looking for? (Hotel, Gas Station, Liquor Store, Convenience Store)",
        "What is your budget range?",
        "Do you have proof of funds ready?",
        "Are you looking for on-market or off-market properties?",
        "What is your closing timeline?",
        "Are you the final decision maker?"
      ]);
    }
  };

  const saveQuestions = async () => {
    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/questions/${BROKER_ID}`, {
        questions: questions
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      alert("Error saving questions!");
    }
    setLoading(false);
  };

  const addQuestion = () => {
    if (!newQuestion.trim()) return;
    setQuestions([...questions, newQuestion]);
    setNewQuestion("");
  };

  const deleteQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...questions];
    [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
    setQuestions(updated);
  };

  const moveDown = (idx: number) => {
    if (idx === questions.length - 1) return;
    const updated = [...questions];
    [updated[idx + 1], updated[idx]] = [updated[idx], updated[idx + 1]];
    setQuestions(updated);
  };

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-white text-2xl font-bold">Qualification Questions</h1>
            <p className="text-gray-400">Customize questions AI asks buyers</p>
          </div>
          <button
            onClick={saveQuestions}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-bold transition ${
              saved 
                ? "bg-green-600 text-white" 
                : "bg-blue-600 hover:bg-blue-500 text-white"
            }`}
          >
            {saved ? "✅ Saved!" : loading ? "Saving..." : "Save Questions"}
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-3 mb-6">
          {questions.map((q, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl p-4 flex items-center gap-3 border border-gray-800">
              <span className="text-blue-400 font-bold text-lg w-8">{idx + 1}</span>
              <p className="text-white flex-1">{q}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => moveUp(idx)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded-lg text-sm transition"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(idx)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-2 py-1 rounded-lg text-sm transition"
                >
                  ↓
                </button>
                <button
                  onClick={() => deleteQuestion(idx)}
                  className="bg-red-900 hover:bg-red-800 text-red-300 px-2 py-1 rounded-lg text-sm transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question */}
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
          <p className="text-gray-400 text-sm mb-3">Add new question:</p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addQuestion()}
              placeholder="Type your question..."
              className="flex-1 bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addQuestion}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Add
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
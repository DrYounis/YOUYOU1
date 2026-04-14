"use client";
import { useEffect } from "react";

export default function Exams() {
  useEffect(() => {
    window.location.href = "/exams.html";
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-3xl font-bold mb-4">Loading Exams...</h1>
        <p className="text-xl">Redirecting to interactive study app...</p>
      </div>
    </div>
  );
}

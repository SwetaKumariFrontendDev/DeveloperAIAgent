"use client";

import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!message.trim()) {
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const result = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await result.json();

      setResponse(data.answer);
    } catch (error) {
      console.error(error);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          🧑‍💻 Developer AI Agent
        </h1>

        <p className="mt-2 text-gray-600">
          Ask me anything about programming.
        </p>

        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          <div className="min-h-[300px] rounded border p-4">
            {response ? (
              <div>
                <h2 className="font-semibold">
                  AI
                </h2>

                <p className="mt-3 whitespace-pre-wrap">
                  {response}
                </p>
              </div>
            ) : (
              <p className="text-gray-400">
                Your AI response will appear here...
              </p>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask a programming question..."
              className="flex-1 rounded border px-4 py-3"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
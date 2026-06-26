import { useState } from "react";
import "./Chatbot.css";

const BACKEND_URL = "http://localhost:3000";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hey! 👋 I'm your CounterAI food assistant. Tell me what you're craving and I'll suggest something. Try: 'spicy chicken', 'something cheap', or 'healthy food'.",
    },
  ]);

  // thi is going to show what the user is currently typing
  const [inputText, setInputText] = useState("");

  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    // this wont send if the box is empty
    if (inputText.trim() === "") return;

    const userMessage = inputText.trim();

    // this would add the users message to the conversation
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputText("");
    setLoading(true);

    try {
      // this sends the message to the backend
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      // add the bot's reply to the conversation
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      // if the backend is not running, show a friendly error
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ I can't connect to the server right now. Make sure the backend is running.",
        },
      ]);
    }

    setLoading(false);
  }

  // let the user press Enter to send instead of clicking the button
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="chatbot-wrapper">
      {/* ---------- Chat window ---------- */}
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="bot-dot" />
              <span>CounterAI Assistant</span>
            </div>
            <button
              className="close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* messages list */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={"message " + (msg.sender === "user" ? "user" : "bot")}
              >
                {msg.text}
              </div>
            ))}

            {/* typing indicator while waiting for reply */}
            {loading && (
              <div className="message bot">
                <span className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}
          </div>

          {/* input row */}
          <div className="chat-input-row">
            <input
              type="text"
              placeholder="Ask me what to eat..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={sendMessage} disabled={loading}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* ---------- Floating button ---------- */}
      <button
        className="chat-bubble-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI food assistant"
      >
        {isOpen ? "✕" : "✨"}
      </button>
    </div>
  );
}

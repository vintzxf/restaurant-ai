import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

const BACKEND_URL = `${import.meta.env.VITE_API_URL}`;
const AUTH_EVENT = "counterai-auth-changed";

const defaultMessages = [
  {
    sender: "bot",
    text: "Hey! I'm your CounterAI food assistant. Tell me what you're craving and I'll suggest something. Try: 'spicy chicken', 'something cheap', or 'healthy food'.",
  },
];

function getCurrentUserKey() {
  const savedUser = localStorage.getItem("user");
  if (!savedUser) return null;

  try {
    const user = JSON.parse(savedUser);
    return user?.id || user?._id || user?.email || null;
  } catch (error) {
    return null;
  }
}

function getChatStorageKey(userKey) {
  return `counterai-chat:${userKey}`;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [userKey, setUserKey] = useState(() => getCurrentUserKey());
  const [messages, setMessages] = useState(defaultMessages);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const skipNextSave = useRef(false);

  useEffect(() => {
    function syncUser() {
      setUserKey(getCurrentUserKey());
      setInputText("");
      setLoading(false);
    }

    window.addEventListener(AUTH_EVENT, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  useEffect(() => {
    skipNextSave.current = true;

    if (!userKey) {
      setMessages(defaultMessages);
      return;
    }

    const savedMessages = localStorage.getItem(getChatStorageKey(userKey));
    if (!savedMessages) {
      setMessages(defaultMessages);
      return;
    }

    try {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(Array.isArray(parsedMessages) ? parsedMessages : defaultMessages);
    } catch (error) {
      setMessages(defaultMessages);
    }
  }, [userKey]);

  useEffect(() => {
    if (!userKey) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }

    localStorage.setItem(getChatStorageKey(userKey), JSON.stringify(messages));
  }, [messages, userKey]);

  async function sendMessage() {
    if (inputText.trim() === "") return;

    const userMessage = inputText.trim();

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setInputText("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "I could not find a reply for that." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I can't connect to the server right now. Make sure the backend is running.",
        },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <div className="chatbot-wrapper">
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
              x
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={"message " + (msg.sender === "user" ? "user" : "bot")}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="message bot">
                <span className="typing-dots">
                  <span>.</span><span>.</span><span>.</span>
                </span>
              </div>
            )}
          </div>

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

      <button
        className="chat-bubble-btn"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open AI food assistant"
      >
        {isOpen ? "x" : "AI"}
      </button>
    </div>
  );
}

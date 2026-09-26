import { useState, useRef, useEffect } from "react";

import "./Chatbot.css";

function Chatbot() {

  const [isOpen, setIsOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([
      {
        role: "assistant",
        content:
          "Hi! I'm Educare AI 👋\n\nI can help you with Educare, courses, lessons, quizzes, certificates, programming and technology.\n\nWhat would you like to know?",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);

  // ==========================================
  // SEND MESSAGE WITH STREAMING
  // ==========================================

  const sendMessage = async () => {

    const cleanMessage =
      message.trim();

    if (
      !cleanMessage ||
      loading
    ) {
      return;
    }

    const token =
      localStorage.getItem("token");

    // Add user message
    setMessages((previous) => [
      ...previous,

      {
        role: "user",
        content: cleanMessage,
      },

      {
        role: "assistant",
        content: "",
      },
    ]);

    setMessage("");
    setLoading(true);

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/ai/chat",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              ...(token
                ? {
                    Authorization:
                      `Bearer ${token}`,
                  }
                : {}),
            },

            body: JSON.stringify({
              message:
                cleanMessage,
            }),
          }
        );

      if (!response.ok) {

        const data =
          await response.json();

        throw new Error(
          data.message ||
            "Unable to contact Educare AI."
        );
      }

      // ======================================
      // READ STREAM
      // ======================================

      const reader =
        response.body.getReader();

      const decoder =
        new TextDecoder();

      let aiResponse = "";

      while (true) {

        const {
          done,
          value,
        } =
          await reader.read();

        if (done) {
          break;
        }

        const chunk =
          decoder.decode(
            value,
            {
              stream: true,
            }
          );

        aiResponse += chunk;

        // Update the last AI message
        setMessages((previous) => {

          const updated =
            [...previous];

          updated[
            updated.length - 1
          ] = {
            role: "assistant",
            content:
              aiResponse,
          };

          return updated;
        });
      }

    } catch (error) {

      console.error(
        "Chatbot error:",
        error
      );

      setMessages((previous) => {

        const updated =
          [...previous];

        updated[
          updated.length - 1
        ] = {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to Educare AI. Please make sure Ollama and the Educare server are running.",
        };

        return updated;
      });

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // ENTER KEY
  // ==========================================

  const handleKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }
  };

  // ==========================================
  // CLEAR CHAT
  // ==========================================

  const clearChat = () => {

    setMessages([
      {
        role: "assistant",
        content:
          "Chat cleared. What would you like to learn? 👋",
      },
    ]);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>

      {!isOpen && (

        <button
          className="chatbot-floating-button"
          onClick={() =>
            setIsOpen(true)
          }
          aria-label="Open Educare AI"
        >
          🤖
        </button>

      )}

      {isOpen && (

        <div className="chatbot-container">

          {/* HEADER */}

          <div className="chatbot-header">

            <div className="chatbot-header-info">

              <div className="chatbot-avatar">
                🤖
              </div>

              <div>

                <h3>
                  Educare AI
                </h3>

                <span>
                  ● Online
                </span>

              </div>

            </div>

            <div className="chatbot-header-actions">

              <button
                onClick={clearChat}
                title="Clear chat"
              >
                ↻
              </button>

              <button
                onClick={() =>
                  setIsOpen(false)
                }
                title="Close"
              >
                ×
              </button>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="chatbot-messages">

            {messages.map(
              (chat, index) => (

                <div
                  key={index}
                  className={`chat-message ${
                    chat.role === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                >

                  {chat.role ===
                    "assistant" && (

                    <div className="message-avatar">
                      🤖
                    </div>

                  )}

                  <div className="message-bubble">

                    {chat.content}

                    {chat.role ===
                      "assistant" &&
                      loading &&
                      index ===
                        messages.length - 1 && (

                      <span className="streaming-cursor">
                        ▌
                      </span>

                    )}

                  </div>

                </div>

              )
            )}

            <div
              ref={messagesEndRef}
            />

          </div>

          {/* INPUT */}

          <div className="chatbot-input-area">

            <textarea
              value={message}
              onChange={(event) =>
                setMessage(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Ask Educare AI..."
              rows="1"
              disabled={loading}
            />

            <button
              onClick={sendMessage}
              disabled={
                loading ||
                !message.trim()
              }
              title="Send message"
            >
              ➤
            </button>

          </div>

          <div className="chatbot-footer">
            Powered by Ollama • Llama 3.2
          </div>

        </div>

      )}

    </>
  );
}

export default Chatbot;
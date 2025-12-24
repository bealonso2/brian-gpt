"use client";
import { chat } from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

function ResetConversationButton({
  resetMessages,
}: {
  resetMessages: () => void;
}) {
  return (
    <button
      onClick={() => {
        resetMessages();
        sessionStorage.removeItem("chat");
      }}
      className="cursor-pointer rounded bg-black p-3 text-white"
    >
      Reset Conversation
    </button>
  );
}

function Input({
  input,
  setInput,
  textareaRef,
  resizeTextarea,
  send,
}: {
  input: string;
  setInput: (value: string) => void;
  textareaRef: any;
  resizeTextarea: () => void;
  send: () => Promise<void>;
}) {
  return (
    <div className="mt-8 flex gap-2">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          resizeTextarea();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        placeholder="Send a message…"
        rows={1}
        className="max-h-50 min-h-14 w-full resize-none overflow-y-auto rounded border-2 border-black p-3"
      />

      <button
        onClick={send}
        disabled={!input.trim()}
        className={`min-h-14 self-end text-white ${input.trim() ? "bg-black" : "bg-gray-500"} rounded p-3 ${input.trim() ? "cursor-pointer" : "cursor-not-allowed"}`}
      >
        Send
      </button>
    </div>
  );
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load messages from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("chat");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    sessionStorage.setItem("chat", JSON.stringify(messages));
  }, [messages]);

  // Auto-resize textarea
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  async function send() {
    if (!input.trim()) return;

    const updated = [...messages, { role: "user", content: input }];
    setMessages(updated);
    setInput("");

    // Reset text area height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Send the chat
    const ai = await chat(updated);
    setMessages([...updated, ai]);
  }

  return (
    <div className="prose prose-md prose-zinc dark:prose-invert mx-auto max-w-3xl p-5">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-3xl font-semibold">BrianGPT</h2>
        <ResetConversationButton resetMessages={() => setMessages([])} />
      </div>

      {/* Messages */}
      <div className="">
        {messages.map((m, i) => (
          <ChatMessage key={i} m={m} />
        ))}
      </div>

      {/* Input */}
      <Input
        textareaRef={textareaRef}
        input={input}
        setInput={setInput}
        resizeTextarea={resizeTextarea}
        send={send}
      />
    </div>
  );
}

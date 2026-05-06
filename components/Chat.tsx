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
      className="h-12 cursor-pointer rounded bg-black px-3 text-sm text-white sm:text-base"
    >
      Reset Conversation
    </button>
  );
}

function Controls({
  reasoningEffort,
  setReasoningEffort,
  textVerbosity,
  setTextVerbosity,
}: {
  reasoningEffort: "low" | "medium" | "high";
  setReasoningEffort: (v: "low" | "medium" | "high") => void;
  textVerbosity: "concise" | "default" | "detailed";
  setTextVerbosity: (v: "concise" | "default" | "detailed") => void;
}) {
  const selectClass =
    "h-12 cursor-pointer rounded bg-black px-3 text-sm text-white sm:text-base";
  return (
    <div className="ml-auto flex gap-3">
      <select
        value={reasoningEffort}
        onChange={(e) =>
          setReasoningEffort(e.target.value as "low" | "medium" | "high")
        }
        className={selectClass}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select
        value={textVerbosity}
        onChange={(e) =>
          setTextVerbosity(e.target.value as "concise" | "default" | "detailed")
        }
        className={selectClass}
      >
        <option value="concise">Concise</option>
        <option value="default">Default</option>
        <option value="detailed">Detailed</option>
      </select>
    </div>
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
  const [reasoningEffort, setReasoningEffort] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [textVerbosity, setTextVerbosity] = useState<
    "concise" | "default" | "detailed"
  >("concise");
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
    const ai = await chat(updated, reasoningEffort, textVerbosity);
    setMessages([...updated, ai]);
  }

  return (
    <div className="prose prose-md prose-zinc dark:prose-invert mx-auto max-w-3xl p-5">
      {/* Header */}
      <div className="my-10 flex items-center gap-3">
        <h2 className="my-0! text-2xl font-semibold sm:text-3xl">BrianGPT</h2>
        <Controls
          reasoningEffort={reasoningEffort}
          setReasoningEffort={setReasoningEffort}
          textVerbosity={textVerbosity}
          setTextVerbosity={setTextVerbosity}
        />
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

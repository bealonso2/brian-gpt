"use client";
import { chat } from "@/app/actions";
import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

const btnClass = "h-12 cursor-pointer rounded bg-black px-3 text-white";
const selectClass = `${btnClass} w-full`;

function StyledSelect({
  value,
  onChange,
  fullWidth,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fullWidth?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${fullWidth ? selectClass : btnClass} appearance-none pr-8`}
      >
        {children}
      </select>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-white"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );
}

function GearIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
    </svg>
  );
}

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
      className={btnClass}
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
  return (
    <div className="ml-auto hidden gap-3 md:flex">
      <StyledSelect
        value={reasoningEffort}
        onChange={(e) =>
          setReasoningEffort(e.target.value as "low" | "medium" | "high")
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </StyledSelect>
      <StyledSelect
        value={textVerbosity}
        onChange={(e) =>
          setTextVerbosity(e.target.value as "concise" | "default" | "detailed")
        }
      >
        <option value="concise">Concise</option>
        <option value="default">Default</option>
        <option value="detailed">Detailed</option>
      </StyledSelect>
    </div>
  );
}

function MobileMenu({
  reasoningEffort,
  setReasoningEffort,
  textVerbosity,
  setTextVerbosity,
  resetMessages,
}: {
  reasoningEffort: "low" | "medium" | "high";
  setReasoningEffort: (v: "low" | "medium" | "high") => void;
  textVerbosity: "concise" | "default" | "detailed";
  setTextVerbosity: (v: "concise" | "default" | "detailed") => void;
  resetMessages: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative ml-auto md:hidden">
      <button onClick={() => setOpen(!open)} className={btnClass}>
        <GearIcon />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 flex min-w-48 flex-col gap-2 rounded border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-black">
          <StyledSelect
            value={reasoningEffort}
            onChange={(e) =>
              setReasoningEffort(e.target.value as "low" | "medium" | "high")
            }
            fullWidth
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </StyledSelect>
          <StyledSelect
            value={textVerbosity}
            onChange={(e) =>
              setTextVerbosity(
                e.target.value as "concise" | "default" | "detailed",
              )
            }
            fullWidth
          >
            <option value="concise">Concise</option>
            <option value="default">Default</option>
            <option value="detailed">Detailed</option>
          </StyledSelect>
          <button
            onClick={() => {
              resetMessages();
              sessionStorage.removeItem("chat");
              setOpen(false);
            }}
            className={btnClass}
          >
            Reset Conversation
          </button>
        </div>
      )}
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

  const controlProps = {
    reasoningEffort,
    setReasoningEffort,
    textVerbosity,
    setTextVerbosity,
  };

  return (
    <div className="prose prose-md prose-zinc dark:prose-invert mx-auto max-w-3xl p-5">
      {/* Header */}
      <div className="my-10 flex items-center gap-3">
        <h2 className="my-0! text-2xl font-semibold sm:text-3xl">BrianGPT</h2>
        <Controls {...controlProps} />
        <div className="hidden md:block">
          <ResetConversationButton resetMessages={() => setMessages([])} />
        </div>
        <MobileMenu
          {...controlProps}
          resetMessages={() => setMessages([])}
        />
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

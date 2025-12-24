"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(messages: any[]) {
  const session = await auth();

  if (!session) {
    // No session → redirect or throw error
    redirect("/api/auth/signin");
  }

  if (session.user?.email !== process.env.ALLOWED_EMAIL) {
    throw new Error("Forbidden");
  }

  // TODO: max tokens?
  const response = await client.responses.create({
    model: "gpt-5.2",
    input: messages.map((m) => ({ role: m.role, content: m.content })),
    instructions: `## General
- Use the python tool to verify non-trivial mathematical calculations (stats, probability, multi-step arithmetic, etc.).
- If you used python, reflect the verified numeric result in the final answer and indicate that the python tool was used.

## Output
Format math for Markdown rendering:
- Inline math must be wrapped in $...$, never as \[...\] or \(...\)
- Display math must be wrapped in $$...$$ on its own line
- Never output bare LaTeX commands (e.g., \\frac{a}{b}) without $ or $$
- Do not put LaTeX math in fenced code blocks; use $ or $$ instead
- If unsure whether something is math, leave it as plain text`,
    tools: [
      { type: "web_search" },
      {
        type: "code_interpreter",
        container: { type: "auto", memory_limit: "1g" },
      },
    ],
  });

  return {
    role: "assistant",
    content: response.output_text ?? "",
  };
}

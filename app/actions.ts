"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function chat(
  messages: any[],
  reasoningEffort: "low" | "medium" | "high",
  textVerbosity: "concise" | "default" | "detailed",
) {
  const session = await auth();

  if (!session) {
    // No session → redirect or throw error
    redirect("/api/auth/signin");
  }

  if (session.user?.email !== process.env.ALLOWED_EMAIL) {
    throw new Error("Forbidden");
  }

  const verbosityMap = { concise: "low", default: "medium", detailed: "high" } as const;

  // TODO: max tokens?
  const response = await (client.responses.create as any)({
    model: "gpt-5.5",
    input: messages.map((m) => ({ role: m.role, content: m.content })),
    instructions: process.env.CHAT_INSTRUCTIONS,
    reasoning: { effort: reasoningEffort },
    text: { verbosity: verbosityMap[textVerbosity] },
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

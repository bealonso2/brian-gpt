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
    input: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    tools: [
      {
        type: "web_search",
      },
    ],
  });

  return {
    role: "assistant",
    content: response.output_text ?? "",
  };
}

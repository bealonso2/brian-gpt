import "highlight.js/styles/felipec.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import CopyButton from "./CopyButton";

export function extractText(node: React.ReactNode): string {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");

    if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
        return extractText(node.props.children);
    }
    return "";
}

export default function ChatMessage({ m }: { m: { role: string; content: string } }) {
    return (
        <div className="my-10">
            <strong>{m.role}</strong>
            <article className="max-w-none markdown">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex, rehypeHighlight]}
                    components={{
                        pre({ children, ...props }) {
                            // children is usually: <code className="language-... hljs">...</code>
                            const codeText = extractText(children).replace(/\n$/, "");
                            return (
                                <div className="relative my-4">
                                    <div className="absolute right-2 top-2">
                                        <CopyButton content={codeText} alwaysLight={true} />
                                    </div>
                                    <pre {...props}>{children}</pre>
                                </div>
                            );
                        },
                    }}
                >
                    {m.content}
                </ReactMarkdown>
            </article>
            <CopyButton content={m.content} />
        </div>
    );
}
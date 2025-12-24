import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import CopyButton from "./CopyButton";

export default function ChatMessage({ m }: { m: { role: string; content: string } }) {
    return (
        <div className="my-10">
            <strong>{m.role}</strong>
            <article className="max-w-none">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {m.content}
                </ReactMarkdown>
            </article>
            <CopyButton content={m.content} />
        </div>
    );
}

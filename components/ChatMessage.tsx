import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CopyButton from "./CopyButton";

export default function ChatMessage({ m }: { m: { role: string; content: string } }) {
    return (
        <div className="my-10">
            <strong>{m.role}</strong>
            <article className="max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]} >
                    {m.content}
                </ReactMarkdown>
            </article>
            <CopyButton content={m.content} />
        </div>
    );
}

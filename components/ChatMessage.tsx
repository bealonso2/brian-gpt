import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessage({ m }: { m: { role: string; content: string } }) {
    return (
        <div className="my-10">
            <strong>{m.role}</strong>
            <article className="prose prose-md max-w-none prose-zinc dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]} >
                    {m.content}
                </ReactMarkdown>
            </article>
        </div>
    );
}

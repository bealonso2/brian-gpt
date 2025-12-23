"use client";

import { useState } from "react";

export default function CopyButton({ content }: { content: string }) {
    const [copied, setCopied] = useState(false);

    // Define a function to copy the contents to the clipboard
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
        }
        catch { };
    };

    return <button className="h-6 w-6 not-prose ml-auto flex" onClick={copy}>
        {copied ? <span>Copied</span> : <img className="dark:invert" src="copy.svg" alt="Copy to clipboard" />}
    </button>;
}
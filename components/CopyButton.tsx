"use client";

import { useState } from "react";

export default function CopyButton({ content, alwaysLight = false }: { content: string, alwaysLight?: boolean }) {
    const [copied, setCopied] = useState(false);

    // Define a function to copy the contents to the clipboard
    const copy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
        }
        catch { };
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="not-prose ml-auto h-6 flex"
            aria-label="Copy to clipboard"
        >
            {copied ? (
                <span className={`text-sm w-full text-right ${alwaysLight && "not-dark:invert"}`}>Copied</span>
            ) : (
                <img className={`h-5 w-5 ${alwaysLight ? "invert" : "dark:invert"}`} src="copy.svg" alt="" />
            )}
        </button>
    );
}
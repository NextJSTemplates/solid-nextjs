"use client";

import { useCallback, useState } from "react";
import { CodeIcon, LoaderIcon, PlayIcon, PythonIcon } from "./icons";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const [output, setOutput] = useState<string | null>(null);
  const [pyodide, setPyodide] = useState<any>(null);
  const match = /language-(\w+)/.exec(className || "");
  const isPython = match && match[1] === "python";
  const codeContent = String(children).replace(/\n$/, "");
  const [tab, setTab] = useState<"code" | "run">("code");

  if (!inline) {
    return (
      <div className="not-prose flex flex-col">
        {tab === "code" && (
          <pre
            {...props}
            className={`w-full overflow-x-auto rounded-xl border border-zinc-200 p-4 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50`}
          >
            <code className="whitespace-pre-wrap break-words">{children}</code>
          </pre>
        )}

        {tab === "run" && output && (
          <div className="w-full overflow-x-auto rounded-b-xl border border-t-0 border-zinc-200 bg-zinc-800 p-4 text-sm text-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
            <code>{output}</code>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <code
        className={`${className} rounded-md bg-zinc-100 px-1 py-0.5 text-sm dark:bg-zinc-800`}
        {...props}
      >
        {children}
      </code>
    );
  }
}

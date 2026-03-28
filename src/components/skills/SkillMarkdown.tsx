"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface SkillMarkdownProps {
  content: string;
}

export function SkillMarkdown({ content }: SkillMarkdownProps) {
  return (
    <div className="border-2 border-border">
      <div className="flex items-center justify-between border-b-2 border-border bg-muted px-4 py-2">
        <span className="text-xs font-semibold tracking-[0.15em] text-primary">
          {/* SKILL.MD */}
        </span>
      </div>
      <div className="prose prose-invert prose-sm max-w-none p-6">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="mb-4 font-display text-2xl font-bold tracking-wide text-foreground">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="mb-3 mt-8 font-display text-xl font-bold tracking-wide text-foreground">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mb-2 mt-6 font-display text-lg font-bold tracking-wide text-foreground">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                {children}
              </p>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.includes("language-");
              if (isBlock) {
                return (
                  <pre className="my-4 overflow-x-auto border-2 border-border bg-muted p-4">
                    <code className="text-xs text-foreground">{children}</code>
                  </pre>
                );
              }
              return (
                <code className="border border-border bg-muted px-1.5 py-0.5 text-xs text-primary">
                  {children}
                </code>
              );
            },
            ul: ({ children }) => (
              <ul className="mb-4 list-disc space-y-1 pl-6 text-sm text-muted-foreground">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="mb-4 list-decimal space-y-1 pl-6 text-sm text-muted-foreground">
                {children}
              </ol>
            ),
            table: ({ children }) => (
              <div className="my-4 overflow-x-auto border-2 border-border">
                <table className="w-full text-sm">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border-b-2 border-border bg-muted px-4 py-2 text-left text-xs font-bold tracking-wider text-foreground uppercase">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border-b border-border px-4 py-2 text-muted-foreground">
                {children}
              </td>
            ),
            blockquote: ({ children }) => (
              <blockquote className="my-4 border-l-4 border-primary pl-4 text-sm text-muted-foreground italic">
                {children}
              </blockquote>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                className="text-primary underline-offset-2 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

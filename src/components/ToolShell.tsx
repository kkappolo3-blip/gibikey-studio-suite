import type { ReactNode } from "react";

interface ToolShellProps {
  number: number;
  title: string;
  description: string;
  children: ReactNode;
}

export function ToolShell({ number, title, description, children }: ToolShellProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 border-b border-border pb-6">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          Tool · {String(number).padStart(2, "0")}
        </div>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

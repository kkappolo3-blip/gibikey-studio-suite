import { createFileRoute } from "@tanstack/react-router";
import { ToolShell } from "@/components/ToolShell";
import { BookOpen, Lightbulb, Compass } from "lucide-react";

export const Route = createFileRoute("/cerdika")({
  component: Cerdika,
  head: () => ({ meta: [{ title: "Cerdika — Gibikey Studio" }] }),
});

const TOPICS = [
  { icon: BookOpen, title: "Sejarah Singkat", desc: "Ringkasan peristiwa penting yang membentuk dunia modern." },
  { icon: Lightbulb, title: "Sains Sehari-hari", desc: "Penjelasan fenomena umum dengan bahasa sederhana." },
  { icon: Compass, title: "Tips Belajar", desc: "Teknik praktis untuk meningkatkan produktivitas belajar." },
];

function Cerdika() {
  return (
    <ToolShell number={7} title="Cerdika" description="Pusat materi belajar singkat, dirangkum dengan rapi.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((t) => (
          <article key={t.title} className="rounded-lg border border-border bg-card p-6">
            <t.icon className="h-6 w-6 text-accent" />
            <h3 className="mt-3 font-serif text-xl font-semibold">{t.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Konten edukasi akan ditambahkan secara berkala.
      </p>
    </ToolShell>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Waves, Image as ImageIcon, GraduationCap, Download, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Gibikey Studio APP — Semua Tools dalam Satu Tempat" },
      { name: "description", content: "PDF, audio ambient, konversi file, downloader, dan generator surat dokter — semua dalam satu app." },
    ],
  }),
});

const tools = [
  { n: 2, title: "iLovePDF", url: "/pdf-tools", icon: FileText, desc: "Gabung & pisah file PDF dengan cepat." },
  { n: 4, title: "A Soft Murmur", url: "/soft-murmur", icon: Waves, desc: "Mixer suara ambient untuk fokus & relaksasi." },
  { n: 6, title: "FileConv", url: "/file-convert", icon: ImageIcon, desc: "Konversi format gambar (PNG, JPG, WebP)." },
  { n: 7, title: "Cerdika", url: "/cerdika", icon: GraduationCap, desc: "Pusat materi belajar singkat & rapi." },
  { n: 12, title: "Muka Downloader", url: "/downloader", icon: Download, desc: "Unduh media dari URL publik." },
  { n: 13, title: "Medical Certificate", url: "/medical-certificate", icon: Stethoscope, desc: "Generator surat keterangan dokter (PDF)." },
];

function Index() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="mb-12 rounded-2xl border border-border bg-[image:var(--gradient-maroon)] p-10 shadow-[var(--shadow-gold)]">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-[oklch(0.78_0.14_80)]">
          Gibikey · Studio App
        </div>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-tight text-[oklch(0.97_0.018_85)]">
          Satu app, banyak tools — dirancang dengan keanggunan.
        </h1>
        <p className="mt-4 max-w-2xl text-[oklch(0.93_0.04_80)]/80">
          Kumpulan utilitas pilihan: PDF, audio, konversi file, downloader, dan dokumen.
          Tanpa login, tanpa repot.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.url}
            to={t.url}
            className="group rounded-xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-[var(--shadow-gold)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-gold)]">
                <t.icon className="h-5 w-5 text-[oklch(0.2_0.03_40)]" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {String(t.n).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-4 font-serif text-xl font-semibold text-foreground group-hover:text-accent">
              {t.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

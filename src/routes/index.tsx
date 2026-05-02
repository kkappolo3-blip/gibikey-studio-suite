import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Waves, Image as ImageIcon, GraduationCap, Download, Stethoscope, ChefHat, Star } from "lucide-react";

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
  { n: 1, title: "PaperForge", url: "/pdf-tools", icon: FileText, desc: "Gabung & pisah file PDF dengan cepat." },
  { n: 2, title: "AuraSound", url: "/soft-murmur", icon: Waves, desc: "Mixer suara ambient untuk fokus & relaksasi." },
  { n: 3, title: "PixelCast", url: "/file-convert", icon: ImageIcon, desc: "Konversi format gambar (PNG, JPG, WebP)." },
  { n: 4, title: "MindWell", url: "/cerdika", icon: GraduationCap, desc: "Pusat materi belajar singkat & rapi." },
  { n: 5, title: "GrabMate", url: "/downloader", icon: Download, desc: "Unduh media dari URL publik." },
  { n: 6, title: "MediScript", url: "/medical-certificate", icon: Stethoscope, desc: "Generator surat keterangan dokter (PDF).", featured: true },
  { n: 7, title: "DapurKu", url: "/dapurku", icon: ChefHat, desc: "Cari resep masakan dari bahan yang ada di dapurmu.", featured: true },
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

      <div className="mb-6 flex items-center gap-3">
        <Star className="h-4 w-4 fill-primary text-primary" />
        <h2 className="font-serif text-sm uppercase tracking-[0.3em] text-muted-foreground">
          Tool Unggulan — Paling Dicari
        </h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Link
            key={t.url}
            to={t.url}
            className={`group relative rounded-xl border p-6 transition hover:border-primary hover:shadow-[var(--shadow-gold)] ${
              t.featured
                ? "border-primary/60 bg-[image:var(--gradient-maroon)] shadow-[var(--shadow-gold)]"
                : "border-border bg-card"
            }`}
          >
            {t.featured && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-[image:var(--gradient-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[oklch(0.2_0.03_40)] shadow-[var(--shadow-gold)]">
                <Star className="h-3 w-3 fill-current" />
                Unggulan
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-gold)]">
                <t.icon className="h-5 w-5 text-[oklch(0.2_0.03_40)]" />
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {String(t.n).padStart(2, "0")}
              </span>
            </div>
            <h3 className={`mt-4 font-serif text-xl font-semibold group-hover:text-accent ${
              t.featured ? "text-[oklch(0.97_0.018_85)]" : "text-foreground"
            }`}>
              {t.title}
            </h3>
            <p className={`mt-1 text-sm ${
              t.featured ? "text-[oklch(0.93_0.04_80)]/80" : "text-muted-foreground"
            }`}>{t.desc}</p>
            {t.featured && (
              <p className="mt-3 text-[10px] font-mono uppercase tracking-widest text-[oklch(0.78_0.14_80)]">
                ★ Banyak dicari pengguna
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  Waves,
  Image as ImageIcon,
  GraduationCap,
  Download,
  Stethoscope,
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About — Gibikey Studio APP" },
      {
        name: "description",
        content:
          "Tentang Gibikey Studio APP: suite enam tools serbaguna tanpa login, berjalan langsung di browser.",
      },
      { property: "og:title", content: "About — Gibikey Studio APP" },
      {
        property: "og:description",
        content:
          "Suite tools: PaperForge, AuraSound, PixelCast, MindWell, GrabMate, MediScript — semua tanpa akun.",
      },
    ],
  }),
});

const TOOLS = [
  {
    n: 1,
    name: "PaperForge",
    url: "/pdf-tools",
    icon: FileText,
    what: "Gabung & pisah file PDF.",
    how: "Pilih beberapa PDF untuk digabung, atau satu PDF + rentang halaman (misal 1-3) untuk dipisah, lalu unduh hasilnya.",
  },
  {
    n: 2,
    name: "AuraSound",
    url: "/soft-murmur",
    icon: Waves,
    what: "Mixer suara ambient (hujan, angin, ombak, api, kafe, burung).",
    how: "Tekan Mulai, lalu geser slider tiap suara untuk meracik suasana yang kamu mau.",
  },
  {
    n: 3,
    name: "PixelCast",
    url: "/file-convert",
    icon: ImageIcon,
    what: "Konversi format gambar antara PNG, JPG, dan WebP.",
    how: "Pilih gambar, tentukan format target & kualitas, lalu klik Konversi.",
  },
  {
    n: 4,
    name: "MindWell",
    url: "/cerdika",
    icon: GraduationCap,
    what: "Pusat materi belajar singkat & rapi.",
    how: "Telusuri kartu topik untuk membaca rangkuman cepat.",
  },
  {
    n: 5,
    name: "GrabMate",
    url: "/downloader",
    icon: Download,
    what: "Unduh media langsung dari URL publik.",
    how: "Tempel URL file (gambar/video/dokumen yang mengizinkan CORS), klik Unduh.",
  },
  {
    n: 6,
    name: "MediScript",
    url: "/medical-certificate",
    icon: Stethoscope,
    what: "Generator template surat keterangan dokter (PDF).",
    how: "Isi formulir pasien & dokter, klik Generate PDF untuk mengunduh draft.",
  },
];

const PRINCIPLES = [
  {
    icon: Lock,
    title: "Tanpa Login",
    desc: "Tidak ada pendaftaran, tidak ada akun. Buka langsung pakai.",
  },
  {
    icon: ShieldCheck,
    title: "Privasi Dulu",
    desc: "Mayoritas pemrosesan terjadi di browser kamu — file tidak dikirim ke server.",
  },
  {
    icon: Zap,
    title: "Cepat & Ringan",
    desc: "Dirancang minimalis dan responsif, jalan mulus di desktop maupun mobile.",
  },
];

function About() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero */}
      <section className="mb-12 rounded-2xl border border-border bg-[image:var(--gradient-maroon)] p-10 shadow-[var(--shadow-gold)]">
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.4em] text-[oklch(0.78_0.14_80)]">
          <Sparkles className="h-3.5 w-3.5" /> About
        </div>
        <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-tight text-[oklch(0.97_0.018_85)]">
          Satu app, enam tools, tanpa repot.
        </h1>
        <p className="mt-4 max-w-2xl text-[oklch(0.93_0.04_80)]/85">
          Gibikey Studio APP adalah suite utilitas yang dirancang dengan estetika klasik dan
          pendekatan no-friction: <strong>tidak perlu daftar, tidak perlu login</strong>.
          Buka, pilih tool, selesai.
        </p>
      </section>

      {/* Principles */}
      <section className="mb-14 grid gap-5 sm:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[image:var(--gradient-gold)]">
              <p.icon className="h-5 w-5 text-[oklch(0.2_0.03_40)]" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-semibold">{p.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </section>

      {/* Tool list */}
      <section className="mb-14">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">Suite Tools</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enam tools yang masing-masing fokus pada satu pekerjaan, dilakukan dengan baik.
        </p>

        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {TOOLS.map((t) => (
            <Link
              key={t.url}
              to={t.url}
              className="flex flex-col gap-4 p-6 transition hover:bg-secondary/50 sm:flex-row sm:items-start"
            >
              <div className="flex shrink-0 items-center gap-4 sm:w-44">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[image:var(--gradient-gold)]">
                  <t.icon className="h-5 w-5 text-[oklch(0.2_0.03_40)]" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Tool {String(t.n).padStart(2, "0")}
                  </div>
                  <div className="font-serif text-lg font-semibold">{t.name}</div>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium text-accent">Apa: </span>
                  {t.what}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Cara pakai: </span>
                  {t.how}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How to use */}
      <section className="mb-14 rounded-xl border border-border bg-card p-8">
        <h2 className="font-serif text-2xl font-semibold tracking-tight">
          Cara Pakai (Tanpa Login)
        </h2>
        <ol className="mt-5 space-y-4 text-sm">
          {[
            "Buka sidebar di kiri (atau ikon menu di header pada layar kecil).",
            "Pilih salah satu dari enam tools sesuai kebutuhan.",
            "Ikuti formulir / tombol di halaman tool — tidak ada pendaftaran apa pun.",
            "Hasil (PDF, gambar, audio) langsung tersedia untuk diunduh atau diputar.",
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-xs text-accent-foreground">
                {i + 1}
              </span>
              <span className="pt-0.5 text-foreground">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border border-border bg-[image:var(--gradient-gold)] p-8 text-center shadow-[var(--shadow-gold)]">
        <h2 className="font-serif text-3xl font-semibold text-[oklch(0.2_0.03_40)]">
          Siap mencoba?
        </h2>
        <p className="mt-2 text-sm text-[oklch(0.25_0.04_40)]/80">
          Pilih tool dan mulai dalam hitungan detik — selalu gratis, selalu tanpa akun.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center rounded-md bg-[oklch(0.22_0.04_40)] px-5 py-2.5 text-sm font-medium text-[oklch(0.97_0.018_85)] transition hover:opacity-90"
        >
          Lihat semua tools
        </Link>
      </section>
    </div>
  );
}

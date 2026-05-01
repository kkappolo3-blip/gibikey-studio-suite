import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Home, Facebook, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import profilKhair from "@/assets/profil-khair.png";

export const Route = createFileRoute("/tentang-kami")({
  head: () => ({
    meta: [
      { title: "Tentang Kami — Gibikey Studio APP" },
      {
        name: "description",
        content:
          "Tentang Gibikey Studio APP — suite tools kreatif tanpa login dari Bripka Mohamad Khair.",
      },
      { property: "og:title", content: "Tentang Kami — Gibikey Studio APP" },
      {
        property: "og:description",
        content:
          "Suite 6 tools kreatif (PDF, audio, gambar, downloader, MediScript & MindWell) dalam satu app, tanpa login.",
      },
    ],
  }),
  component: TentangKamiPage,
});

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function TentangKamiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Nav */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-1 h-4 w-4" /> Kembali ke Beranda
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link to="/">
            <Home className="mr-1 h-4 w-4" /> Halaman Utama
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[image:var(--gradient-gold)] shadow-[var(--shadow-gold)]">
          <Sparkles className="h-7 w-7 text-[oklch(0.2_0.03_40)]" />
        </div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground">
          Tentang Gibikey Studio APP
        </h1>
        <p className="mt-2 text-sm uppercase tracking-[0.3em] text-muted-foreground">
          oleh Gibikey Studio
        </p>
      </header>

      <div className="space-y-10">
        <Section title="Apa itu Gibikey Studio APP?">
          <p>
            Gibikey Studio APP adalah <strong>suite tools kreatif</strong> dalam
            satu web app — kumpulan utilitas harian untuk mengolah PDF,
            relaksasi audio, konversi gambar, belajar, mengunduh media, dan
            menyusun surat keterangan medis. Semua tool berjalan langsung di
            browser, tanpa perlu login dan tanpa upload data ke server.
          </p>
          <p>
            Cukup pilih tool dari sidebar, gunakan, lalu unduh hasilnya.
            Sederhana, cepat, dan privat.
          </p>
        </Section>

        <Section title="Cara Penggunaan">
          <ol className="list-decimal space-y-2 pl-5">
            <li>Buka sidebar di sisi kiri aplikasi.</li>
            <li>
              Pilih salah satu dari 6 tool: <strong>PaperForge</strong>,{" "}
              <strong>AuraSound</strong>, <strong>PixelCast</strong>,{" "}
              <strong>MindWell</strong>, <strong>GrabMate</strong>, atau{" "}
              <strong>MediScript</strong>.
            </li>
            <li>Ikuti instruksi pada masing-masing halaman tool.</li>
            <li>Unduh atau salin hasilnya langsung dari browser.</li>
            <li>
              Selesai — tekan tombol <em>Kembali</em> atau{" "}
              <em>Halaman Utama</em> untuk berpindah tool.
            </li>
          </ol>
        </Section>

        <Section title="Tentang Gibikey Studio">
          <p>
            Gibikey Studio adalah tim kreatif yang berfokus pada pengembangan
            aplikasi digital inovatif. Kami percaya bahwa teknologi harus
            memudahkan kehidupan sehari-hari — termasuk pekerjaan kecil seperti
            mengonversi file, membuat PDF, atau menemukan momen tenang dengan
            audio relaksasi.
          </p>
          <p>
            Gibikey Studio APP dirancang dengan{" "}
            <Heart className="inline h-4 w-4 text-[oklch(0.55_0.18_25)]" /> untuk
            siapa saja yang butuh tools praktis tanpa ribet daftar akun.
          </p>
        </Section>

        <Section title="Pembuat Aplikasi">
          <Card className="overflow-hidden border-border/60 bg-card/60">
            <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start sm:p-7">
              <img
                src={profilKhair}
                alt="Foto Bripka Mohamad Khair"
                className="h-32 w-32 shrink-0 rounded-xl object-cover shadow-[var(--shadow-gold)] ring-2 ring-[image:var(--gradient-gold)]"
                loading="lazy"
              />
              <div className="space-y-2 text-center sm:text-left">
                <p className="font-serif text-lg text-foreground">
                  Bripka Mohamad Khair
                </p>
                <p className="text-sm text-muted-foreground">
                  Aplikasi ini dibuat oleh{" "}
                  <strong>Bripka Mohamad Khair</strong>, seorang anggota Polri
                  yang juga senang berkreasi di dunia digital. Gibikey Studio
                  APP lahir dari kecintaan pada teknologi dan keinginan untuk
                  membuat tools yang bermanfaat untuk masyarakat luas.
                </p>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <Facebook className="h-3.5 w-3.5" />
                  DM via Facebook: Kaka Gibikey Khair
                </a>
                <p className="text-xs text-muted-foreground">
                  Punya saran, masukan, atau ingin sekadar menyapa? Jangan ragu
                  untuk DM ya! 👋
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>

        <Section title="Ucapan Terima Kasih">
          <p>
            Terima kasih telah menggunakan Gibikey Studio APP! Kami harap suite
            tools ini benar-benar membantu pekerjaan harianmu. Saran dan
            masukanmu sangat berarti untuk pengembangan ke depan.
          </p>
        </Section>

        <Section title="Kredensial Logo">
          <p>
            Logo dan identitas visual Gibikey Studio merupakan hak cipta milik{" "}
            <strong>Gibikey Studio</strong>. Logo ini digunakan secara eksklusif
            untuk Gibikey Studio APP dan produk-produk digital lainnya yang
            dikembangkan oleh tim Gibikey Studio.
          </p>
          <p>© 2026 Gibikey Studio. All rights reserved.</p>
        </Section>
      </div>

      <footer className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
        © 2026 Gibikey Studio. Dibuat dengan{" "}
        <Heart className="inline h-3 w-3 text-[oklch(0.55_0.18_25)]" /> di
        Indonesia.
      </footer>
    </div>
  );
}

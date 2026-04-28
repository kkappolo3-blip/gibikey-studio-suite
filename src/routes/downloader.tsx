import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

export const Route = createFileRoute("/downloader")({
  component: Downloader,
  head: () => ({ meta: [{ title: "GrabMate — Gibikey Studio" }] }),
});

function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const grab = async () => {
    if (!/^https?:\/\//.test(url)) return toast.error("URL tidak valid");
    setLoading(true);
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const u = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = u;
      a.download = url.split("/").pop()?.split("?")[0] || "download";
      a.click();
      URL.revokeObjectURL(u);
      toast.success("Selesai diunduh");
    } catch {
      toast.error("Gagal mengambil. Server sumber mungkin memblokir CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell number={5} title="GrabMate" description="Unduh media langsung dari URL publik (mendukung file yang mengizinkan CORS).">
      <div className="space-y-5 rounded-lg border border-border bg-card p-6">
        <div>
          <Label>URL media</Label>
          <Input placeholder="https://contoh.com/gambar.jpg" value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Button onClick={grab} disabled={loading}>{loading ? "Mengambil..." : "Unduh"}</Button>
          <Button variant="outline" asChild>
            <a href={url} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Buka</a>
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Catatan: beberapa situs (Instagram, TikTok, dsb.) memblokir akses langsung dari browser. Gunakan URL langsung file.
        </p>
      </div>
    </ToolShell>
  );
}

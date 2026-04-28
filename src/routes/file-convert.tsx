import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/file-convert")({
  component: FileConvert,
  head: () => ({ meta: [{ title: "FileConv — Gibikey Studio" }] }),
});

const FORMATS = [
  { v: "image/png", ext: "png" },
  { v: "image/jpeg", ext: "jpg" },
  { v: "image/webp", ext: "webp" },
];

function FileConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState("0.92");

  const convert = async () => {
    if (!file) return toast.error("Pilih gambar dulu");
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise((r) => (img.onload = r));
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return toast.error("Gagal konversi");
      const ext = FORMATS.find((f) => f.v === format)!.ext;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Selesai");
    }, format, parseFloat(quality));
  };

  return (
    <ToolShell number={6} title="FileConv" description="Konversi gambar antar format (PNG, JPG, WebP) langsung di browser.">
      <div className="space-y-5 rounded-lg border border-border bg-card p-6">
        <div>
          <Label>Pilih gambar</Label>
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        <div>
          <Label>Format target</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {FORMATS.map((f) => <SelectItem key={f.v} value={f.v}>{f.ext.toUpperCase()}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Kualitas (0.1 – 1.0, untuk JPG/WebP)</Label>
          <Input value={quality} onChange={(e) => setQuality(e.target.value)} />
        </div>
        <Button onClick={convert}>Konversi & Unduh</Button>
      </div>
    </ToolShell>
  );
}

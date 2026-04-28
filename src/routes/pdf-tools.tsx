import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/pdf-tools")({
  component: PdfTools,
  head: () => ({ meta: [{ title: "iLovePDF — Gibikey Studio" }] }),
});

function downloadBlob(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function PdfTools() {
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [range, setRange] = useState("1-1");
  const [loading, setLoading] = useState(false);

  const handleMerge = async () => {
    if (mergeFiles.length < 2) return toast.error("Pilih minimal 2 file PDF");
    setLoading(true);
    try {
      const out = await PDFDocument.create();
      for (const f of mergeFiles) {
        const src = await PDFDocument.load(await f.arrayBuffer());
        const pages = await out.copyPages(src, src.getPageIndices());
        pages.forEach((p) => out.addPage(p));
      }
      downloadBlob(await out.save(), "merged.pdf");
      toast.success("Berhasil digabung");
    } catch (e) {
      toast.error("Gagal menggabung PDF");
    } finally {
      setLoading(false);
    }
  };

  const handleSplit = async () => {
    if (!splitFile) return toast.error("Pilih file PDF");
    const m = range.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!m) return toast.error("Format range: contoh 1-3");
    setLoading(true);
    try {
      const src = await PDFDocument.load(await splitFile.arrayBuffer());
      const total = src.getPageCount();
      const start = Math.max(1, parseInt(m[1])) - 1;
      const end = Math.min(total, parseInt(m[2]));
      if (start >= end) throw new Error("range");
      const out = await PDFDocument.create();
      const idx = Array.from({ length: end - start }, (_, i) => start + i);
      const pages = await out.copyPages(src, idx);
      pages.forEach((p) => out.addPage(p));
      downloadBlob(await out.save(), "split.pdf");
      toast.success("Berhasil dipisah");
    } catch {
      toast.error("Range tidak valid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell number={2} title="iLovePDF" description="Gabungkan beberapa PDF atau ambil sebagian halaman dari PDF.">
      <Tabs defaultValue="merge" className="w-full">
        <TabsList>
          <TabsTrigger value="merge">Gabung PDF</TabsTrigger>
          <TabsTrigger value="split">Pisah PDF</TabsTrigger>
        </TabsList>
        <TabsContent value="merge" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>Pilih file PDF (multi)</Label>
          <Input type="file" accept="application/pdf" multiple onChange={(e) => setMergeFiles(Array.from(e.target.files ?? []))} />
          {mergeFiles.length > 0 && (
            <ul className="text-sm text-muted-foreground">
              {mergeFiles.map((f, i) => <li key={i}>• {f.name}</li>)}
            </ul>
          )}
          <Button onClick={handleMerge} disabled={loading}>{loading ? "Memproses..." : "Gabung & Unduh"}</Button>
        </TabsContent>
        <TabsContent value="split" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>File PDF</Label>
          <Input type="file" accept="application/pdf" onChange={(e) => setSplitFile(e.target.files?.[0] ?? null)} />
          <Label>Rentang halaman (mis. 1-3)</Label>
          <Input value={range} onChange={(e) => setRange(e.target.value)} />
          <Button onClick={handleSplit} disabled={loading}>{loading ? "Memproses..." : "Pisah & Unduh"}</Button>
        </TabsContent>
      </Tabs>
    </ToolShell>
  );
}

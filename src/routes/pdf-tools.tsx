import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import jsPDF from "jspdf";
import * as mammoth from "mammoth";
import * as XLSX from "xlsx";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/pdf-tools")({
  component: PdfTools,
  head: () => ({ meta: [{ title: "PaperForge — Gibikey Studio" }] }),
});

function downloadBytes(bytes: Uint8Array | ArrayBuffer, name: string, mime: string) {
  const blob = new Blob([bytes as BlobPart], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const stripExt = (n: string) => n.replace(/\.[^.]+$/, "");

function PdfTools() {
  const [mergeFiles, setMergeFiles] = useState<File[]>([]);
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [range, setRange] = useState("1-1");
  const [wordFile, setWordFile] = useState<File | null>(null);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [pdfToImgFile, setPdfToImgFile] = useState<File | null>(null);
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
      downloadBytes(await out.save(), "merged.pdf", "application/pdf");
      toast.success("Berhasil digabung");
    } catch {
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
      downloadBytes(await out.save(), "split.pdf", "application/pdf");
      toast.success("Berhasil dipisah");
    } catch {
      toast.error("Range tidak valid");
    } finally {
      setLoading(false);
    }
  };

  const handleWordToPdf = async () => {
    if (!wordFile) return toast.error("Pilih file Word (.docx)");
    setLoading(true);
    try {
      const { value: html } = await mammoth.convertToHtml({
        arrayBuffer: await wordFile.arrayBuffer(),
      });
      const container = document.createElement("div");
      container.style.cssText =
        "width:180mm;padding:10mm;font-family:Arial,sans-serif;font-size:12pt;color:#000;background:#fff;line-height:1.5;";
      container.innerHTML = html;
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      await pdf.html(container, {
        callback: (doc) => {
          doc.save(`${stripExt(wordFile.name)}.pdf`);
          toast.success("Word berhasil diubah ke PDF");
        },
        margin: [15, 15, 15, 15],
        autoPaging: "text",
        width: 180,
        windowWidth: 700,
      });
    } catch (e) {
      console.error(e);
      toast.error("Gagal konversi Word. Pastikan file .docx valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleExcelToPdf = async () => {
    if (!excelFile) return toast.error("Pilih file Excel");
    setLoading(true);
    try {
      const wb = XLSX.read(await excelFile.arrayBuffer(), { type: "array" });
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
      let firstPage = true;
      wb.SheetNames.forEach((name) => {
        const ws = wb.Sheets[name];
        const rows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
        if (!firstPage) pdf.addPage();
        firstPage = false;
        pdf.setFontSize(14);
        pdf.text(name, 10, 12);
        pdf.setFontSize(9);
        const startY = 18;
        const lineH = 5;
        const colW = Math.min(40, (277 - 10) / Math.max(1, rows[0]?.length || 1));
        rows.forEach((row, ri) => {
          const y = startY + ri * lineH;
          if (y > 200) {
            pdf.addPage();
          }
          row.forEach((cell, ci) => {
            const text = String(cell ?? "").slice(0, 30);
            pdf.text(text, 10 + ci * colW, y > 200 ? 15 : y);
          });
        });
      });
      pdf.save(`${stripExt(excelFile.name)}.pdf`);
      toast.success("Excel berhasil diubah ke PDF");
    } catch (e) {
      console.error(e);
      toast.error("Gagal konversi Excel");
    } finally {
      setLoading(false);
    }
  };

  const handleImagesToPdf = async () => {
    if (imageFiles.length === 0) return toast.error("Pilih minimal 1 gambar");
    setLoading(true);
    try {
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      for (let i = 0; i < imageFiles.length; i++) {
        const f = imageFiles[i];
        const dataUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result as string);
          r.onerror = rej;
          r.readAsDataURL(f);
        });
        const img = new Image();
        img.src = dataUrl;
        await new Promise((r) => (img.onload = r));
        const ratio = Math.min((pageW - 20) / img.width, (pageH - 20) / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        const x = (pageW - w) / 2;
        const y = (pageH - h) / 2;
        if (i > 0) pdf.addPage();
        const fmt = f.type.includes("png") ? "PNG" : "JPEG";
        pdf.addImage(dataUrl, fmt, x, y, w, h);
      }
      pdf.save("images.pdf");
      toast.success("Gambar berhasil diubah ke PDF");
    } catch (e) {
      console.error(e);
      toast.error("Gagal konversi gambar");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfToImages = async () => {
    if (!pdfToImgFile) return toast.error("Pilih file PDF");
    setLoading(true);
    try {
      const pdfjs: any = await import("pdfjs-dist");
      // @ts-ignore - worker via Vite ?url
      const workerSrc = (await import("pdfjs-dist/build/pdf.worker.mjs?url")).default;
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

      const data = await pdfToImgFile.arrayBuffer();
      const doc = await pdfjs.getDocument({ data }).promise;
      const baseName = stripExt(pdfToImgFile.name);

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const blob: Blob = await new Promise((res) =>
          canvas.toBlob((b) => res(b!), "image/jpeg", 0.92)
        );
        downloadBlob(blob, `${baseName}-page-${i}.jpg`);
      }
      toast.success(`${doc.numPages} halaman diubah ke JPG`);
    } catch (e) {
      console.error(e);
      toast.error("Gagal konversi PDF ke gambar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolShell
      number={1}
      title="PaperForge"
      description="Konversi dokumen: Word, Excel, JPG ke PDF — dan PDF ke JPG. Gabung & pisah PDF."
    >
      <Tabs defaultValue="word" className="w-full">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="word">Word → PDF</TabsTrigger>
          <TabsTrigger value="excel">Excel → PDF</TabsTrigger>
          <TabsTrigger value="img2pdf">Gambar → PDF</TabsTrigger>
          <TabsTrigger value="pdf2img">PDF → JPG</TabsTrigger>
          <TabsTrigger value="merge">Gabung PDF</TabsTrigger>
          <TabsTrigger value="split">Pisah PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="word" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>File Word (.docx)</Label>
          <Input
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => setWordFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Mendukung .docx (Word modern). File .doc lama harus dikonversi ke .docx terlebih dulu.
          </p>
          <Button onClick={handleWordToPdf} disabled={loading}>
            {loading ? "Memproses..." : "Konversi & Unduh PDF"}
          </Button>
        </TabsContent>

        <TabsContent value="excel" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>File Excel (.xlsx / .xls / .csv)</Label>
          <Input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => setExcelFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Setiap sheet menjadi halaman PDF dengan orientasi landscape.
          </p>
          <Button onClick={handleExcelToPdf} disabled={loading}>
            {loading ? "Memproses..." : "Konversi & Unduh PDF"}
          </Button>
        </TabsContent>

        <TabsContent value="img2pdf" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>Pilih gambar (JPG / PNG, multi)</Label>
          <Input
            type="file"
            accept="image/jpeg,image/png"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files ?? []))}
          />
          {imageFiles.length > 0 && (
            <ul className="text-sm text-muted-foreground">
              {imageFiles.map((f, i) => (
                <li key={i}>• {f.name}</li>
              ))}
            </ul>
          )}
          <Button onClick={handleImagesToPdf} disabled={loading}>
            {loading ? "Memproses..." : "Gabung Gambar → PDF"}
          </Button>
        </TabsContent>

        <TabsContent value="pdf2img" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>File PDF</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfToImgFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            Setiap halaman diunduh sebagai file JPG terpisah (resolusi tinggi).
          </p>
          <Button onClick={handlePdfToImages} disabled={loading}>
            {loading ? "Memproses..." : "Konversi & Unduh JPG"}
          </Button>
        </TabsContent>

        <TabsContent value="merge" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>Pilih file PDF (multi)</Label>
          <Input
            type="file"
            accept="application/pdf"
            multiple
            onChange={(e) => setMergeFiles(Array.from(e.target.files ?? []))}
          />
          {mergeFiles.length > 0 && (
            <ul className="text-sm text-muted-foreground">
              {mergeFiles.map((f, i) => (
                <li key={i}>• {f.name}</li>
              ))}
            </ul>
          )}
          <Button onClick={handleMerge} disabled={loading}>
            {loading ? "Memproses..." : "Gabung & Unduh"}
          </Button>
        </TabsContent>

        <TabsContent value="split" className="mt-6 space-y-4 rounded-lg border border-border bg-card p-6">
          <Label>File PDF</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setSplitFile(e.target.files?.[0] ?? null)}
          />
          <Label>Rentang halaman (mis. 1-3)</Label>
          <Input value={range} onChange={(e) => setRange(e.target.value)} />
          <Button onClick={handleSplit} disabled={loading}>
            {loading ? "Memproses..." : "Pisah & Unduh"}
          </Button>
        </TabsContent>
      </Tabs>
    </ToolShell>
  );
}

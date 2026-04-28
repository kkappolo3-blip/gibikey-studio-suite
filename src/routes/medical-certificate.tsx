import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import jsPDF from "jspdf";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/medical-certificate")({
  component: MedCert,
  head: () => ({ meta: [{ title: "MediScript — Gibikey Studio" }] }),
});

/**
 * Menggambar stempel resmi bundar pada PDF.
 * Lingkaran ganda + teks nama klinik melengkung di atas + bintang & label tengah.
 */
function drawOfficialStamp(doc: jsPDF, cx: number, cy: number, clinicName: string) {
  const outerR = 22;
  const innerR = 17;

  doc.saveGraphicsState();
  // Sedikit miring agar terlihat seperti cap manual
  // jsPDF tidak punya rotate global yang mudah; kita pakai warna & bentuk saja.

  // Warna tinta stempel (biru tua keunguan)
  doc.setDrawColor(40, 50, 130);
  doc.setTextColor(40, 50, 130);
  doc.setLineWidth(0.8);

  // Lingkaran luar & dalam
  doc.circle(cx, cy, outerR, "S");
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, innerR, "S");

  // Teks melengkung di atas (nama klinik)
  const topText = clinicName.toUpperCase();
  const arcRadius = (outerR + innerR) / 2;
  const totalArc = Math.PI * 0.9; // sudut total ~162°
  const startAngle = Math.PI + (Math.PI - totalArc) / 2; // mulai dari kiri-atas
  const chars = topText.split("");
  doc.setFont("times", "bold");
  doc.setFontSize(6.5);
  chars.forEach((ch, i) => {
    const t = chars.length === 1 ? 0.5 : i / (chars.length - 1);
    const angle = startAngle + t * totalArc;
    const x = cx + arcRadius * Math.cos(angle);
    const y = cy + arcRadius * Math.sin(angle);
    // Rotasi huruf: tegak lurus jari-jari
    const deg = (angle * 180) / Math.PI + 90;
    doc.text(ch, x, y, { angle: -deg, align: "center" });
  });

  // Teks melengkung di bawah
  const bottomText = "GIBIKEY STUDIO";
  const bArc = Math.PI * 0.6;
  const bStart = -bArc / 2; // simetris di bawah, bawah = sudut 0..π di koordinat layar (y ke bawah)
  // Karena di jsPDF y bertambah ke bawah, kita pakai sudut antara 0..π untuk setengah bawah
  const bStartAngle = (Math.PI - bArc) / 2; // 0 = kanan, π = kiri (bawah karena y+)
  const bChars = bottomText.split("");
  doc.setFontSize(5.5);
  bChars.forEach((ch, i) => {
    const t = bChars.length === 1 ? 0.5 : i / (bChars.length - 1);
    const angle = bStartAngle + t * bArc;
    const x = cx + arcRadius * Math.cos(angle);
    const y = cy + arcRadius * Math.sin(angle);
    const deg = (angle * 180) / Math.PI - 90;
    doc.text(ch, x, y, { angle: -deg, align: "center" });
  });
  // (mark unused to satisfy linter)
  void bStart;

  // Bintang kecil di kiri & kanan (separator)
  doc.setFontSize(8);
  doc.text("★", cx - arcRadius, cy + 1, { align: "center" });
  doc.text("★", cx + arcRadius, cy + 1, { align: "center" });

  // Teks tengah
  doc.setFont("times", "bold");
  doc.setFontSize(7);
  doc.text("CAP RESMI", cx, cy - 3, { align: "center" });
  doc.setFontSize(9);
  doc.text("✚", cx, cy + 2, { align: "center" });
  doc.setFontSize(6);
  doc.setFont("times", "normal");
  doc.text("KLINIK", cx, cy + 7, { align: "center" });

  // Reset warna
  doc.setDrawColor(0, 0, 0);
  doc.setTextColor(0, 0, 0);
  doc.restoreGraphicsState();
}

function MedCert() {
  const [data, setData] = useState({
    patient: "",
    age: "",
    address: "",
    diagnosis: "Influenza",
    rest: "2",
    startDate: new Date().toISOString().slice(0, 10),
    doctor: "dr. Andi Wijaya",
    clinic: "Klinik Sehat Sentosa",
    license: "STR/123/2024",
    notes: "",
  });

  const set = (k: keyof typeof data, v: string) => setData((p) => ({ ...p, [k]: v }));

  const generate = () => {
    if (!data.patient) return toast.error("Nama pasien wajib diisi");
    const doc = new jsPDF();
    const w = doc.internal.pageSize.getWidth();

    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(data.clinic.toUpperCase(), w / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("Surat Keterangan Sakit", w / 2, 28, { align: "center" });
    doc.line(20, 34, w - 20, 34);

    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("SURAT KETERANGAN DOKTER", w / 2, 46, { align: "center" });
    doc.setFont("times", "normal");
    doc.text(`No: SKD/${Date.now().toString().slice(-6)}/GBK`, w / 2, 52, { align: "center" });

    let y = 66;
    doc.text("Yang bertanda tangan di bawah ini menerangkan bahwa:", 20, y);
    y += 10;
    const rows: [string, string][] = [
      ["Nama", data.patient],
      ["Usia", `${data.age} tahun`],
      ["Alamat", data.address],
      ["Diagnosa", data.diagnosis],
    ];
    rows.forEach(([k, v]) => {
      doc.text(k, 25, y);
      doc.text(`: ${v}`, 60, y);
      y += 7;
    });

    y += 4;
    const end = new Date(data.startDate);
    end.setDate(end.getDate() + parseInt(data.rest || "0") - 1);
    doc.text(
      `Memerlukan istirahat selama ${data.rest} hari, terhitung sejak ${data.startDate} sampai ${end.toISOString().slice(0, 10)}.`,
      20, y, { maxWidth: w - 40 }
    );
    y += 16;
    if (data.notes) {
      doc.text(`Catatan: ${data.notes}`, 20, y, { maxWidth: w - 40 });
      y += 14;
    }
    doc.text("Demikian surat ini dibuat untuk dipergunakan sebagaimana mestinya.", 20, y, { maxWidth: w - 40 });

    y += 24;
    const today = new Date().toISOString().slice(0, 10);
    doc.text(`Tertanda, ${today}`, w - 70, y);
    y += 28;
    doc.setFont("times", "bold");
    doc.text(data.doctor, w - 70, y);
    doc.setFont("times", "normal");
    doc.text(`STR: ${data.license}`, w - 70, y + 6);

    // === Cap / Stempel Resmi Klinik ===
    // Ditempatkan menumpang pada area tanda tangan, sedikit miring
    const stampX = w - 95;
    const stampY = y - 6;
    drawOfficialStamp(doc, stampX, stampY, data.clinic);

    doc.save(`surat-dokter-${data.patient.replace(/\s+/g, "-")}.pdf`);
    toast.success("PDF dibuat dengan cap resmi");
  };

  return (
    <ToolShell number={6} title="MediScript" description="Buat surat keterangan dokter dalam format PDF (untuk keperluan template/draft).">
      <div className="grid gap-5 rounded-lg border border-border bg-card p-6 md:grid-cols-2">
        <Field label="Nama Pasien" value={data.patient} onChange={(v) => set("patient", v)} />
        <Field label="Usia" value={data.age} onChange={(v) => set("age", v)} />
        <div className="md:col-span-2">
          <Label>Alamat</Label>
          <Textarea value={data.address} onChange={(e) => set("address", e.target.value)} />
        </div>
        <Field label="Diagnosa" value={data.diagnosis} onChange={(v) => set("diagnosis", v)} />
        <Field label="Lama Istirahat (hari)" value={data.rest} onChange={(v) => set("rest", v)} />
        <div>
          <Label>Tanggal Mulai</Label>
          <Input type="date" value={data.startDate} onChange={(e) => set("startDate", e.target.value)} />
        </div>
        <Field label="Nama Dokter" value={data.doctor} onChange={(v) => set("doctor", v)} />
        <Field label="Nama Klinik" value={data.clinic} onChange={(v) => set("clinic", v)} />
        <Field label="No. STR" value={data.license} onChange={(v) => set("license", v)} />
        <div className="md:col-span-2">
          <Label>Catatan tambahan</Label>
          <Textarea value={data.notes} onChange={(e) => set("notes", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <Button onClick={generate} className="bg-accent text-accent-foreground hover:opacity-90">
            Generate PDF
          </Button>
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        ⚠️ Disclaimer: alat ini hanya untuk membuat template/draft dokumen. Surat keterangan medis resmi harus diterbitkan oleh tenaga medis yang berwenang.
      </p>
    </ToolShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

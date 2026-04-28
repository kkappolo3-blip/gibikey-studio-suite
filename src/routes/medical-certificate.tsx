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

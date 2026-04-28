import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ToolShell } from "@/components/ToolShell";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, CloudRain, Wind, Waves as WavesIcon, Flame, Coffee, Bird } from "lucide-react";

export const Route = createFileRoute("/soft-murmur")({
  component: SoftMurmur,
  head: () => ({ meta: [{ title: "AuraSound — Gibikey Studio" }] }),
});

type Sound = { id: string; label: string; icon: typeof CloudRain; freq: number; type: OscillatorType; filter: number };

const SOUNDS: Sound[] = [
  { id: "rain", label: "Hujan", icon: CloudRain, freq: 0, type: "sawtooth", filter: 1200 },
  { id: "wind", label: "Angin", icon: Wind, freq: 0, type: "sawtooth", filter: 600 },
  { id: "waves", label: "Ombak", icon: WavesIcon, freq: 0, type: "sawtooth", filter: 400 },
  { id: "fire", label: "Api", icon: Flame, freq: 0, type: "sawtooth", filter: 2200 },
  { id: "cafe", label: "Kafe", icon: Coffee, freq: 0, type: "sawtooth", filter: 1800 },
  { id: "birds", label: "Burung", icon: Bird, freq: 800, type: "sine", filter: 3000 },
];

function SoftMurmur() {
  const [playing, setPlaying] = useState(false);
  const [vols, setVols] = useState<Record<string, number>>(() => Object.fromEntries(SOUNDS.map((s) => [s.id, 0])));
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<Record<string, GainNode>>({});

  useEffect(() => () => { ctxRef.current?.close(); }, []);

  const start = () => {
    if (ctxRef.current) return;
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    ctxRef.current = ctx;
    SOUNDS.forEach((s) => {
      const gain = ctx.createGain();
      gain.gain.value = vols[s.id];
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = s.filter;
      if (s.freq > 0) {
        const osc = ctx.createOscillator();
        osc.type = s.type;
        osc.frequency.value = s.freq;
        osc.connect(filter);
        osc.start();
      } else {
        // pink-ish noise
        const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.loop = true;
        src.connect(filter);
        src.start();
      }
      filter.connect(gain).connect(ctx.destination);
      nodesRef.current[s.id] = gain;
    });
    setPlaying(true);
  };

  const stop = () => {
    ctxRef.current?.close();
    ctxRef.current = null;
    nodesRef.current = {};
    setPlaying(false);
  };

  const setVol = (id: string, v: number) => {
    setVols((p) => ({ ...p, [id]: v }));
    const n = nodesRef.current[id];
    if (n) n.gain.value = v;
  };

  return (
    <ToolShell number={2} title="AuraSound" description="Atur campuran suara ambient untuk fokus, tidur, atau meditasi.">
      <div className="mb-6">
        <Button onClick={playing ? stop : start} size="lg" className="bg-[image:var(--gradient-gold)] text-[oklch(0.2_0.03_40)] hover:opacity-90">
          {playing ? <><Pause className="mr-2 h-4 w-4" />Berhenti</> : <><Play className="mr-2 h-4 w-4" />Mulai</>}
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SOUNDS.map((s) => (
          <div key={s.id} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-3">
              <s.icon className="h-5 w-5 text-accent" />
              <span className="font-serif text-lg">{s.label}</span>
            </div>
            <Slider value={[vols[s.id]]} max={1} step={0.01} onValueChange={(v) => setVol(s.id, v[0])} />
          </div>
        ))}
      </div>
    </ToolShell>
  );
}

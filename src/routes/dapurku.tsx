import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChefHat, Plus, X, Search, Heart, Share2 } from "lucide-react";
import { ToolShell } from "@/components/ToolShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/dapurku")({
  head: () => ({
    meta: [
      { title: "DapurKu — Cari Resep dari Bahan yang Kamu Punya" },
      {
        name: "description",
        content:
          "Ketik bahan yang ada di dapur, DapurKu mencocokkan resep masakan Indonesia yang bisa kamu buat. Tanpa login.",
      },
    ],
  }),
  component: DapurKuPage,
});

type Recipe = {
  id: string;
  name: string;
  category: string;
  time: string;
  ingredients: string[];
  steps: string[];
};

// Bahan-bahan dasar yang dianggap selalu ada
const PANTRY = ["air", "garam", "merica", "minyak goreng"];

const RECIPES: Recipe[] = [
  {
    id: "nasi-goreng",
    name: "Nasi Goreng Sederhana",
    category: "Makanan Utama",
    time: "20 menit",
    ingredients: [
      "nasi",
      "telur",
      "bawang putih",
      "bawang merah",
      "kecap manis",
      "cabai",
    ],
    steps: [
      "Tumis bawang merah & bawang putih hingga harum.",
      "Masukkan telur, orak-arik.",
      "Tambahkan nasi, kecap manis, garam, dan cabai.",
      "Aduk rata hingga matang dan sajikan.",
    ],
  },
  {
    id: "telur-dadar",
    name: "Telur Dadar Spesial",
    category: "Lauk",
    time: "10 menit",
    ingredients: ["telur", "bawang merah", "daun bawang", "cabai"],
    steps: [
      "Kocok telur dengan garam dan merica.",
      "Iris bawang merah, daun bawang, cabai. Campurkan ke telur.",
      "Panaskan minyak, tuang adonan, masak sampai kecokelatan.",
    ],
  },
  {
    id: "mie-goreng",
    name: "Mie Goreng Rumahan",
    category: "Makanan Utama",
    time: "15 menit",
    ingredients: [
      "mie",
      "telur",
      "bawang putih",
      "kecap manis",
      "sawi",
      "saus tiram",
    ],
    steps: [
      "Rebus mie hingga setengah matang, tiriskan.",
      "Tumis bawang putih, masukkan telur orak-arik.",
      "Masukkan sawi dan mie, beri kecap & saus tiram.",
      "Aduk rata hingga matang.",
    ],
  },
  {
    id: "tumis-kangkung",
    name: "Tumis Kangkung",
    category: "Sayur",
    time: "10 menit",
    ingredients: ["kangkung", "bawang putih", "cabai", "saus tiram"],
    steps: [
      "Tumis bawang putih dan cabai hingga harum.",
      "Masukkan kangkung, beri saus tiram dan sedikit air.",
      "Aduk cepat hingga kangkung layu, sajikan.",
    ],
  },
  {
    id: "sup-ayam",
    name: "Sup Ayam Bening",
    category: "Sup",
    time: "40 menit",
    ingredients: [
      "ayam",
      "wortel",
      "kentang",
      "bawang putih",
      "daun bawang",
      "seledri",
    ],
    steps: [
      "Rebus ayam hingga empuk, buang busa.",
      "Masukkan wortel & kentang, masak hingga lunak.",
      "Tambahkan bawang putih geprek, daun bawang, seledri.",
      "Beri garam & merica, sajikan hangat.",
    ],
  },
  {
    id: "ayam-kecap",
    name: "Ayam Kecap",
    category: "Lauk",
    time: "30 menit",
    ingredients: [
      "ayam",
      "kecap manis",
      "bawang putih",
      "bawang merah",
      "cabai",
      "tomat",
    ],
    steps: [
      "Goreng ayam setengah matang, sisihkan.",
      "Tumis bumbu iris hingga harum.",
      "Masukkan ayam, kecap, sedikit air, masak hingga meresap.",
    ],
  },
  {
    id: "tempe-orek",
    name: "Tempe Orek Manis",
    category: "Lauk",
    time: "15 menit",
    ingredients: [
      "tempe",
      "kecap manis",
      "bawang merah",
      "bawang putih",
      "cabai",
    ],
    steps: [
      "Potong dadu tempe, goreng hingga kecokelatan.",
      "Tumis bumbu iris, masukkan tempe.",
      "Beri kecap manis, aduk rata.",
    ],
  },
  {
    id: "perkedel",
    name: "Perkedel Kentang",
    category: "Lauk",
    time: "30 menit",
    ingredients: [
      "kentang",
      "telur",
      "bawang putih",
      "bawang merah",
      "daun bawang",
    ],
    steps: [
      "Goreng kentang, haluskan.",
      "Campur dengan bumbu halus, daun bawang, garam, merica.",
      "Bentuk bulat pipih, celup ke telur, goreng hingga keemasan.",
    ],
  },
  {
    id: "capcay",
    name: "Capcay Kuah",
    category: "Sayur",
    time: "20 menit",
    ingredients: [
      "wortel",
      "sawi",
      "kol",
      "bawang putih",
      "saus tiram",
      "ayam",
    ],
    steps: [
      "Tumis bawang putih, masukkan ayam.",
      "Tambahkan sayuran, beri air & saus tiram.",
      "Masak sampai sayur matang tapi masih renyah.",
    ],
  },
  {
    id: "sambal-tomat",
    name: "Sambal Tomat",
    category: "Sambal",
    time: "10 menit",
    ingredients: ["cabai", "tomat", "bawang merah", "bawang putih", "terasi"],
    steps: [
      "Goreng semua bahan sebentar.",
      "Ulek kasar, beri garam dan sedikit gula.",
    ],
  },
  {
    id: "bakwan",
    name: "Bakwan Sayur",
    category: "Camilan",
    time: "20 menit",
    ingredients: [
      "tepung terigu",
      "wortel",
      "kol",
      "daun bawang",
      "bawang putih",
      "telur",
    ],
    steps: [
      "Iris halus sayur, campur dengan tepung, telur, bumbu, dan air.",
      "Goreng per sendok hingga kecokelatan.",
    ],
  },
  {
    id: "pisang-goreng",
    name: "Pisang Goreng",
    category: "Camilan",
    time: "15 menit",
    ingredients: ["pisang", "tepung terigu", "gula", "telur"],
    steps: [
      "Buat adonan tepung + telur + gula + sedikit air.",
      "Celup pisang ke adonan, goreng hingga kuning keemasan.",
    ],
  },
  {
    id: "telur-balado",
    name: "Telur Balado",
    category: "Lauk",
    time: "20 menit",
    ingredients: ["telur", "cabai", "bawang merah", "bawang putih", "tomat"],
    steps: [
      "Rebus telur, kupas, goreng sebentar.",
      "Haluskan cabai, bawang, tomat. Tumis hingga matang.",
      "Masukkan telur, aduk hingga bumbu meresap.",
    ],
  },
  {
    id: "soto-ayam",
    name: "Soto Ayam Sederhana",
    category: "Sup",
    time: "45 menit",
    ingredients: [
      "ayam",
      "bawang putih",
      "bawang merah",
      "kunyit",
      "jahe",
      "daun jeruk",
      "daun bawang",
      "kol",
    ],
    steps: [
      "Rebus ayam, suwir.",
      "Tumis bumbu halus + daun jeruk, masukkan ke kuah.",
      "Sajikan dengan ayam suwir, kol, daun bawang.",
    ],
  },
];

// Normalisasi: lowercase + trim
const norm = (s: string) => s.toLowerCase().trim();

function matchRecipe(recipe: Recipe, owned: Set<string>) {
  const need = recipe.ingredients.filter((i) => !PANTRY.includes(norm(i)));
  const have = need.filter((i) => owned.has(norm(i)));
  const missing = need.filter((i) => !owned.has(norm(i)));
  const score = need.length === 0 ? 0 : have.length / need.length;
  return { score, have, missing, need };
}

const SUGGESTIONS = [
  "telur",
  "ayam",
  "nasi",
  "mie",
  "bawang putih",
  "bawang merah",
  "cabai",
  "kecap manis",
  "wortel",
  "kentang",
  "tempe",
  "tomat",
  "sawi",
  "kangkung",
  "tepung terigu",
  "pisang",
];

function DapurKuPage() {
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searched, setSearched] = useState(false);

  const addIngredient = (raw?: string) => {
    const value = norm(raw ?? input);
    if (!value) return;
    if (ingredients.includes(value)) {
      toast.info(`"${value}" sudah ada di daftar.`);
      return;
    }
    setIngredients((prev) => [...prev, value]);
    setInput("");
  };

  const removeIngredient = (item: string) => {
    setIngredients((prev) => prev.filter((i) => i !== item));
  };

  const owned = useMemo(() => new Set(ingredients.map(norm)), [ingredients]);

  const results = useMemo(() => {
    if (!searched || ingredients.length === 0) return [];
    return RECIPES.map((r) => ({ recipe: r, ...matchRecipe(r, owned) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [searched, ingredients, owned]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const shareToWhatsApp = (recipe: Recipe) => {
    const text =
      `🍳 *${recipe.name}* (${recipe.time})\n\n` +
      `*Bahan:*\n${recipe.ingredients.map((i) => `• ${i}`).join("\n")}\n\n` +
      `*Cara membuat:*\n${recipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n` +
      `— dari DapurKu by Gibikey Studio`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <ToolShell
      number={7}
      title="DapurKu"
      description="Ketik bahan yang ada di dapurmu, lalu temukan resep masakan Indonesia yang bisa kamu buat sekarang."
    >
      {/* Input bahan */}
      <Card className="mb-6 border-border/60">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-serif text-xl">
            <ChefHat className="h-5 w-5 text-accent" />
            Bahan yang kamu punya
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addIngredient();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="contoh: telur, bawang putih, ayam..."
              className="flex-1"
            />
            <Button type="submit" variant="default">
              <Plus className="mr-1 h-4 w-4" /> Tambah
            </Button>
          </form>

          {/* Saran cepat */}
          <div>
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Saran cepat
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTIONS.filter((s) => !ingredients.includes(s)).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => addIngredient(s)}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition hover:border-accent hover:text-accent"
                >
                  + {s}
                </button>
              ))}
            </div>
          </div>

          {/* Daftar bahan terpilih */}
          {ingredients.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                Bahanmu ({ingredients.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ingredients.map((i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="gap-1 px-2 py-1 text-sm"
                  >
                    {i}
                    <button
                      type="button"
                      onClick={() => removeIngredient(i)}
                      className="ml-1 rounded-full hover:bg-background/50"
                      aria-label={`hapus ${i}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={() => {
              if (ingredients.length === 0) {
                toast.error("Tambahkan minimal satu bahan dulu ya.");
                return;
              }
              setSearched(true);
            }}
            size="lg"
            className="w-full"
          >
            <Search className="mr-2 h-4 w-4" />
            Cari resep yang bisa dibuat
          </Button>
          <p className="text-xs text-muted-foreground">
            Catatan: garam, merica, air, dan minyak goreng dianggap selalu ada.
          </p>
        </CardContent>
      </Card>

      {/* Hasil */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl text-foreground">
              {results.length > 0
                ? `${results.length} resep ditemukan`
                : "Belum ada resep yang cocok"}
            </h2>
          </div>

          {results.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-sm text-muted-foreground">
                Coba tambahkan bahan umum seperti{" "}
                <em>telur, bawang putih, atau nasi</em> untuk hasil lebih
                banyak.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {results.map(({ recipe, score, have, missing }) => {
                const pct = Math.round(score * 100);
                const isFav = favorites.has(recipe.id);
                return (
                  <Card
                    key={recipe.id}
                    className="flex flex-col border-border/60"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {recipe.category} · {recipe.time}
                          </Badge>
                          <CardTitle className="font-serif text-lg">
                            {recipe.name}
                          </CardTitle>
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-2xl font-semibold text-accent">
                            {pct}%
                          </div>
                          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                            cocok
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col space-y-3">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">
                          Kamu punya ({have.length})
                        </p>
                        <p className="text-sm text-foreground">
                          {have.join(", ") || "—"}
                        </p>
                      </div>
                      {missing.length > 0 && (
                        <div>
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Masih kurang ({missing.length})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {missing.join(", ")}
                          </p>
                        </div>
                      )}
                      <details className="rounded-md border border-border/60 bg-background/40 p-3">
                        <summary className="cursor-pointer text-sm font-medium text-foreground">
                          Lihat cara membuat
                        </summary>
                        <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-muted-foreground">
                          {recipe.steps.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ol>
                      </details>
                      <div className="mt-auto flex gap-2 pt-2">
                        <Button
                          variant={isFav ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleFavorite(recipe.id)}
                          className="flex-1"
                        >
                          <Heart
                            className={`mr-1 h-4 w-4 ${isFav ? "fill-current" : ""}`}
                          />
                          {isFav ? "Tersimpan" : "Simpan"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => shareToWhatsApp(recipe)}
                          className="flex-1"
                        >
                          <Share2 className="mr-1 h-4 w-4" /> WhatsApp
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </ToolShell>
  );
}

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  published_at: string | null;
  author_name: string | null;
}

const CATEGORIES: { key: string; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "actualite", label: "Actualités" },
  { key: "observation", label: "Observations" },
  { key: "science", label: "Science" },
  { key: "evenement", label: "Événements" },
];

export default function JournalList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    document.title = "Journal | AIA — Association Ivoirienne d'Astronomie";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Actualités, récits d'observation et articles scientifiques de l'Association Ivoirienne d'Astronomie.");

    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("articles")
        .select("id, slug, title, excerpt, cover_image, category, published_at, author_name")
        .eq("published", true)
        .order("published_at", { ascending: false });
      setArticles(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = category === "all" ? articles : articles.filter((a) => a.category === category);

  return (
    <main className="dark min-h-screen star-field text-foreground">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cosmic-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
        </Link>

        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cosmic-purple/20 border border-cosmic-purple/30 mb-6">
            <BookOpen className="w-4 h-4 text-cosmic-gold" />
            <span className="text-xs uppercase tracking-widest text-cosmic-gold">Journal AIA</span>
          </div>
          <h1 className="font-space font-bold text-4xl md:text-6xl mb-4 bg-gradient-to-r from-white via-cosmic-gold to-cosmic-cyan bg-clip-text text-transparent">
            Nos récits du cosmos
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Actualités, comptes-rendus d'observation et regards scientifiques signés par les membres de l'AIA.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                category === c.key
                  ? "bg-gradient-to-r from-cosmic-purple to-cosmic-blue text-white shadow-lg shadow-cosmic-purple/30"
                  : "bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:border-cosmic-gold/40"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-96 bg-white/5" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Aucun article {category !== "all" ? "dans cette catégorie" : ""} pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((a) => (
              <Link key={a.id} to={`/journal/${a.slug}`} className="group">
                <Card className="h-full overflow-hidden bg-white/5 border-white/10 backdrop-blur-md hover:border-cosmic-gold/50 hover:shadow-2xl hover:shadow-cosmic-purple/20 transition-all duration-500 hover:-translate-y-1">
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-cosmic-purple/30 to-cosmic-blue/30">
                    {a.cover_image ? (
                      <img
                        src={a.cover_image}
                        alt={a.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/20" />
                      </div>
                    )}
                    <Badge className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border-cosmic-gold/40 text-cosmic-gold capitalize">
                      {a.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="w-3 h-3" />
                      {a.published_at && format(new Date(a.published_at), "d MMMM yyyy", { locale: fr })}
                    </div>
                    <h2 className="font-space font-bold text-xl leading-tight group-hover:text-cosmic-gold transition-colors">
                      {a.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                    <div className="flex items-center gap-1 text-sm text-cosmic-gold pt-2 group-hover:gap-2 transition-all">
                      Lire l'article <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
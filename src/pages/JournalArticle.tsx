import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User, Share2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { renderMarkdown } from "@/lib/markdown";
import { useToast } from "@/hooks/use-toast";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  published_at: string | null;
  author_name: string | null;
}

export default function JournalArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (!data) {
        setNotFound(true);
      } else {
        setArticle(data);
      }
      setLoading(false);
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: article?.title, text: article?.excerpt, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Lien copié dans le presse-papiers" });
    }
  };

  if (loading) {
    return (
      <main className="dark min-h-screen star-field p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32 bg-white/5" />
          <Skeleton className="h-64 w-full bg-white/5" />
          <Skeleton className="h-12 w-3/4 bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
          <Skeleton className="h-4 w-full bg-white/5" />
        </div>
      </main>
    );
  }

  if (notFound || !article) {
    return (
      <main className="dark min-h-screen star-field flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="font-space text-3xl font-bold">Article introuvable</h1>
          <p className="text-muted-foreground">Ce billet n'existe pas ou a été retiré.</p>
          <Button onClick={() => navigate("/journal")}>Retour au journal</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="dark min-h-screen star-field text-foreground">
      <Helmet>
        <title>{`${article.title} | Journal AIA`}</title>
        <meta name="description" content={article.excerpt} />
        <link rel="canonical" href={`https://astroivoire.lovable.app/journal/${article.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:url" content={`https://astroivoire.lovable.app/journal/${article.slug}`} />
        {article.cover_image && <meta property="og:image" content={article.cover_image} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: article.cover_image || undefined,
          datePublished: article.published_at,
          author: article.author_name ? { "@type": "Person", name: article.author_name } : undefined,
          publisher: { "@type": "Organization", name: "Association Ivoirienne d'Astronomie" },
          mainEntityOfPage: `https://astroivoire.lovable.app/journal/${article.slug}`,
        })}</script>
      </Helmet>
      <article className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
        <Link
          to="/journal"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cosmic-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Tous les articles
        </Link>

        <Badge className="bg-cosmic-purple/20 border-cosmic-purple/40 text-cosmic-gold capitalize mb-4">
          {article.category}
        </Badge>

        <h1 className="font-space font-bold text-4xl md:text-5xl leading-tight mb-6 bg-gradient-to-r from-white to-cosmic-gold bg-clip-text text-transparent">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-8 border-b border-white/10">
          {article.published_at && (
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {format(new Date(article.published_at), "d MMMM yyyy", { locale: fr })}
            </div>
          )}
          {article.author_name && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {article.author_name}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={share}
            className="ml-auto text-cosmic-gold hover:text-cosmic-cyan"
          >
            <Share2 className="w-4 h-4 mr-2" /> Partager
          </Button>
        </div>

        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-2xl mb-10 shadow-2xl shadow-cosmic-purple/20"
          />
        )}

        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 italic border-l-2 border-cosmic-gold pl-6">
          {article.excerpt}
        </p>

        <div
          className="prose prose-invert max-w-none text-foreground leading-relaxed [&>p]:my-4 [&>p]:text-base [&_a]:text-cosmic-gold"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-cosmic-gold hover:text-cosmic-cyan transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour au journal
          </Link>
        </div>
      </article>
    </main>
  );
}
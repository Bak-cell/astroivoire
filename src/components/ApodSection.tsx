import { useEffect, useState } from "react";
import { Loader2, ExternalLink, Sparkles } from "lucide-react";

interface Apod {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: string;
  date: string;
  copyright?: string;
}

const ApodSection = () => {
  const [data, setData] = useState<Apod | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="apod" className="relative py-20 star-field overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cosmic-gold text-sm font-medium mb-4">
            <Sparkles size={14} />
            NASA · Astronomy Picture of the Day
          </div>
          <h2 className="font-space text-3xl md:text-5xl font-bold text-white mb-3">
            L'image du cosmos, aujourd'hui
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Chaque jour, la NASA partage une image ou vidéo de notre univers accompagnée d'une explication d'astronome.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-cosmic-gold" size={40} />
          </div>
        )}

        {error && (
          <div className="text-center text-white/60 py-10">
            Impossible de charger l'image du jour pour le moment.
          </div>
        )}

        {data && (
          <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3 relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {data.media_type === "image" ? (
                <img
                  src={data.url}
                  alt={data.title}
                  loading="lazy"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="aspect-video">
                  <iframe
                    src={data.url}
                    title={data.title}
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              )}
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs text-white/90 border border-white/10">
                {new Date(data.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
            <div className="md:col-span-2 text-white space-y-4">
              <h3 className="font-space text-2xl md:text-3xl font-bold leading-tight">{data.title}</h3>
              <p className="text-white/70 leading-relaxed text-sm md:text-base line-clamp-[12]">
                {data.explanation}
              </p>
              {data.copyright && (
                <p className="text-xs text-white/50">© {data.copyright.trim()}</p>
              )}
              {data.hdurl && (
                <a
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-cosmic-gold hover:text-white transition-colors text-sm font-medium"
                >
                  Voir en haute définition <ExternalLink size={14} />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ApodSection;
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";

type Category = "Tous" | "Équipe" | "Observation" | "Ateliers";

interface Photo {
  src: string;
  alt: string;
  title: string;
  category: Exclude<Category, "Tous">;
  location?: string;
}

const photos: Photo[] = [
  {
    src: "/lovable-uploads/1d1b52f8-43e9-4cb8-ac82-9a55c85580fb.png",
    alt: "Équipe AIA ASTROTOUR complète",
    title: "Grande équipe ASTROTOUR",
    category: "Équipe",
    location: "Abidjan",
  },
  {
    src: "/lovable-uploads/8bfddae1-f69b-4622-9678-10e15e28f463.png",
    alt: "Équipe AIA ASTROTOUR",
    title: "Édition Ivoire",
    category: "Équipe",
  },
  {
    src: "/lovable-uploads/7db4ae90-b794-4a58-9c4b-77782a671db1.png",
    alt: "Observation astronomique avec télescopes",
    title: "Séance d'observation nocturne",
    category: "Observation",
  },
  {
    src: "/lovable-uploads/a8fc95ab-9011-4812-8661-8d96471e08db.png",
    alt: "Activité éducative spatiale",
    title: "Atelier pédagogique spatial",
    category: "Ateliers",
  },
  {
    src: "/lovable-uploads/50a27443-7d7d-4bde-b527-11b150ae6f7a.png",
    alt: "Séance éducative avec matériel astronomique",
    title: "Formation scolaire",
    category: "Ateliers",
  },
  {
    src: "/lovable-uploads/e07a11ec-743f-4c6b-86f7-35ca3075d2fd.png",
    alt: "Groupe d'étudiants avec télescopes",
    title: "Initiation en milieu scolaire",
    category: "Ateliers",
  },
];

const CATEGORIES: Category[] = ["Tous", "Équipe", "Observation", "Ateliers"];

const GalleryImage = ({ photo, onClick, index }: { photo: Photo; onClick: () => void; index: number }) => {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <button
      onClick={onClick}
      className="group relative block w-full overflow-hidden rounded-2xl glass-card mb-6 break-inside-avoid text-left"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          ref={ref}
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full h-auto object-cover transition-transform duration-[900ms] group-hover:scale-105 blur-up ${loaded ? "loaded" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90" />
        <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] uppercase tracking-[0.2em] text-cosmic-gold font-medium">
              {photo.category}
            </span>
            {photo.location && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">{photo.location}</span>
              </>
            )}
          </div>
          <p className="text-white font-space font-semibold text-lg leading-tight">{photo.title}</p>
        </div>
      </div>
    </button>
  );
};

const PhotoGallery = () => {
  const [filter, setFilter] = useState<Category>("Tous");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = useMemo(
    () => (filter === "Tous" ? photos : photos.filter((p) => p.category === filter)),
    [filter]
  );

  const close = useCallback(() => setSelected(null), []);
  const next = useCallback(
    () => setSelected((s) => (s === null ? s : (s + 1) % filtered.length)),
    [filtered.length]
  );
  const prev = useCallback(
    () => setSelected((s) => (s === null ? s : (s - 1 + filtered.length) % filtered.length)),
    [filtered.length]
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close, next, prev]);

  return (
    <section id="gallery" className="relative py-24 bg-[#05060F] film-grain overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: "radial-gradient(1px 1px at 10% 20%, #fff, transparent), radial-gradient(1px 1px at 80% 60%, rgba(255,215,120,0.6), transparent), radial-gradient(2px 2px at 40% 90%, #fff, transparent)",
        backgroundSize: "400px 400px, 350px 350px, 500px 500px",
      }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-cosmic-gold text-sm font-medium mb-4">
            <Camera size={14} />
            Archives visuelles
          </div>
          <h2 className="font-space text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Sous les étoiles ivoiriennes
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-cosmic-gold to-transparent mx-auto mb-6" />
          <p className="text-white/60 max-w-2xl mx-auto text-lg">
            Observations, ateliers et rencontres — les moments qui font vivre l'astronomie en Côte d'Ivoire.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((c) => {
            const active = filter === c;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  active
                    ? "bg-cosmic-gold text-cosmic-navy border-cosmic-gold"
                    : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Masonry */}
        <div className="max-w-7xl mx-auto columns-1 sm:columns-2 lg:columns-3 gap-6">
          {filtered.map((photo, index) => (
            <GalleryImage
              key={photo.src}
              photo={photo}
              index={index}
              onClick={() => setSelected(index)}
            />
          ))}
        </div>

        {/* Lightbox */}
        {selected !== null && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={close}
          >
            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={filtered[selected].src}
                alt={filtered[selected].alt}
                className="w-full max-h-[85vh] object-contain rounded-lg"
              />
              <div className="absolute -top-2 -translate-y-full left-0 right-0 flex items-end justify-between text-white pb-3">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cosmic-gold">
                    {filtered[selected].category}
                  </span>
                  <p className="font-space text-xl font-semibold mt-1">{filtered[selected].title}</p>
                </div>
                <p className="text-white/50 text-sm font-mono">
                  {String(selected + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                </p>
              </div>

              <button
                onClick={close}
                aria-label="Fermer"
                className="absolute -top-2 right-0 -translate-y-full h-10 w-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              >
                <X size={18} />
              </button>
              <button
                onClick={prev}
                aria-label="Précédent"
                className="absolute left-2 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-cosmic-gold hover:text-cosmic-navy text-white border border-white/20 transition"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={next}
                aria-label="Suivant"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center rounded-full bg-black/50 hover:bg-cosmic-gold hover:text-cosmic-navy text-white border border-white/20 transition"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;

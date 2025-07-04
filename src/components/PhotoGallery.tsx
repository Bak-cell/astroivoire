import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const PhotoGallery = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const photos = [
    {
      src: "/lovable-uploads/1d1b52f8-43e9-4cb8-ac82-9a55c85580fb.png",
      alt: "Équipe AIA ASTROTOUR complète",
      title: "Grande équipe ASTROTOUR - Découvrez l'Astronomie"
    },
    {
      src: "/lovable-uploads/8bfddae1-f69b-4622-9678-10e15e28f463.png",
      alt: "Équipe AIA ASTROTOUR",
      title: "Équipe ASTROTOUR édition Ivoire"
    },
    {
      src: "/lovable-uploads/7db4ae90-b794-4a58-9c4b-77782a671db1.png",
      alt: "Observation astronomique avec télescopes",
      title: "Séance d'observation nocturne"
    },
    {
      src: "/lovable-uploads/a8fc95ab-9011-4812-8661-8d96471e08db.png",
      alt: "Activité éducative spatiale",
      title: "Atelier pédagogique spatial"
    },
    {
      src: "/lovable-uploads/50a27443-7d7d-4bde-b527-11b150ae6f7a.png",
      alt: "Séance éducative avec matériel astronomique",
      title: "Formation scolaire en astronomie"
    },
    {
      src: "/lovable-uploads/e07a11ec-743f-4c6b-86f7-35ca3075d2fd.png",
      alt: "Groupe d'étudiants avec télescopes",
      title: "Initiation astronomique en milieu scolaire"
    }
  ];

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? photos.length - 1 : selectedImage - 1);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-space text-4xl font-bold text-cosmic-purple mb-4">
            Galerie photos
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cosmic-purple to-cosmic-gold mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos observations, événements et moments partagés sous les étoiles
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {photos.map((photo, index) => (
            <Card 
              key={index}
              className={`group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-500 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${200 + index * 100}ms`
              }}
              onClick={() => setSelectedImage(index)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <p className="text-white font-semibold text-lg">{photo.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <img 
                src={photos[selectedImage].src} 
                alt={photos[selectedImage].alt}
                className="max-w-full max-h-full object-contain"
              />
              <Button
                size="icon"
                variant="outline"
                className="absolute top-4 right-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={() => setSelectedImage(null)}
              >
                <X size={20} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={prevImage}
              >
                <ChevronLeft size={20} />
              </Button>
              <Button
                size="icon"
                variant="outline"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
                onClick={nextImage}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PhotoGallery;

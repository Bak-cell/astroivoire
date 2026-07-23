import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Globe, Moon, GraduationCap, School } from "lucide-react";
import astrotourImage from "@/assets/astrotour-activity.jpg";
import observationImage from "@/assets/observation-activity.jpg";
import astropauseImage from "@/assets/astropause-activity.jpg";
import schoolWorkshopImage from "@/assets/school-workshop-activity.jpg";

const ActivitiesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  const activities = [
    {
      icon: Globe,
      title: "AstroTour Côte d'Ivoire",
      description: "Tournée scientifique dans les villes du pays pour sensibiliser le grand public, les jeunes et les élèves à l'astronomie.",
      color: "from-blue-500 to-purple-600",
      image: astrotourImage
    },
    {
      icon: Moon,
      title: "Soirées d'observation",
      description: "Événements publics pour observer la Lune, les étoiles et les planètes avec des télescopes accessibles à tous.",
      color: "from-purple-500 to-pink-600",
      image: observationImage
    },
    {
      icon: GraduationCap,
      title: "AstroPause",
      description: "Conférences à l'université pour débattre des enjeux du spatial ivoirien et africain.",
      color: "from-indigo-500 to-blue-600",
      image: astropauseImage
    },
    {
      icon: School,
      title: "Ateliers scolaires",
      description: "Séances éducatives dans les écoles pour initier les plus jeunes à l'astronomie.",
      color: "from-green-500 to-teal-600",
      image: schoolWorkshopImage
    }
  ];

  return (
    <section id="activities" className="py-20 bg-background" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-space text-4xl font-bold text-cosmic-purple mb-4">
            Nos activités principales
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cosmic-purple to-cosmic-gold mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez nos programmes conçus pour démocratiser l'astronomie et inspirer les générations futures
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {activities.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${200 + index * 150}ms`
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className={`absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-r ${activity.color} flex items-center justify-center text-white shadow-lg`}>
                    <Icon size={24} />
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-space text-cosmic-purple group-hover:text-cosmic-blue transition-colors duration-300">
                    {activity.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {activity.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;

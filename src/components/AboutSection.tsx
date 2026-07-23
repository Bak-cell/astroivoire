import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Users, Telescope, Heart } from "lucide-react";
import vulgariserImage from "@/assets/vulgariser-mission.jpg";
import sensibiliserImage from "@/assets/sensibiliser-mission.jpg";
import organiserImage from "@/assets/organiser-mission.jpg";
import inclusionImage from "@/assets/inclusion-mission.jpg";

const AboutSection = () => {
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

  const missions = [
    {
      icon: Sparkles,
      title: "Vulgariser les sciences de l'univers",
      description: "Rendre l'astronomie accessible à tous les publics",
      image: vulgariserImage,
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Users,
      title: "Sensibiliser les jeunes",
      description: "Inspirer les futures générations aux carrières spatiales",
      image: sensibiliserImage,
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: Telescope,
      title: "Organiser des observations",
      description: "Conférences et séances d'observation astronomique",
      image: organiserImage,
      color: "from-indigo-500 to-blue-600"
    },
    {
      icon: Heart,
      title: "Favoriser l'inclusion",
      description: "Promouvoir la parité dans les domaines scientifiques",
      image: inclusionImage,
      color: "from-green-500 to-teal-600"
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-space text-4xl font-bold text-cosmic-purple mb-4">
            À propos de l'AIA
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cosmic-purple to-cosmic-gold mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`bg-card rounded-2xl p-8 shadow-lg mb-12 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Fondée en <span className="font-semibold text-cosmic-purple">2021 à Abidjan</span>, l'Association Ivoirienne d'Astronomie (AIA) est une organisation scientifique et éducative dont la mission est de démocratiser l'astronomie en Côte d'Ivoire.
            </p>
            <p className="text-lg text-foreground leading-relaxed">
              Nous réunissons <span className="font-semibold text-cosmic-purple">étudiants, enseignants, passionnés et chercheurs</span> pour construire ensemble un avenir où les sciences spatiales occupent une place centrale dans l'éducation ivoirienne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <Card
                  key={index}
                  className={`group hover:shadow-xl transition-all duration-500 border-0 shadow-md hover:scale-105 overflow-hidden ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${400 + index * 100}ms`
                  }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={mission.image}
                      alt={mission.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className={`absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-r ${mission.color} flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-xl text-cosmic-purple mb-3 group-hover:text-cosmic-blue transition-colors duration-300">
                      {mission.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {mission.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

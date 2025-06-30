
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";

const JoinSection = () => {
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

  return (
    <section id="join" className="py-20 cosmic-bg star-field text-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-space text-4xl font-bold mb-4">
            Devenir membre ou bénévole
          </h2>
          <div className="w-24 h-1 bg-cosmic-gold mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className={`bg-white/10 backdrop-blur-md border-white/20 shadow-2xl transition-all duration-1000 delay-300 hover:scale-105 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-6 animate-float">🚀</div>
              
              <h3 className="font-space text-2xl font-bold mb-6">
                Rejoignez l'AIA !
              </h3>
              
              <div className="space-y-4 mb-8 text-lg">
                <p className="transition-all duration-500 hover:text-cosmic-gold">
                  Vous êtes passionné d'astronomie ou curieux de découvrir l'univers ?
                </p>
                <p className="transition-all duration-500 hover:text-cosmic-gold">
                  Vous êtes enseignant, étudiant ou simplement motivé ?
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-6 mb-8 transition-all duration-500 hover:bg-white/20">
                <p className="text-lg leading-relaxed">
                  En devenant membre ou bénévole, vous contribuez activement à l'éducation scientifique, 
                  au développement de l'astronomie et à l'éveil des générations futures.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-purple font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Je m'engage comme membre
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-cosmic-purple px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Devenir bénévole
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
      {/* Background image astronomique */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`
        }}
      />
      
      {/* Dark overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Gradient overlay pour plus de profondeur */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

      {/* Animated stars supplémentaires */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-cosmic-gold rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cosmic-gold rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          
          <h1 className={`font-space text-4xl md:text-6xl font-bold mb-6 leading-tight transition-all duration-1000 delay-200 text-white drop-shadow-2xl ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            Faisons briller les étoiles au cœur de l'Afrique
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 text-white drop-shadow-lg ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            L'Association Ivoirienne d'Astronomie (AIA) vous invite à lever les yeux vers le ciel pour explorer, apprendre et inspirer. Ensemble, développons la culture scientifique et spatiale en Côte d'Ivoire.
          </p>
          
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <Button 
              size="lg" 
              onClick={() => scrollToSection('about')}
              className="bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-purple font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Découvrir l'AIA
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

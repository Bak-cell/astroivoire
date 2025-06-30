
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen cosmic-bg star-field flex items-center justify-center text-white overflow-hidden">
      {/* Animated stars */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-twinkle"></div>
        <div className="absolute top-32 right-20 w-1 h-1 bg-cosmic-gold rounded-full animate-twinkle" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-cosmic-gold rounded-full animate-twinkle" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-float">
            <div className="text-6xl mb-4">🌟</div>
          </div>
          
          <h1 className="font-space text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Faisons briller les étoiles au cœur de l'Afrique
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            L'Association Ivoirienne d'Astronomie (AIA) vous invite à lever les yeux vers le ciel pour explorer, apprendre et inspirer. Ensemble, développons la culture scientifique et spatiale en Côte d'Ivoire.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => scrollToSection('join')}
              className="bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-purple font-semibold px-8 py-4 text-lg"
            >
              Nous rejoindre
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => scrollToSection('about')}
              className="border-white text-white hover:bg-white hover:text-cosmic-purple px-8 py-4 text-lg"
            >
              Découvrir l'AIA
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

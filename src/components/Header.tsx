
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/lovable-uploads/6b0b0b8e-dcb8-4c23-aedb-12cca088a5ac.png" 
                alt="Logo AIA"
                className="w-12 h-12 object-contain"
              />
            </div>
            <div>
              <h1 className="font-space font-bold text-xl text-cosmic-purple">AIA</h1>
              <p className="text-xs text-gray-600">Association Ivoirienne d'Astronomie</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-cosmic-purple transition-colors"
            >
              À propos
            </button>
            <button 
              onClick={() => scrollToSection('activities')}
              className="text-gray-700 hover:text-cosmic-purple transition-colors"
            >
              Activités
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="text-gray-700 hover:text-cosmic-purple transition-colors"
            >
              Événements
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-cosmic-purple transition-colors"
            >
              Contact
            </button>
            <Button 
              onClick={() => scrollToSection('join')}
              className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple"
            >
              Nous rejoindre
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('about')}
                className="text-left text-gray-700 hover:text-cosmic-purple transition-colors"
              >
                À propos
              </button>
              <button 
                onClick={() => scrollToSection('activities')}
                className="text-left text-gray-700 hover:text-cosmic-purple transition-colors"
              >
                Activités
              </button>
              <button 
                onClick={() => scrollToSection('events')}
                className="text-left text-gray-700 hover:text-cosmic-purple transition-colors"
              >
                Événements
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="text-left text-gray-700 hover:text-cosmic-purple transition-colors"
              >
                Contact
              </button>
              <Button 
                onClick={() => scrollToSection('join')}
                className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:from-cosmic-blue hover:to-cosmic-purple w-full"
              >
                Nous rejoindre
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

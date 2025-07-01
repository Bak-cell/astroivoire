
import SocialLinks from "./SocialLinks";

const Footer = () => {
  return (
    <footer id="contact" className="bg-cosmic-purple text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 bg-cosmic-gold rounded-full flex items-center justify-center">
                <span className="text-cosmic-purple font-bold text-xl">🌟</span>
              </div>
              <div>
                <h3 className="font-space font-bold text-xl">AIA</h3>
                <p className="text-sm text-gray-300">Association Ivoirienne d'Astronomie</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Démocratiser l'astronomie en Côte d'Ivoire et inspirer les générations futures 
              à explorer l'univers qui nous entoure.
            </p>
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-4">Suivez-nous</h4>
              <SocialLinks className="text-gray-300" iconSize={24} />
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:contact.aia.ci@gmail.com" className="hover:text-cosmic-gold transition-colors">
                  contact.aia.ci@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>📱</span>
                <a href="tel:+22501234567" className="hover:text-cosmic-gold transition-colors">
                  +225 01 23 45 67
                </a>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Adresse</h4>
            <div className="text-gray-300">
              <div className="flex items-start space-x-2">
                <span>📍</span>
                <div>
                  <p>UFR SSMT</p>
                  <p>Université Félix Houphouët-Boigny</p>
                  <p>Cocody, Abidjan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm">
              © 2025 Association Ivoirienne d'Astronomie. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <SocialLinks className="text-gray-300" iconSize={16} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

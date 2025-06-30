
import { Card, CardContent } from "@/components/ui/card";

const AboutSection = () => {
  const missions = [
    {
      icon: "🌌",
      title: "Vulgariser les sciences de l'univers",
      description: "Rendre l'astronomie accessible à tous les publics"
    },
    {
      icon: "👥",
      title: "Sensibiliser les jeunes",
      description: "Inspirer les futures générations aux carrières spatiales"
    },
    {
      icon: "🔭",
      title: "Organiser des observations",
      description: "Conférences et séances d'observation astronomique"
    },
    {
      icon: "⚖️",
      title: "Favoriser l'inclusion",
      description: "Promouvoir la parité dans les domaines scientifiques"
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-space text-4xl font-bold text-cosmic-purple mb-4">
            À propos de l'AIA
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cosmic-purple to-cosmic-gold mx-auto mb-8"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Fondée en <span className="font-semibold text-cosmic-purple">2021 à Abidjan</span>, l'Association Ivoirienne d'Astronomie (AIA) est une organisation scientifique et éducative dont la mission est de démocratiser l'astronomie en Côte d'Ivoire.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Nous réunissons <span className="font-semibold text-cosmic-purple">étudiants, enseignants, passionnés et chercheurs</span> pour construire ensemble un avenir où les sciences spatiales occupent une place centrale dans l'éducation ivoirienne.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {missions.map((mission, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{mission.icon}</div>
                  <h3 className="font-semibold text-xl text-cosmic-purple mb-3">
                    {mission.title}
                  </h3>
                  <p className="text-gray-600">
                    {mission.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

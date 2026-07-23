import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";
import { Calendar, MapPin } from "lucide-react";

const EventsSection = () => {
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

  const events = [
    {
      date: "12 juillet 2025",
      title: "Nuit de la Lune",
      location: "UFR SSMT, Abidjan",
      type: "Observation",
      status: "À venir"
    },
    {
      date: "Septembre 2025",
      title: "AstroTour II",
      location: "Bouaké, Yamoussoukro, Korhogo",
      type: "Tournée",
      status: "Planifié"
    },
    {
      date: "Novembre 2025",
      title: "Formation enseignants",
      location: "Abidjan",
      type: "Formation",
      status: "Inscription ouverte"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "À venir":
        return "bg-blue-100 text-blue-800";
      case "Planifié":
        return "bg-purple-100 text-purple-800";
      case "Inscription ouverte":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section id="events" className="py-20 bg-gradient-to-br from-cosmic-purple/5 to-cosmic-blue/5" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-space text-4xl font-bold text-cosmic-purple mb-4">
            Prochains événements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cosmic-purple to-cosmic-gold mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Rejoignez-nous pour explorer l'univers ensemble
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-xl transition-all duration-500 border-0 shadow-lg group hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{
                transitionDelay: `${200 + index * 100}ms`
              }}
            >
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={`${getStatusColor(event.status)} font-medium transition-all duration-300 group-hover:scale-105`}>
                    {event.status}
                  </Badge>
                  <span className="text-sm text-gray-500 font-medium">
                    {event.type}
                  </span>
                </div>
                <CardTitle className="text-xl font-space text-cosmic-purple group-hover:text-cosmic-blue transition-colors duration-300">
                  {event.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 transition-transform duration-300 group-hover:translate-x-1">
                    <span className="text-lg">📅</span>
                    <span className="font-medium text-gray-700">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 transition-transform duration-300 group-hover:translate-x-1">
                    <span className="text-lg">📍</span>
                    <span className="text-gray-600">{event.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;

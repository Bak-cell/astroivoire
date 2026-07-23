import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Calendar, MapPin, Users, CalendarPlus, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast } from "date-fns";
import { fr } from "date-fns/locale";
import EventRegisterDialog from "./EventRegisterDialog";

interface Event {
  id: string;
  title: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  event_type: string;
  capacity: number | null;
  cover_image: string | null;
  registration_open: boolean;
}

const typeLabels: Record<string, string> = {
  observation: "Observation",
  formation: "Formation",
  conference: "Conférence",
  tournee: "Tournée",
  atelier: "Atelier",
};

const EventsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<Event | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .order("starts_at", { ascending: true });
      const upcoming = (data ?? []).filter((e) => !isPast(new Date(e.ends_at ?? e.starts_at)));
      setEvents(upcoming.slice(0, 6));

      // Count registrations per event (public counts are okay: anon INSERT-only, so aggregate via a lightweight admin-free approach: fetch counts via edge function alternative)
      // Since anon can't SELECT registrations, we skip live counts for non-admins and just show capacity.
    };
    load();
  }, []);

  const openRegister = (e: Event) => {
    setSelected(e);
    setDialogOpen(true);
  };

  const addToCalendar = (e: Event) => {
    const start = new Date(e.starts_at);
    const end = new Date(e.ends_at ?? new Date(start.getTime() + 2 * 60 * 60 * 1000));
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent(e.description)}&location=${encodeURIComponent(e.location)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      id="events"
      className="py-20 bg-gradient-to-br from-cosmic-purple/5 to-cosmic-blue/5"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="font-space text-4xl font-bold text-cosmic-purple mb-4">
            Prochains événements
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cosmic-purple to-cosmic-gold mx-auto mb-8"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rejoignez-nous pour explorer l'univers ensemble
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Calendar className="w-16 h-16 mx-auto opacity-30 mb-4" />
            <p>Aucun événement programmé pour l'instant. Reviens bientôt !</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {events.map((event, index) => (
              <Card
                key={event.id}
                className={`overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-lg group hover:-translate-y-1 flex flex-col ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                {event.cover_image && (
                  <div className="aspect-video overflow-hidden bg-cosmic-purple/10">
                    <img
                      src={event.cover_image}
                      alt={event.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <Badge className="bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/20 font-medium">
                      {typeLabels[event.event_type] ?? event.event_type}
                    </Badge>
                    {event.registration_open ? (
                      <Badge className="bg-green-100 text-green-800">Inscription ouverte</Badge>
                    ) : (
                      <Badge variant="secondary">Bientôt</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl font-space text-cosmic-purple group-hover:text-cosmic-blue transition-colors">
                    {event.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-cosmic-purple flex-shrink-0" />
                      <span className="font-medium">
                        {format(new Date(event.starts_at), "EEEE d MMMM yyyy · HH'h'mm", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-cosmic-purple flex-shrink-0" />
                      <span className="text-muted-foreground">{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users size={16} className="text-cosmic-purple flex-shrink-0" />
                        <span>{event.capacity} places</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {event.description}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    {event.registration_open ? (
                      <Button
                        onClick={() => openRegister(event)}
                        className="flex-1 bg-gradient-to-r from-cosmic-purple to-cosmic-blue hover:opacity-90"
                        size="sm"
                      >
                        <Ticket className="w-4 h-4 mr-2" /> S'inscrire
                      </Button>
                    ) : (
                      <Button disabled className="flex-1" size="sm" variant="outline">
                        Inscription fermée
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addToCalendar(event)}
                      title="Ajouter à Google Agenda"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <EventRegisterDialog event={selected} open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default EventsSection;

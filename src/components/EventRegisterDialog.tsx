import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface EventLite {
  id: string;
  title: string;
  starts_at: string;
  location: string;
}

interface Props {
  event: EventLite | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const schema = z.object({
  first_name: z.string().trim().min(1, "Prénom requis").max(100),
  last_name: z.string().trim().min(1, "Nom requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  seats: z.number().int().min(1).max(10),
});

export default function EventRegisterDialog({ event, open, onOpenChange }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    seats: 1,
  });

  const reset = () => {
    setForm({ first_name: "", last_name: "", email: "", phone: "", seats: 1 });
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Formulaire invalide",
        description: Object.values(parsed.error.flatten().fieldErrors).flat()[0] ?? "Vérifiez les champs.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: event.id,
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      seats: parsed.data.seats,
    });
    setLoading(false);
    if (error) {
      const msg = error.code === "23505"
        ? "Cet email est déjà inscrit à cet événement."
        : error.message;
      toast({ title: "Inscription impossible", description: msg, variant: "destructive" });
      return;
    }
    setSuccess(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="dark bg-background/95 backdrop-blur-xl border-white/10 max-w-md">
        {success ? (
          <div className="text-center py-6 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-cosmic-gold mx-auto" />
            <DialogTitle>Inscription confirmée !</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Nous t'avons ajouté à la liste. Un rappel te sera envoyé par email avant l'événement.
            </p>
            <Button onClick={() => onOpenChange(false)} className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue">
              Fermer
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-space text-2xl">S'inscrire à l'événement</DialogTitle>
              {event && (
                <DialogDescription className="space-y-1 pt-2">
                  <div className="font-medium text-foreground">{event.title}</div>
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(event.starts_at), "EEEE d MMMM yyyy 'à' HH'h'mm", { locale: fr })}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3 h-3" /> {event.location}
                  </div>
                </DialogDescription>
              )}
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="first_name">Prénom</Label>
                  <Input
                    id="first_name"
                    required
                    maxLength={100}
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    className="bg-white/5"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Nom</Label>
                  <Input
                    id="last_name"
                    required
                    maxLength={100}
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    className="bg-white/5"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  maxLength={255}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-white/5"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    maxLength={30}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="bg-white/5"
                  />
                </div>
                <div>
                  <Label htmlFor="seats">Places</Label>
                  <Input
                    id="seats"
                    type="number"
                    min={1}
                    max={10}
                    value={form.seats}
                    onChange={(e) => setForm({ ...form, seats: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
                    className="bg-white/5"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-blue"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirmer mon inscription
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
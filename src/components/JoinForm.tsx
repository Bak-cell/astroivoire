
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Mail, User, Phone } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JoinFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'member' | 'volunteer';
}

const JoinForm = ({ isOpen, onClose, type }: JoinFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    motivation: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const schema = z.object({
    firstName: z.string().trim().min(1, "Prénom requis").max(100),
    lastName: z.string().trim().min(1, "Nom requis").max(100),
    email: z.string().trim().email("Email invalide").max(255),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    motivation: z.string().trim().min(1, "Motivation requise").max(2000),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(formData);
    if (!parsed.success) {
      toast({
        title: "Formulaire invalide",
        description: parsed.error.issues[0]?.message ?? "Veuillez vérifier les champs.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("memberships").insert({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      motivation: parsed.data.motivation,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre demande. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: `Merci ${parsed.data.firstName} !`,
      description: "Votre demande d'adhésion a bien été envoyée.",
    });
    onClose();
    setFormData({ firstName: '', lastName: '', email: '', phone: '', motivation: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-cosmic-purple">
            {type === 'member' ? 'Devenir membre' : 'Devenir bénévole'}
          </CardTitle>
          <Button size="icon" variant="ghost" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="motivation">Pourquoi souhaitez-vous nous rejoindre ?</Label>
              <textarea
                id="motivation"
                name="motivation"
                value={formData.motivation}
                onChange={handleChange}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Partagez votre passion pour l'astronomie..."
                required
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-cosmic-gold hover:bg-cosmic-gold/90 text-cosmic-purple">
              {submitting ? "Envoi en cours..." : (type === 'member' ? 'Rejoindre comme membre' : 'Devenir bénévole')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinForm;

import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Pencil,
  CalendarDays,
  LogOut,
  Users,
  Mail,
  Phone,
  Download,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  published: boolean;
  registration_open: boolean;
  created_at: string;
}

interface Registration {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  seats: number;
  created_at: string;
}

const TYPES = ["observation", "formation", "conference", "tournee", "atelier"];

const emptyDraft = (): Partial<Event> => ({
  title: "",
  description: "",
  starts_at: "",
  ends_at: "",
  location: "",
  event_type: "observation",
  capacity: null,
  cover_image: "",
  published: false,
  registration_open: true,
});

// Convert ISO to local datetime-local input value
const toLocalInput = (iso?: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  const local = new Date(d.getTime() - off * 60000);
  return local.toISOString().slice(0, 16);
};

export default function AdminEvents() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [regs, setRegs] = useState<Registration[]>([]);
  const [editing, setEditing] = useState<Partial<Event> | null>(null);
  const [saving, setSaving] = useState(false);
  const [regsFor, setRegsFor] = useState<Event | null>(null);

  useEffect(() => {
    document.title = "Événements · Admin | AIA";
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(session.user.email ?? "");
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      await Promise.all([fetchEvents(), fetchRegs()]);
      setLoading(false);
    };
    init();
  }, [navigate]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("starts_at", { ascending: false });
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else setEvents(data ?? []);
  };

  const fetchRegs = async () => {
    const { data } = await supabase
      .from("event_registrations")
      .select("*")
      .order("created_at", { ascending: false });
    setRegs(data ?? []);
  };

  const regsByEvent = useMemo(() => {
    const map: Record<string, Registration[]> = {};
    for (const r of regs) (map[r.event_id] ||= []).push(r);
    return map;
  }, [regs]);

  const seatsByEvent = useMemo(() => {
    const map: Record<string, number> = {};
    for (const r of regs) map[r.event_id] = (map[r.event_id] || 0) + r.seats;
    return map;
  }, [regs]);

  const stats = {
    total: events.length,
    upcoming: events.filter((e) => new Date(e.starts_at) >= new Date()).length,
    registrations: regs.reduce((sum, r) => sum + r.seats, 0),
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.description?.trim() || !editing.starts_at || !editing.location?.trim()) {
      toast({
        title: "Champs manquants",
        description: "Titre, description, date de début et lieu sont requis.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const payload: any = {
      title: editing.title.trim(),
      description: editing.description.trim(),
      starts_at: new Date(editing.starts_at).toISOString(),
      ends_at: editing.ends_at ? new Date(editing.ends_at).toISOString() : null,
      location: editing.location.trim(),
      event_type: editing.event_type || "observation",
      capacity: editing.capacity ? Number(editing.capacity) : null,
      cover_image: editing.cover_image?.trim() || null,
      published: !!editing.published,
      registration_open: !!editing.registration_open,
    };
    let error;
    if ((editing as Event).id) {
      const r = await supabase.from("events").update(payload).eq("id", (editing as Event).id);
      error = r.error;
    } else {
      const r = await supabase.from("events").insert(payload);
      error = r.error;
    }
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Événement enregistré" });
    setEditing(null);
    await fetchEvents();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Événement supprimé" });
      await Promise.all([fetchEvents(), fetchRegs()]);
    }
  };

  const exportRegsCSV = (event: Event) => {
    const rows = regsByEvent[event.id] ?? [];
    if (rows.length === 0) {
      toast({ title: "Aucune inscription à exporter" });
      return;
    }
    const headers = ["Date", "Prénom", "Nom", "Email", "Téléphone", "Places"];
    const csv = [headers, ...rows.map((r) => [
      new Date(r.created_at).toLocaleDateString("fr-FR"),
      r.first_name, r.last_name, r.email, r.phone ?? "", String(r.seats),
    ])].map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(";")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscriptions-${event.title.replace(/\s+/g, "-").toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  if (loading) {
    return (
      <main className="dark min-h-screen star-field p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full bg-white/5" />
          <Skeleton className="h-96 w-full bg-white/5" />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="dark min-h-screen star-field flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader><CardTitle>Accès refusé</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Le compte <strong>{userEmail}</strong> n'a pas le rôle administrateur.
            </p>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Se déconnecter
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="dark min-h-screen star-field text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <CalendarDays className="w-6 h-6 text-cosmic-gold" />
            <div>
              <h1 className="text-xl md:text-2xl font-space font-bold">Événements · Admin</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin"><ArrowLeft className="w-4 h-4 mr-2" />Adhésions</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/journal">Journal</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a href="/#events" target="_blank"><ExternalLink className="w-4 h-4 mr-2" />Site</a>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
        <div className="grid gap-4 grid-cols-3">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Événements</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-space font-bold">{stats.total}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">À venir</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-space font-bold text-cosmic-gold">{stats.upcoming}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Inscriptions</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-space font-bold text-cosmic-cyan">{stats.registrations}</div></CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Événements</CardTitle>
            <Button onClick={() => setEditing(emptyDraft())} className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue">
              <Plus className="w-4 h-4 mr-2" /> Nouvel événement
            </Button>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <CalendarDays className="w-16 h-16 mx-auto opacity-30 mb-4" />
                <p>Aucun événement. Cliquez sur "Nouvel événement" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {events.map((e) => {
                  const seats = seatsByEvent[e.id] ?? 0;
                  const count = (regsByEvent[e.id] ?? []).length;
                  return (
                    <div
                      key={e.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:border-cosmic-gold/30 transition-colors"
                    >
                      <div className="w-20 h-14 rounded-md overflow-hidden bg-cosmic-purple/20 flex-shrink-0">
                        {e.cover_image && <img src={e.cover_image} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          {e.published ? (
                            <Badge className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/40">Publié</Badge>
                          ) : (
                            <Badge variant="secondary">Brouillon</Badge>
                          )}
                          <Badge variant="outline" className="capitalize">{e.event_type}</Badge>
                          {e.registration_open && <Badge className="bg-green-500/20 text-green-300 border-green-500/40">Inscriptions</Badge>}
                        </div>
                        <h3 className="font-medium truncate">{e.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(e.starts_at), "d MMM yyyy · HH'h'mm", { locale: fr })} · {e.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setRegsFor(e)} title="Voir inscriptions">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-xs">{count}{e.capacity ? `/${e.capacity}` : ""}</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditing({ ...e, starts_at: toLocalInput(e.starts_at), ends_at: toLocalInput(e.ends_at) })}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Supprimer cet événement ?</AlertDialogTitle>
                              <AlertDialogDescription>Les inscriptions liées seront également supprimées. Action irréversible.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(e.id)}>Supprimer</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit dialog */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-space text-2xl font-bold">
                {(editing as Event).id ? "Modifier l'événement" : "Nouvel événement"}
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue">
                  <Save className="w-4 h-4 mr-2" /> {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>

            <Card className="bg-white/5 border-white/10 p-6 space-y-4">
              <div>
                <Label>Titre</Label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="bg-white/5"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={4}
                  className="bg-white/5"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Début</Label>
                  <Input
                    type="datetime-local"
                    value={editing.starts_at ?? ""}
                    onChange={(e) => setEditing({ ...editing, starts_at: e.target.value })}
                    className="bg-white/5"
                  />
                </div>
                <div>
                  <Label>Fin (optionnel)</Label>
                  <Input
                    type="datetime-local"
                    value={editing.ends_at ?? ""}
                    onChange={(e) => setEditing({ ...editing, ends_at: e.target.value })}
                    className="bg-white/5"
                  />
                </div>
              </div>
              <div>
                <Label>Lieu</Label>
                <Input
                  value={editing.location ?? ""}
                  onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                  className="bg-white/5"
                  placeholder="Ex. UFR SSMT, Cocody, Abidjan"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select value={editing.event_type ?? "observation"} onValueChange={(v) => setEditing({ ...editing, event_type: v })}>
                    <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {TYPES.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Capacité (optionnel)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={editing.capacity ?? ""}
                    onChange={(e) => setEditing({ ...editing, capacity: e.target.value ? Number(e.target.value) : null })}
                    className="bg-white/5"
                  />
                </div>
              </div>
              <div>
                <Label>Image de couverture (URL)</Label>
                <Input
                  value={editing.cover_image ?? ""}
                  onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })}
                  className="bg-white/5"
                  placeholder="https://... ou /lovable-uploads/..."
                />
                {editing.cover_image && (
                  <img src={editing.cover_image} alt="" className="mt-2 rounded-md w-full aspect-video object-cover" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium">Publier</p>
                  <p className="text-xs text-muted-foreground">Visible sur le site</p>
                </div>
                <Switch
                  checked={!!editing.published}
                  onCheckedChange={(v) => setEditing({ ...editing, published: v })}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <p className="text-sm font-medium">Inscriptions ouvertes</p>
                  <p className="text-xs text-muted-foreground">Les visiteurs peuvent s'inscrire</p>
                </div>
                <Switch
                  checked={!!editing.registration_open}
                  onCheckedChange={(v) => setEditing({ ...editing, registration_open: v })}
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Registrations sheet */}
      <Sheet open={!!regsFor} onOpenChange={(o) => !o && setRegsFor(null)}>
        <SheetContent className="dark bg-background/95 backdrop-blur-xl border-white/10 w-full sm:max-w-xl overflow-y-auto">
          {regsFor && (() => {
            const list = regsByEvent[regsFor.id] ?? [];
            return (
              <>
                <SheetHeader>
                  <SheetTitle>{regsFor.title}</SheetTitle>
                  <SheetDescription>
                    {list.length} inscription{list.length > 1 ? "s" : ""} · {list.reduce((s, r) => s + r.seats, 0)} place(s)
                    {regsFor.capacity && ` / ${regsFor.capacity}`}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => exportRegsCSV(regsFor)} disabled={list.length === 0}>
                    <Download className="w-4 h-4 mr-2" /> Exporter CSV
                  </Button>
                </div>
                <div className="mt-6 space-y-3">
                  {list.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">Aucune inscription pour l'instant.</p>
                  )}
                  {list.map((r) => (
                    <div key={r.id} className="p-3 rounded-lg border border-white/10 bg-white/5">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium">{r.first_name} {r.last_name}</p>
                        <Badge variant="outline">{r.seats} place{r.seats > 1 ? "s" : ""}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-cosmic-gold">
                          <Mail className="w-3 h-3" /> {r.email}
                        </a>
                        {r.phone && (
                          <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-cosmic-gold">
                            <Phone className="w-3 h-3" /> {r.phone}
                          </a>
                        )}
                        <p>Inscrit {format(new Date(r.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </main>
  );
}
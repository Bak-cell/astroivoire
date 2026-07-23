import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Trash2, Mail, Phone, Users, Download } from "lucide-react";
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

interface Membership {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  motivation: string;
  created_at: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    document.title = "Tableau Admin | AIA";
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(session.user.email ?? "");
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      await fetchMemberships();
      setLoading(false);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate("/auth", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const fetchMemberships = async () => {
    const { data, error } = await supabase
      .from("memberships")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setMemberships(data ?? []);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("memberships").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Demande supprimée" });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const exportToCSV = () => {
    if (memberships.length === 0) {
      toast({ title: "Aucune donnée à exporter", description: "La liste des demandes est vide." });
      return;
    }
    const headers = ["Date", "Prénom", "Nom", "Email", "Téléphone", "Motivation"];
    const rows = memberships.map((m) => [
      new Date(m.created_at).toLocaleDateString("fr-FR"),
      m.first_name,
      m.last_name,
      m.email,
      m.phone ?? "",
      m.motivation.replace(/"/g, '""'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `demandes-adhesion-aia-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Export réussi", description: "Le fichier CSV a été téléchargé." });
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center star-field p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
          </CardHeader>
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
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau Admin AIA</h1>
            <p className="text-sm text-muted-foreground">Connecté en tant que {userEmail}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" /> Déconnexion
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" /> Total demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{memberships.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> Avec téléphone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {memberships.filter((m) => m.phone).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" /> Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {memberships.filter((m) => {
                  const d = new Date(m.created_at);
                  return Date.now() - d.getTime() < 7 * 24 * 3600 * 1000;
                }).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Demandes d'adhésion</CardTitle>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" /> Exporter CSV
            </Button>
          </CardHeader>
          <CardContent>
            {memberships.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Aucune demande pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Motivation</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="whitespace-nowrap text-sm">
                          {new Date(m.created_at).toLocaleDateString("fr-FR")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {m.first_name} {m.last_name}
                        </TableCell>
                        <TableCell>
                          <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                            {m.email}
                          </a>
                        </TableCell>
                        <TableCell>
                          {m.phone ? (
                            <a href={`tel:${m.phone}`} className="hover:underline">{m.phone}</a>
                          ) : (
                            <Badge variant="secondary">—</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm line-clamp-2" title={m.motivation}>{m.motivation}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(m.id)}>
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Eye,
  EyeOff,
  Pencil,
  BookOpen,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { slugify, renderMarkdown } from "@/lib/markdown";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  published: boolean;
  published_at: string | null;
  author_name: string | null;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ["actualite", "observation", "science", "evenement"];

const emptyDraft = (): Partial<Article> => ({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "actualite",
  published: false,
  author_name: "",
});

export default function AdminJournal() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editing, setEditing] = useState<Partial<Article> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    document.title = "Journal · Admin | AIA";
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }
      setUserEmail(session.user.email ?? "");
      setUserId(session.user.id);
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
      await fetchArticles();
      setLoading(false);
    };
    init();
  }, [navigate]);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setArticles(data ?? []);
    }
  };

  const stats = useMemo(() => {
    return {
      total: articles.length,
      published: articles.filter((a) => a.published).length,
      drafts: articles.filter((a) => !a.published).length,
    };
  }, [articles]);

  const handleNew = () => {
    setEditing(emptyDraft());
    setSlugTouched(false);
    setShowPreview(false);
  };

  const handleEdit = (a: Article) => {
    setEditing({ ...a });
    setSlugTouched(true);
    setShowPreview(false);
  };

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.title?.trim() || !editing.excerpt?.trim() || !editing.content?.trim()) {
      toast({
        title: "Champs manquants",
        description: "Titre, extrait et contenu sont requis.",
        variant: "destructive",
      });
      return;
    }
    setSaving(true);
    const slug = editing.slug?.trim() || slugify(editing.title);
    const wasPublished = "id" in (editing as any) ? articles.find((x) => x.id === (editing as Article).id)?.published : false;
    const nowPublishing = editing.published && !wasPublished;

    const payload: any = {
      slug,
      title: editing.title.trim(),
      excerpt: editing.excerpt.trim(),
      content: editing.content,
      cover_image: editing.cover_image?.trim() || null,
      category: editing.category || "actualite",
      published: editing.published ?? false,
      author_name: editing.author_name?.trim() || null,
    };
    if (nowPublishing) payload.published_at = new Date().toISOString();
    if (editing.published === false) payload.published_at = null;

    let error;
    if ((editing as Article).id) {
      const res = await supabase.from("articles").update(payload).eq("id", (editing as Article).id);
      error = res.error;
    } else {
      payload.author_id = userId;
      if (payload.published) payload.published_at = new Date().toISOString();
      const res = await supabase.from("articles").insert(payload);
      error = res.error;
    }
    setSaving(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Article enregistré" });
    setEditing(null);
    await fetchArticles();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Article supprimé" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const togglePublish = async (a: Article) => {
    const next = !a.published;
    const payload: any = { published: next };
    if (next && !a.published_at) payload.published_at = new Date().toISOString();
    const { error } = await supabase.from("articles").update(payload).eq("id", a.id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: next ? "Article publié" : "Article dépublié" });
      await fetchArticles();
    }
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
            <BookOpen className="w-6 h-6 text-cosmic-gold" />
            <div>
              <h1 className="text-xl md:text-2xl font-space font-bold">Journal · Admin</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin"><ArrowLeft className="w-4 h-4 mr-2" />Adhésions</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/events">Événements</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/journal" target="_blank"><ExternalLink className="w-4 h-4 mr-2" />Voir le site</Link>
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
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Total</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-space font-bold">{stats.total}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Publiés</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-space font-bold text-cosmic-gold">{stats.published}</div></CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-md">
            <CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">Brouillons</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-space font-bold text-cosmic-cyan">{stats.drafts}</div></CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Articles</CardTitle>
            <Button onClick={handleNew} className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue">
              <Plus className="w-4 h-4 mr-2" /> Nouvel article
            </Button>
          </CardHeader>
          <CardContent>
            {articles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <BookOpen className="w-16 h-16 mx-auto opacity-30 mb-4" />
                <p>Aucun article. Cliquez sur "Nouvel article" pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {articles.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-white/10 bg-white/5 hover:border-cosmic-gold/30 transition-colors"
                  >
                    <div className="w-20 h-14 rounded-md overflow-hidden bg-cosmic-purple/20 flex-shrink-0">
                      {a.cover_image && (
                        <img src={a.cover_image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {a.published ? (
                          <Badge className="bg-cosmic-gold/20 text-cosmic-gold border-cosmic-gold/40">Publié</Badge>
                        ) : (
                          <Badge variant="secondary">Brouillon</Badge>
                        )}
                        <Badge variant="outline" className="capitalize">{a.category}</Badge>
                      </div>
                      <h3 className="font-medium truncate">{a.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        MàJ {format(new Date(a.updated_at), "d MMM yyyy", { locale: fr })} · /{a.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => togglePublish(a)} title={a.published ? "Dépublier" : "Publier"}>
                        {a.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}>
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
                            <AlertDialogTitle>Supprimer cet article ?</AlertDialogTitle>
                            <AlertDialogDescription>Action irréversible.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(a.id)}>Supprimer</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-xl overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-8">
            <div className="flex items-center justify-between mb-6 sticky top-0 py-4 bg-background/80 backdrop-blur-md z-10 -mx-4 px-4">
              <h2 className="font-space text-2xl font-bold">
                {(editing as Article).id ? "Modifier l'article" : "Nouvel article"}
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowPreview((s) => !s)}>
                  {showPreview ? "Éditer" : "Aperçu"}
                </Button>
                <Button variant="ghost" onClick={() => setEditing(null)}>Annuler</Button>
                <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-cosmic-purple to-cosmic-blue">
                  <Save className="w-4 h-4 mr-2" /> {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>

            {showPreview ? (
              <Card className="bg-white/5 border-white/10 p-8">
                <Badge className="mb-3 capitalize">{editing.category}</Badge>
                <h1 className="font-space font-bold text-4xl mb-4">{editing.title || "Sans titre"}</h1>
                <p className="text-lg text-muted-foreground italic border-l-2 border-cosmic-gold pl-4 mb-6">
                  {editing.excerpt}
                </p>
                {editing.cover_image && (
                  <img src={editing.cover_image} alt="" className="w-full aspect-video object-cover rounded-lg mb-6" />
                )}
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(editing.content || "") }}
                />
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Titre</label>
                    <Input
                      value={editing.title ?? ""}
                      onChange={(e) => {
                        const title = e.target.value;
                        setEditing((prev) => prev ? {
                          ...prev,
                          title,
                          slug: slugTouched ? prev.slug : slugify(title),
                        } : prev);
                      }}
                      placeholder="Un titre qui donne envie"
                      className="bg-white/5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Extrait (résumé court)</label>
                    <Textarea
                      value={editing.excerpt ?? ""}
                      onChange={(e) => setEditing((prev) => prev ? { ...prev, excerpt: e.target.value } : prev)}
                      rows={3}
                      className="bg-white/5"
                      placeholder="2-3 phrases qui décrivent l'article."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Contenu <span className="text-xs text-muted-foreground">(Markdown : # titre, **gras**, *italique*, [lien](url), - liste, ![alt](image))</span>
                    </label>
                    <Textarea
                      value={editing.content ?? ""}
                      onChange={(e) => setEditing((prev) => prev ? { ...prev, content: e.target.value } : prev)}
                      rows={20}
                      className="bg-white/5 font-mono text-sm"
                      placeholder="# Introduction\n\nÉcrivez votre article ici..."
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <Card className="bg-white/5 border-white/10 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Publier</p>
                        <p className="text-xs text-muted-foreground">Visible sur le site</p>
                      </div>
                      <Switch
                        checked={!!editing.published}
                        onCheckedChange={(v) => setEditing((prev) => prev ? { ...prev, published: v } : prev)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Catégorie</label>
                      <Select
                        value={editing.category ?? "actualite"}
                        onValueChange={(v) => setEditing((prev) => prev ? { ...prev, category: v } : prev)}
                      >
                        <SelectTrigger className="bg-white/5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Slug (URL)</label>
                      <Input
                        value={editing.slug ?? ""}
                        onChange={(e) => {
                          setSlugTouched(true);
                          setEditing((prev) => prev ? { ...prev, slug: slugify(e.target.value) } : prev);
                        }}
                        className="bg-white/5 font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground mt-1">/journal/{editing.slug || "..."}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Image de couverture (URL)</label>
                      <Input
                        value={editing.cover_image ?? ""}
                        onChange={(e) => setEditing((prev) => prev ? { ...prev, cover_image: e.target.value } : prev)}
                        className="bg-white/5"
                        placeholder="https://... ou /lovable-uploads/..."
                      />
                      {editing.cover_image && (
                        <img src={editing.cover_image} alt="" className="mt-2 rounded-md w-full aspect-video object-cover" />
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Auteur</label>
                      <Input
                        value={editing.author_name ?? ""}
                        onChange={(e) => setEditing((prev) => prev ? { ...prev, author_name: e.target.value } : prev)}
                        className="bg-white/5"
                        placeholder="Nom affiché sur l'article"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
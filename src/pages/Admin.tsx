import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  Trash2,
  Mail,
  Phone,
  Users,
  Download,
  FileSpreadsheet,
  Search,
  RefreshCw,
  Copy,
  CalendarDays,
  TrendingUp,
  Inbox,
  ArrowUpDown,
  X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { formatDistanceToNow, format, startOfDay, subDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { ResponsiveContainer, AreaChart, Area, Tooltip as ReTooltip, XAxis } from "recharts";
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
import aiaLogo from "/lovable-uploads/9853356d-36e8-4c7c-bbd5-00a3a9d142fc.png";

interface Membership {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  motivation: string;
  created_at: string;
}

type SortKey = "created_at" | "first_name" | "email";
type QuickFilter = "all" | "today" | "week" | "month" | "with_phone";
const PAGE_SIZE = 20;

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [userEmail, setUserEmail] = useState<string>("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<QuickFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detail, setDetail] = useState<Membership | null>(null);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

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

  useEffect(() => {
    if (!isAdmin) return;
    const channel = supabase
      .channel("memberships-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memberships" },
        (payload) => {
          const m = payload.new as Membership;
          setMemberships((prev) => [m, ...prev]);
          toast({
            title: "Nouvelle demande",
            description: `${m.first_name} ${m.last_name} vient de s'inscrire.`,
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "memberships" },
        (payload) => {
          const old = payload.old as { id: string };
          setMemberships((prev) => prev.filter((m) => m.id !== old.id));
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, toast]);

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMemberships();
    setRefreshing(false);
    toast({ title: "Actualisé" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("memberships").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setMemberships((prev) => prev.filter((m) => m.id !== id));
      setSelected((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
      toast({ title: "Demande supprimée" });
    }
  };

  const handleBulkDelete = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    const { error } = await supabase.from("memberships").delete().in("id", ids);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setMemberships((prev) => prev.filter((m) => !selected.has(m.id)));
      setSelected(new Set());
      toast({ title: `${ids.length} demande(s) supprimée(s)` });
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const rowsToExport = (): Membership[] => {
    if (selected.size > 0) return memberships.filter((m) => selected.has(m.id));
    return filtered;
  };

  const exportToCSV = () => {
    const rowsSrc = rowsToExport();
    if (rowsSrc.length === 0) {
      toast({ title: "Aucune donnée à exporter", description: "La liste des demandes est vide." });
      return;
    }
    const headers = ["Date", "Prénom", "Nom", "Email", "Téléphone", "Motivation"];
    const rows = rowsSrc.map((m) => [
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

  const exportToXLSX = () => {
    const rowsSrc = rowsToExport();
    if (rowsSrc.length === 0) {
      toast({ title: "Aucune donnée à exporter", description: "La liste des demandes est vide." });
      return;
    }
    const rows = rowsSrc.map((m) => ({
      Date: new Date(m.created_at).toLocaleDateString("fr-FR"),
      Prénom: m.first_name,
      Nom: m.last_name,
      Email: m.email,
      Téléphone: m.phone ?? "",
      Motivation: m.motivation,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 28 },
      { wch: 16 },
      { wch: 60 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Demandes");
    XLSX.writeFile(workbook, `demandes-adhesion-aia-${new Date().toISOString().split("T")[0]}.xlsx`);
    toast({ title: "Export réussi", description: "Le fichier Excel a été téléchargé." });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = useMemo(() => {
    const now = new Date();
    const startWeek = subDays(now, 7);
    const startMonth = subDays(now, 30);
    const q = search.trim().toLowerCase();
    let list = memberships.filter((m) => {
      if (q) {
        const hay = `${m.first_name} ${m.last_name} ${m.email} ${m.motivation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const d = new Date(m.created_at);
      if (filter === "today" && !isSameDay(d, now)) return false;
      if (filter === "week" && d < startWeek) return false;
      if (filter === "month" && d < startMonth) return false;
      if (filter === "with_phone" && !m.phone) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      if (sortKey === "created_at") {
        av = new Date(a.created_at).getTime();
        bv = new Date(b.created_at).getTime();
      } else if (sortKey === "first_name") {
        av = `${a.first_name} ${a.last_name}`.toLowerCase();
        bv = `${b.first_name} ${b.last_name}`.toLowerCase();
      } else {
        av = a.email.toLowerCase();
        bv = b.email.toLowerCase();
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return list;
  }, [memberships, search, filter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, filter, sortKey, sortDir]);

  const stats = useMemo(() => {
    const now = new Date();
    const today = memberships.filter((m) => isSameDay(new Date(m.created_at), now)).length;
    const week = memberships.filter(
      (m) => new Date(m.created_at) >= subDays(now, 7)
    ).length;
    const month = memberships.filter(
      (m) => new Date(m.created_at) >= subDays(now, 30)
    ).length;
    const withPhone = memberships.filter((m) => m.phone).length;
    const phoneRate = memberships.length
      ? Math.round((withPhone / memberships.length) * 100)
      : 0;
    return { total: memberships.length, today, week, month, withPhone, phoneRate };
  }, [memberships]);

  const chartData = useMemo(() => {
    const days: { day: string; label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = startOfDay(subDays(now, i));
      const count = memberships.filter((m) => isSameDay(new Date(m.created_at), d)).length;
      days.push({
        day: format(d, "dd/MM"),
        label: format(d, "d MMM", { locale: fr }),
        count,
      });
    }
    return days;
  }, [memberships]);

  const allSelectedOnPage =
    paginated.length > 0 && paginated.every((m) => selected.has(m.id));
  const toggleSelectPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelectedOnPage) paginated.forEach((m) => next.delete(m.id));
      else paginated.forEach((m) => next.add(m.id));
      return next;
    });
  };

  const copyDetail = (m: Membership) => {
    const text = `${m.first_name} ${m.last_name}\n${m.email}\n${m.phone ?? ""}\n\n${m.motivation}`;
    navigator.clipboard.writeText(text);
    toast({ title: "Copié dans le presse-papiers" });
  };

  if (loading) {
    return (
      <main className="dark min-h-screen star-field p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-16 w-full bg-white/5" />
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 bg-white/5" />
            ))}
          </div>
          <Skeleton className="h-96 w-full bg-white/5" />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="dark min-h-screen flex items-center justify-center star-field p-4">
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
    <main className="dark min-h-screen star-field text-foreground">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/40 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img src={aiaLogo} alt="AIA" className="w-10 h-10 rounded-full ring-2 ring-primary/40" />
            <div>
              <h1 className="text-xl md:text-2xl font-space font-bold">Tableau Admin AIA</h1>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" /> Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <KpiCard icon={<Users className="w-4 h-4" />} label="Total demandes" value={stats.total} accent="from-primary/30 to-transparent" />
          <KpiCard icon={<CalendarDays className="w-4 h-4" />} label="Aujourd'hui" value={stats.today} accent="from-cosmic-gold/30 to-transparent" />
          <KpiCard icon={<TrendingUp className="w-4 h-4" />} label="Cette semaine" value={stats.week} accent="from-cosmic-purple/40 to-transparent" />
          <KpiCard icon={<Phone className="w-4 h-4" />} label="Taux avec tél." value={`${stats.phoneRate}%`} accent="from-cosmic-blue/40 to-transparent" />
        </div>

        {/* Chart */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Évolution des 30 derniers jours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                  <defs>
                    <linearGradient id="cosmicGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--cosmic-gold))" stopOpacity={0.6} />
                      <stop offset="100%" stopColor="hsl(var(--cosmic-purple))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" hide />
                  <ReTooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
                    formatter={(v: number) => [`${v} demande(s)`, ""]}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--cosmic-gold))"
                    strokeWidth={2}
                    fill="url(#cosmicGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="space-y-4">
            <div className="flex flex-row items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle>Demandes d'adhésion</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {filtered.length} résultat{filtered.length > 1 ? "s" : ""} sur {memberships.length}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-2" /> CSV
                </Button>
                <Button variant="outline" size="sm" onClick={exportToXLSX}>
                  <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
                </Button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un nom, email, motivation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white/5 border-white/10"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {([
                  ["all", "Tout"],
                  ["today", "Aujourd'hui"],
                  ["week", "7 jours"],
                  ["month", "30 jours"],
                  ["with_phone", "Avec tél."],
                ] as [QuickFilter, string][]).map(([key, label]) => (
                  <Button
                    key={key}
                    variant={filter === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            {selected.size > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2">
                <p className="text-sm">
                  <strong>{selected.size}</strong> demande{selected.size > 1 ? "s" : ""} sélectionnée{selected.size > 1 ? "s" : ""}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
                    Désélectionner
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" /> Supprimer
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer {selected.size} demande(s) ?</AlertDialogTitle>
                        <AlertDialogDescription>Action irréversible.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>Supprimer</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                  <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {memberships.length === 0
                    ? "Aucune demande pour le moment."
                    : "Aucun résultat pour ces filtres."}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-white/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="w-10">
                          <Checkbox
                            checked={allSelectedOnPage}
                            onCheckedChange={toggleSelectPage}
                            aria-label="Tout sélectionner"
                          />
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleSort("created_at")}
                          >
                            Date <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleSort("first_name")}
                          >
                            Nom <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead>
                          <button
                            className="flex items-center gap-1 hover:text-foreground"
                            onClick={() => toggleSort("email")}
                          >
                            Email <ArrowUpDown className="w-3 h-3" />
                          </button>
                        </TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Motivation</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginated.map((m) => (
                        <TableRow
                          key={m.id}
                          className="border-white/10 cursor-pointer hover:bg-white/5"
                          onClick={() => setDetail(m)}
                        >
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              checked={selected.has(m.id)}
                              onCheckedChange={(v) => {
                                setSelected((prev) => {
                                  const next = new Set(prev);
                                  if (v) next.add(m.id);
                                  else next.delete(m.id);
                                  return next;
                                });
                              }}
                            />
                          </TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(m.created_at), { addSuffix: true, locale: fr })}
                          </TableCell>
                          <TableCell className="font-medium">
                            {m.first_name} {m.last_name}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <a href={`mailto:${m.email}`} className="text-primary hover:underline">
                              {m.email}
                            </a>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            {m.phone ? (
                              <a href={`tel:${m.phone}`} className="hover:underline">{m.phone}</a>
                            ) : (
                              <Badge variant="secondary">—</Badge>
                            )}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-sm line-clamp-2 text-muted-foreground">{m.motivation}</p>
                          </TableCell>
                          <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
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

                {totalPages > 1 && (
                  <Pagination className="mt-4">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            isActive={currentPage === i + 1}
                            onClick={() => setPage(i + 1)}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail sheet */}
      <Sheet open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <SheetContent className="dark bg-background/95 backdrop-blur-xl border-white/10 w-full sm:max-w-lg overflow-y-auto">
          {detail && (
            <>
              <SheetHeader>
                <SheetTitle>
                  {detail.first_name} {detail.last_name}
                </SheetTitle>
                <SheetDescription>
                  Reçue le {format(new Date(detail.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 mt-6">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Email</p>
                  <a href={`mailto:${detail.email}`} className="text-primary hover:underline break-all">
                    {detail.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Téléphone</p>
                  {detail.phone ? (
                    <a href={`tel:${detail.phone}`} className="hover:underline">{detail.phone}</a>
                  ) : (
                    <span className="text-muted-foreground">Non renseigné</span>
                  )}
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Motivation</p>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed rounded-lg border border-white/10 bg-white/5 p-4">
                    {detail.motivation}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button asChild size="sm">
                    <a href={`mailto:${detail.email}`}>
                      <Mail className="w-4 h-4 mr-2" /> Répondre
                    </a>
                  </Button>
                  {detail.phone && (
                    <Button asChild size="sm" variant="outline">
                      <a href={`tel:${detail.phone}`}>
                        <Phone className="w-4 h-4 mr-2" /> Appeler
                      </a>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => copyDetail(detail)}>
                    <Copy className="w-4 h-4 mr-2" /> Copier
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </main>
  );
}

function KpiCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <Card className={`relative overflow-hidden bg-white/5 border-white/10 backdrop-blur-md`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} pointer-events-none`} />
      <CardHeader className="pb-2 relative">
        <CardTitle className="text-xs font-medium flex items-center gap-2 text-muted-foreground">
          {icon} {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-space font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
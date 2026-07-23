# Moderniser la page /admin

Voici ce que je te propose pour transformer le tableau admin en un vrai cockpit moderne, cohérent avec l'identité cosmique du site.

## 1. Identité visuelle cohérente avec le site
- Appliquer le fond `star-field` + dégradé cosmique (au lieu du fond neutre actuel).
- Header admin sticky avec logo AIA + titre + email connecté + bouton déconnexion.
- Cartes en glassmorphism (bord lumineux, backdrop-blur) comme le reste du site.
- Palette : primary/accent déjà définis, ajout d'un accent doré discret pour les KPIs.

## 2. Statistiques enrichies (KPIs)
Aujourd'hui : 3 cartes (Total, Avec téléphone, Cette semaine).
Ajouter :
- **Ce mois-ci** (nouvelles demandes du mois en cours)
- **Aujourd'hui** (demandes du jour)
- **Taux avec téléphone** (%)
- **Mini graphique** : évolution des demandes sur les 30 derniers jours (sparkline via recharts).

## 3. Recherche, filtres et tri
- Barre de recherche instantanée (nom, email, motivation).
- Filtres rapides : « Cette semaine », « Ce mois », « Avec téléphone », « Tout ».
- Tri cliquable sur les colonnes (date, nom, email).
- Compteur dynamique « X résultat(s) sur Y ».

## 4. Vue détaillée d'une demande
- Clic sur une ligne → panneau latéral (Sheet) avec :
  - Toutes les infos (motivation complète, non tronquée)
  - Boutons rapides : « Répondre par email », « Appeler », « Copier les infos »
  - Date au format long (ex. « 15 octobre 2026 à 14:32 »)

## 5. Actions groupées
- Cases à cocher sur les lignes.
- Barre d'actions flottante : « Exporter la sélection (CSV/Excel) », « Supprimer la sélection ».
- Bouton « Tout sélectionner » dans l'entête.

## 6. Pagination et performance
- Pagination (20 par page) ou scroll infini si tu préfères.
- Skeleton loaders pendant le chargement (au lieu du simple spinner plein écran).

## 7. Améliorations UX
- Toasts déjà en place → on garde, mais on ajoute une confirmation visuelle après suppression (undo pendant 5s).
- Format de date localisé et relatif (« il y a 2 jours »).
- Empty state illustré quand il n'y a aucune demande (au lieu du texte simple).
- Responsive mobile : les colonnes se transforment en cartes empilées sur petit écran.

## 8. Sécurité & robustesse
- Bouton « Rafraîchir » manuel + auto-refresh optionnel (toutes les 60s).
- Indicateur temps réel via Supabase Realtime : nouvelle demande → notification instantanée + toast « Nouvelle demande de X ».

## Détails techniques
- Composants shadcn utilisés : `Sheet` (détail), `Checkbox`, `Input` (recherche), `Select` (filtres), `Skeleton`, `Pagination`.
- Recharts pour la sparkline (déjà présent dans les dépendances Lovable).
- `date-fns` avec locale FR pour les dates relatives.
- Realtime : abonnement à `postgres_changes` sur la table `memberships`.
- Aucun changement de schéma DB nécessaire.

---

Dis-moi lesquels de ces blocs tu veux que je livre en priorité (ou « tout » si tu veux la refonte complète d'un coup).
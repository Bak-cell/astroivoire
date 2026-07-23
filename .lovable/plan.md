# Vers un site d'astronomie de classe mondiale

Inspiration : NASA, ESA, ESO, Sky & Telescope, Stellarium Web. L'objectif est un site **immersif, vivant et éditorial** — pas juste une plaquette associative.

## 1. Expérience d'accueil immersive (Hero repensé)

- Fond animé **WebGL** : champ d'étoiles 3D en parallaxe + nébuleuse animée (react-three-fiber ou canvas léger).
- Titre en **kinetic typography** (mots qui apparaissent en cascade fluide, style ESO).
- **Compteur live** en bas du hero : « X membres · Y observations réalisées · Z écoles visitées ».
- Bouton principal avec effet magnétique (curseur attiré) + halo lumineux.
- **Barre d'info live** ultra-fine sous le header : phase de la Lune du jour + prochain passage ISS visible à Abidjan.

## 2. Contenus astronomiques vivants (le vrai game changer)

Sections dynamiques alimentées par des APIs publiques gratuites (aucun coût) :

- **Image du jour** (NASA APOD API) — section éditoriale quotidienne avec image HD, titre, explication traduite/résumée.
- **Ciel d'Abidjan ce soir** : lever/coucher du Soleil et de la Lune, phase lunaire, planètes visibles (calculs via `astronomy-engine` npm, 100% client, gratuit).
- **Position ISS en temps réel** : mini-carte avec la Station Spatiale qui se déplace (Open Notify API).
- **Prochain événement céleste** : éclipse, pluie de météores, conjonction (dataset statique curé + countdown).
- **Actualités spatiales** : flux court (Spaceflight News API, gratuit).

## 3. Refonte visuelle premium

- **Palette raffinée** : deep space navy `#05060F`, indigo profond, or cosmique, cyan nébuleuse — plus contrastée et éditoriale.
- **Typographie** : titres en `Space Grotesk` (déjà) mais plus larges/aériens ; corps en `Inter` avec meilleure hiérarchie (échelle typographique 1.25).
- **Grain filmique** subtil sur les fonds sombres (texture noise) — signature ESO/National Geographic.
- **Cartes glassmorphism** avec bord lumineux animé au hover.
- **Séparateurs "constellation"** : lignes fines reliant des points étoilés entre les sections.

## 4. Motion design & interactions (Framer Motion / GSAP)

- **Scroll-linked animations** : parallaxe multi-couches sur le hero, révélations par scrub GSAP ScrollTrigger.
- **Page transitions** fluides entre routes (fade + slide cosmique).
- **Curseur personnalisé** desktop : petit point lumineux qui s'étend sur les éléments interactifs.
- **Micro-interactions** : boutons avec ripple, cartes tilt 3D léger au survol, images qui zooment doucement.
- **Lazy reveal** amélioré : stagger sur les grilles (activités, galerie).

## 5. Galerie de nouvelle génération

- Layout **masonry** au lieu de la grille uniforme.
- **Lightbox premium** avec navigation clavier, zoom, légende, date, lieu, matériel utilisé.
- **Filtres par catégorie** : Observation, Ateliers, AstroTour, Événements.
- Chargement **progressif blur-up** (LQIP).

## 6. Section "Activités" enrichie

- Passer de 4 cartes statiques à un **carrousel horizontal cinématique** ou une **grille bento**.
- Chaque activité devient cliquable → **page dédiée** avec galerie, témoignages, prochaine date, inscription.
- Icônes animées (Lottie ou SVG animés).

## 7. Événements interactifs

- **Timeline verticale animée** avec countdown live sur le prochain événement.
- Ajout au calendrier (`.ics` généré côté client).
- Carte Leaflet du lieu d'observation.
- Compteur d'inscrits en direct (via Supabase).

## 8. Blog / Journal astronomique (contenu = SEO)

- Nouvelle route `/journal` avec articles (table `articles` Supabase, éditables depuis l'admin).
- Articles types : « Comprendre l'éclipse du 12 août », « Que voir dans le ciel d'Abidjan en novembre ».
- MDX ou éditeur riche dans l'admin.
- **Bénéfice SEO majeur** : positionne l'AIA comme référence francophone astronomie Afrique de l'Ouest.

## 9. Membres & communauté

- Page publique « Notre équipe » avec photos, rôles, spécialités.
- Espace membre connecté (`/mon-espace`) : suivi de ses inscriptions aux événements, badges, historique d'observations.
- **Newsletter** avec inscription (table `newsletter_subscribers`) + template d'envoi mensuel.

## 10. Admin enrichi

- Onglets : Adhésions · Événements · Articles · Newsletter · Statistiques.
- CMS léger pour créer/éditer événements et articles sans toucher au code.
- Envoi d'emails de masse aux membres (via l'infra email déjà prévue).

## 11. Performance, SEO & accessibilité

- Images en **AVIF/WebP** + `srcset` responsive.
- **Route splitting** (React.lazy) sur `/admin`, `/journal`, `/mon-espace`.
- Balises **JSON-LD** : Organization, Event, Article.
- Sitemap dynamique généré depuis Supabase.
- Lighthouse cible : 95+ partout.
- Mode sombre/clair (le site est déjà sombre mais offrir une variante claire éditoriale).
- Support clavier complet, `prefers-reduced-motion` respecté sur toutes les animations.

## 12. Internationalisation (optionnel puissant)

- Support **FR / EN** (react-i18next) pour rayonner au-delà de la Côte d'Ivoire — les partenariats internationaux passent par l'anglais.

---

## Détails techniques

- **Librairies à ajouter** : `framer-motion` (déjà utilisable), `gsap` + `ScrollTrigger`, `@react-three/fiber` + `@react-three/drei` (hero WebGL), `astronomy-engine` (calculs ciel), `react-leaflet` (carte ISS/événements), `react-i18next` (i18n).
- **APIs externes gratuites** : NASA APOD (clé gratuite `DEMO_KEY` puis clé perso), Open Notify (ISS), Spaceflight News API.
- **Nouvelles tables Supabase** : `articles`, `events`, `newsletter_subscribers`, `event_registrations`, `team_members` — chacune avec RLS + GRANT.
- **Edge Functions** : `fetch-apod` (cache quotidien), `send-newsletter`, `ics-generator`.
- **Perf** : préchargement des polices, `content-visibility: auto` sur les sections longues.

---

## Proposition de livraison par phases

Je peux tout livrer, mais c'est plus digeste par vagues. Dis-moi laquelle attaquer en premier (ou « tout » pour enchaîner) :

- **Phase A — Wow visuel immédiat** : hero WebGL + APOD + ciel d'Abidjan + motion design (§1, §2, §4).
- **Phase B — Refonte identité** : palette premium, typo, grain, glassmorphism, galerie masonry (§3, §5).
- **Phase C — Contenu vivant** : blog/journal + CMS admin + newsletter (§8, §10).
- **Phase D — Communauté** : équipe, espace membre, événements interactifs (§6, §7, §9).
- **Phase E — Finition** : perf, SEO avancé, i18n, accessibilité (§11, §12).

Quelle phase je démarre ?

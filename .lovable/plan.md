Plan d'améliorations du site AIA

### État actuel
Le site est une landing page complète : Hero, À propos, Activités, Galerie, Événements, Adhésion, Contact. Les visuels et les animations sont en place. Plusieurs leviers d'amélioration restent exploitables.

### Recommandations proposées

#### 1. Cohérence du design system et accessibilité
- Remplacer les couleurs en dur (`text-gray-600`, `bg-gray-50`, `bg-white`, etc.) par les tokens sémantiques du projet (`--muted`, `--background`, `--card`, etc.).
- Convertir les couleurs cosmic du `tailwind.config.ts` en HSL pour respecter le format du design system.
- Uniformiser les icônes : remplacer les emojis (📅, 📍, 🚀, 🌌, etc.) par des icônes Lucide cohérentes avec le thème astronomique.
- Améliorer les contrastes et les états focus du menu mobile.

#### 2. Contenu réel et remplacement des placeholders
- Supprimer ou remplacer le numéro de téléphone fictif `+225 01 23 45 67` dans le footer par le vrai numéro de l'AIA (ou le retirer si non disponible).
- Vérifier les liens sociaux (Twitter, Instagram, Site Web) et ne conserver que ceux qui existent vraiment.
- Mettre à jour les dates des événements : les dates actuelles sont en 2025, certaines peuvent être dépassées.
- Remplacer l'image hero distante Unsplash par une image AIA locale ou une image générée sur mesure.

#### 3. Formulaire d'adhésion fonctionnel
- Connecter le formulaire "Devenir membre" à une base de données (Lovable Cloud) via une table `memberships` avec RLS.
- Afficher un état de chargement, un message de succès/erreur, et envoyer une notification email à l'équipe AIA si possible.
- Valider les champs côté client et côté serveur.

#### 4. SEO et métadonnées
- Ajouter une balise `link rel="canonical"` dans `index.html`.
- Remplacer l'image OpenGraph générique Lovable par une image AIA personnalisée.
- Ajouter un `robots.txt` et un `sitemap.xml` adaptés aux sections du site.
- Ajouter les attributs `alt` et `loading="lazy"` optimisés sur les images de la galerie et des activités.

#### 5. Nouvelles sections pour enrichir le site
- **Témoignages** : extraits de membres, participants, enseignants.
- **Équipe / membres fondateurs** : photos et rôles de quelques visages de l'AIA.
- **Partenaires / sponsors** : logos des institutions, écoles ou entreprises partenaires.
- **FAQ adhésion** : questions fréquentes sur les statuts, cotisations et activités.
- **Newsletter** : champ email simple pour recevoir les prochains événements.

#### 6. Performance et image
- Convertir les images de la galerie et des activités en formats optimisés si nécessaire.
- Ajouter du lazy loading sur les images hors écran.
- Réduire la taille de l'image hero et ajouter une version mobile plus légère.

#### 7. Micro-interactions et expérience utilisateur
- Ajouter une barre de progression de lecture en haut de page.
- Animer les compteurs (nombre de membres, événements réalisés, écoles touchées) si des données sont disponibles.
- Ajouter un effet de surbrillance dans la navigation indiquant la section active au scroll.
- Améliorer le menu mobile avec une transition fluide et un overlay.

### Phasage proposé
- **Phase 1 (rapide)** : points 1, 2 et 4. Gain immédiat en qualité et crédibilité.
- **Phase 2 (fonctionnel)** : point 3. Permet de réellement collecter les adhésions.
- **Phase 3 (enrichissement)** : points 5, 6 et 7. Passe le site au niveau institutionnel.

### Décision à prendre
Indique-moi quels points tu veux implémenter. Je te recommande de commencer par la Phase 1, puis d'ajouter la Phase 2 si tu veux recevoir les demandes d'adhésion par email.
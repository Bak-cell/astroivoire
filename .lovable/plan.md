## Objectif
Rendre l'image "Astéroïdes découverts" utilisable comme image de couverture d'article dans `/admin/journal`.

## Approche
Le champ "Image de couverture" attend une URL. On héberge l'image sur le CDN Lovable Assets (permanent, rapide) et on te fournit l'URL à coller.

## Étapes
1. Uploader `754462784_1041048158571108_6896858489537390626_n.jpg` via `lovable-assets` en la renommant `asteroides-decouverts.jpg`.
2. Créer le pointeur `src/assets/asteroides-decouverts.jpg.asset.json` (source de vérité du CDN).
3. Te communiquer l'URL CDN finale à coller dans le champ "Image de couverture (URL)" de l'éditeur admin.

## Détails techniques
- Aucune modification de code applicatif — le CMS `AdminJournal` accepte déjà n'importe quelle URL absolue (`https://...`) pour `cover_image`.
- L'URL sera de la forme `/__l5e/assets-v1/<uuid>/asteroides-decouverts.jpg`, servie par le CDN Lovable, valide en preview et en production.

## Alternative
Si tu préfères réutiliser cette image dans plusieurs articles/pages sans passer par le CDN, dis-le : on peut aussi la copier dans `public/` (URL type `/asteroides-decouverts.jpg`). Le CDN reste recommandé.

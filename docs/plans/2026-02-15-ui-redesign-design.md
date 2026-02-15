# UI Redesign - Design Document

## Objectif

Refonte visuelle complete du dashboard : passer d'un assemblage de composants incohérents à un design system unifié, sobre et professionnel (style Linear/Vercel).

## Principes

- shadcn/ui comme seule librairie de composants
- Un seul pattern par type de vue (liste, détail, formulaire)
- Spacing et typographie uniformes
- Responsive mobile-first
- Pas de features ajoutées, uniquement du polish visuel

## Composants partagés à créer

### PageHeader

```
<PageHeader
  title="Vélos"
  description="Gérez votre catalogue de vélos"
  actions={<Button>Ajouter</Button>}
/>
```

- h1 : `text-3xl font-bold tracking-tight`
- description : `text-muted-foreground`
- actions : alignées à droite

### DetailGrid

```
<DetailGrid>
  <DetailItem label="Marque" value="Trek" />
  <DetailItem label="Prix" value="1 200,00 €" />
</DetailGrid>
```

- Grid responsive : `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Labels en `text-sm text-muted-foreground`
- Values en `font-medium`

## Patterns par type de vue

### Pages listes

```
PageHeader (titre + bouton action)
Card
  [Filtres optionnels]
  Separator
  Table avec skeleton loading
/Card
```

### Pages détail

```
PageHeader (titre + boutons Retour/Actions)
Card
  DetailGrid (infos en grille responsive)
/Card
[Sections additionnelles en Cards séparées]
```

### Pages formulaire

```
PageHeader (titre)
Card max-w-lg
  Form space-y-6
  Footer : Annuler + Submit
/Card
```

## Palette de badges

| Concept | Couleur | Exemples |
|---------|---------|----------|
| Disponible/Actif | green | AVAILABLE, ACTIVE |
| En cours/Réservé | blue | RESERVED, PENDING |
| Attention/Maintenance | yellow | MAINTENANCE |
| Terminé/Vendu | gray | RETURNED, SOLD, CONFIRMED |
| Annulé/Retiré | red | CANCELLED, RETIRED |

## Pages concernées

1. Dashboard home
2. Bikes : liste, détail, formulaire
3. Customers : liste, détail, formulaire
4. Rentals : liste, détail, formulaire
5. Sales : liste, détail, formulaire
6. Inventory : page, formulaire mouvement

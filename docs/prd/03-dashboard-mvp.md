# PRD: dashboard-mvp

## Objective

Creer le dashboard admin avec les pages CRUD pour les 5 modules (velos, locations, ventes, clients, inventaire) connectees a l'API backend.

## Scope

### In scope

- Layout dashboard avec sidebar navigation
- Page liste + detail pour chaque module :
  - Bikes : liste, detail, creation, edition, changement de statut
  - Rentals : liste, detail, creation, changement de statut (start/return/cancel)
  - Sales : liste, detail, creation, confirmation/annulation
  - Customers : liste, detail, creation, edition
  - Inventory : mouvements par velo, stock actuel, enregistrer mouvement
- Connexion a l'API backend via TanStack Query
- Filtres via nuqs (status, type, recherche)
- Loading states, error states
- Responsive (mobile-friendly)

### Out of scope

- Auth / login page
- Landing page publique
- Notifications temps reel
- Export CSV/PDF
- Graphiques / analytics
- Tests E2E frontend
- Pagination cursor (le backend utilise encore offset)

## Tasks

| #   | Task                                           | Files                                               | Taille |
| --- | ---------------------------------------------- | --------------------------------------------------- | ------ |
| 1   | Layout dashboard (sidebar, header, breadcrumb) | app/(dashboard)/layout.tsx, src/components/         | L      |
| 2   | API client (fetcher, types partages)           | src/lib/api.ts, src/types/                          | M      |
| 3   | Module Bikes (hooks, pages, composants)        | src/features/bikes/, app/(dashboard)/bikes/         | L      |
| 4   | Module Customers                               | src/features/customers/, app/(dashboard)/customers/ | L      |
| 5   | Module Rentals                                 | src/features/rentals/, app/(dashboard)/rentals/     | L      |
| 6   | Module Sales                                   | src/features/sales/, app/(dashboard)/sales/         | L      |
| 7   | Module Inventory                               | src/features/inventory/, app/(dashboard)/inventory/ | L      |
| 8   | Filtres avec nuqs                              | Composants de filtre par module                     | M      |
| 9   | Loading + error states                         | src/components/loading.tsx, error.tsx               | M      |
| 10  | Responsive adjustments                         | Tous les layouts                                    | M      |
| 11  | Verifier build + lint                          | -                                                   | M      |

## Acceptance Criteria

- [ ] Toutes les pages CRUD fonctionnelles
- [ ] Donnees chargees depuis l'API backend
- [ ] Filtres fonctionnels (status, type)
- [ ] URL reflete l'etat des filtres (nuqs)
- [ ] Loading et error states visibles
- [ ] Responsive sur mobile
- [ ] Build + lint passent

## Tech Stack

- Next.js 16 (App Router, Server Components)
- TanStack Query (queries + mutations)
- nuqs (URL state pour filtres)
- shadcn/ui (table, dialog, form, select, badge, etc.)

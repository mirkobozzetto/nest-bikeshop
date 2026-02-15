# PRD: ui-redesign

## Objective

Refonte UI complète du dashboard pour un design sobre, professionnel et cohérent.

## Scope

### In scope

- Composants partagés réutilisables (PageHeader, DetailGrid)
- Uniformisation de toutes les pages listes
- Uniformisation de toutes les pages détail
- Uniformisation de tous les formulaires
- Loading skeletons cohérents
- Badges de statut centralisés
- Responsive mobile-first
- Dashboard home redesign

### Out of scope

- Nouvelles features
- Auth, i18n
- Changements backend

## Tasks

| #  | Task                                     | Files                                    | Taille |
|----|------------------------------------------|------------------------------------------|--------|
| 1  | Créer PageHeader + DetailGrid            | src/components/                          | S      |
| 2  | Refactoriser les badges de statut        | src/features/*/components/*-badge.tsx    | S      |
| 3  | Refactoriser la page Bikes (liste)       | bikes/page, bikes-table                  | M      |
| 4  | Refactoriser la page Bikes (détail)      | bikes/[id]/page, bike-detail             | M      |
| 5  | Refactoriser la page Bikes (formulaire)  | bikes/new/page, bike-form                | S      |
| 6  | Refactoriser la page Customers (liste)   | customers/page, customers-table          | M      |
| 7  | Refactoriser la page Customers (détail)  | customers/[id]/page, customer-detail     | M      |
| 8  | Refactoriser la page Customers (form)    | customers/new/page, customer-form        | S      |
| 9  | Refactoriser la page Rentals (liste)     | rentals/page, rentals-table              | M      |
| 10 | Refactoriser la page Rentals (détail)    | rentals/[id]/page, rental-detail         | M      |
| 11 | Refactoriser la page Rentals (form)      | rentals/new/page, rental-form            | S      |
| 12 | Refactoriser la page Sales (liste)       | sales/page, sales-table                  | M      |
| 13 | Refactoriser la page Sales (détail)      | sales/[id]/page                          | M      |
| 14 | Refactoriser la page Sales (form)        | sales/new/page, sale-form                | S      |
| 15 | Refactoriser la page Inventory           | inventory/page, inventory components     | M      |
| 16 | Refactoriser le dashboard home           | (dashboard)/page.tsx                     | M      |
| 17 | Vérifier build + lint                    | -                                        | S      |

## Acceptance Criteria

- [ ] Toutes les pages utilisent PageHeader
- [ ] Toutes les listes ont des skeleton loading
- [ ] Toutes les pages détail utilisent DetailGrid dans une Card
- [ ] Tous les formulaires sont dans une Card max-w-lg
- [ ] Badges de statut cohérents cross-module
- [ ] Responsive fonctionnel sur mobile
- [ ] Build + lint passent

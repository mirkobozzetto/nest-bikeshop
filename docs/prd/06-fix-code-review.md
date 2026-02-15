# PRD: fix-code-review

## Objective

Corriger les problèmes identifiés lors de la revue de code du frontend : validation des formulaires, gestion d'erreurs, hydratation SSR et prefetch serveur.

## Scope

### In scope

- Validation des prix dans les formulaires (bike-form, sale-form)
- Validation des quantités dans movement-form
- Gestion d'erreur des mutations (messages spécifiques)
- Hydratation SSR des dates (format.ts)
- Prefetch serveur pour la page inventory

### Out of scope

- Nouvelles features
- Changements backend / API
- Auth, i18n
- Refactoring UI (déjà fait dans ui-redesign)

## Tasks

| #  | Task                                          | Files                                          | Taille |
|----|-----------------------------------------------|------------------------------------------------|--------|
| 1  | Valider les prix dans bike-form               | bikes/components/bike-form.tsx                 | S      |
| 2  | Valider le formulaire sale-form               | sales/components/sale-form.tsx                 | S      |
| 3  | Valider la quantité dans movement-form        | inventory/components/movement-form.tsx         | S      |
| 4  | Améliorer les messages d'erreur des mutations | bikes/hooks.ts, rentals/hooks.ts, sales/hooks.ts | S   |
| 5  | Corriger l'hydratation SSR des dates          | lib/format.ts                                  | S      |
| ~~6~~ | ~~Ajouter le prefetch serveur inventory~~ | ~~inventory/page.tsx~~ | ~~N/A~~ |

> Note : Task 6 annulée -- inventory dépend d'un bikeId saisi dynamiquement, pas de données à prefetcher.

## Acceptance Criteria

- [ ] bike-form : parseFloat sur string vide ne produit pas NaN
- [ ] sale-form : validation customerId et items avant soumission
- [ ] movement-form : quantity > 0 validé côté JS avant mutation
- [ ] Mutations : messages d'erreur spécifiques (pas juste "Erreur")
- [ ] format.ts : pas de mismatch d'hydratation SSR/client
- [ ] inventory/page.tsx : prefetch serveur avec HydrationBoundary
- [ ] Build + lint passent

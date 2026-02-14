# PRD: dashboard-polish

## Objective

Peaufiner le dashboard : UX, animations, accessibility, optimistic updates, et corrections.

## Scope

### In scope

- Toast notifications (succes/erreur sur les actions CRUD)
- Optimistic updates sur les mutations TanStack Query
- Confirmation dialogs avant les actions destructrices
- Keyboard shortcuts (Cmd+K pour recherche)
- Breadcrumbs dynamiques
- Empty states (pas de velos, pas de clients, etc.)
- Accessibility (aria labels, focus management, contraste)
- Meta tags (title, description par page)
- Favicon + app metadata

### Out of scope

- Auth
- Tests E2E frontend
- Dark mode refinements (deja fonctionnel)
- Performance profiling
- SSR/ISR tuning

## Tasks

| #   | Task                                         | Files                              | Taille |
| --- | -------------------------------------------- | ---------------------------------- | ------ |
| 1   | Toast notifications (sonner ou server-toast) | src/components/, providers         | M      |
| 2   | Optimistic updates TanStack Query            | src/features/\*/hooks/             | M      |
| 3   | Confirmation dialogs                         | src/components/confirm-dialog.tsx  | M      |
| 4   | Command palette (Cmd+K)                      | src/components/command-palette.tsx | M      |
| 5   | Breadcrumbs dynamiques                       | src/components/breadcrumbs.tsx     | S      |
| 6   | Empty states                                 | src/components/empty-state.tsx     | S      |
| 7   | Accessibility audit + fixes                  | Multiples                          | M      |
| 8   | Meta tags + favicon                          | app/layout.tsx, public/            | S      |
| 9   | Verifier build + lint                        | -                                  | S      |

## Acceptance Criteria

- [ ] Toasts visibles sur chaque action CRUD
- [ ] Optimistic updates pour les mutations rapides
- [ ] Dialog de confirmation avant suppression/annulation
- [ ] Cmd+K ouvre la palette de recherche
- [ ] Breadcrumbs refletent la navigation
- [ ] Empty states propres
- [ ] Aucune erreur accessibility (axe-core)
- [ ] Build + lint passent

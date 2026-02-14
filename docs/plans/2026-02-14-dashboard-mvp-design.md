# Dashboard MVP -- Design

## Contexte

Backend NestJS separe (5 modules, 20 endpoints, Swagger).
Frontend Next.js 16 avec TanStack Query, nuqs, shadcn/ui, next-themes.

## Pattern data fetching : Hydration

Server Component prefetch + TanStack Query client-side cache.

- **GETs** : Server Component → `prefetchQuery` → `HydrationBoundary` → Client Component `useQuery` (zero spinner)
- **Mutations** : Client Component → `useMutation` via proxy.ts → invalidation queries → `router.refresh()`
- **Filtres** : nuqs (URL state) → searchParams dans Server Component → query key TanStack Query
- **Pas d'API Routes Next.js** : server fetch direct vers NestJS, client via proxy.ts

## Architecture fichiers

```
proxy.ts                                    # /api/* → http://localhost:3000/*

src/
├── lib/
│   ├── api.ts                              # fetcher avec base URL (server: localhost:3000, client: /api)
│   └── query.ts                            # getQueryClient() singleton par requete
├── types/
│   ├── bike.ts
│   ├── customer.ts
│   ├── rental.ts
│   ├── sale.ts
│   └── inventory.ts
├── features/
│   ├── bikes/
│   │   ├── api.ts                          # fetchBikes(), fetchBike(), createBike(), updateBike(), updateBikeStatus()
│   │   ├── hooks.ts                        # useBikes(), useBike(), useCreateBike(), useUpdateBike()...
│   │   └── components/
│   │       ├── bikes-table.tsx             # table avec colonnes, actions
│   │       ├── bike-form.tsx               # creation/edition
│   │       ├── bike-status-badge.tsx       # badge couleur par statut
│   │       └── bike-filters.tsx            # filtres type/status/brand via nuqs
│   ├── customers/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── components/
│   │       ├── customers-table.tsx
│   │       ├── customer-form.tsx
│   │       └── customer-filters.tsx
│   ├── rentals/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── components/
│   │       ├── rentals-table.tsx
│   │       ├── rental-form.tsx
│   │       ├── rental-status-badge.tsx
│   │       └── rental-filters.tsx
│   ├── sales/
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── components/
│   │       ├── sales-table.tsx
│   │       ├── sale-form.tsx
│   │       ├── sale-status-badge.tsx
│   │       └── sale-filters.tsx
│   └── inventory/
│       ├── api.ts
│       ├── hooks.ts
│       └── components/
│           ├── movements-table.tsx
│           ├── movement-form.tsx
│           └── stock-display.tsx
├── components/
│   ├── ui/                                 # shadcn (button, input, card + table, dialog, form, select, badge, etc.)
│   ├── sidebar.tsx                         # navigation laterale
│   ├── header.tsx                          # breadcrumb + theme toggle
│   ├── data-table.tsx                      # composant table generique
│   └── loading-skeleton.tsx                # skeleton loading states

app/
├── (dashboard)/
│   ├── layout.tsx                          # sidebar + header
│   ├── page.tsx                            # accueil dashboard
│   ├── bikes/
│   │   ├── page.tsx                        # Server Component: prefetch + hydration
│   │   ├── [id]/page.tsx                   # detail velo
│   │   └── new/page.tsx                    # creation velo
│   ├── customers/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   ├── rentals/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   ├── sales/
│   │   ├── page.tsx
│   │   ├── [id]/page.tsx
│   │   └── new/page.tsx
│   └── inventory/
│       └── page.tsx                        # mouvements par velo (pas de creation standalone)

## Data flow

1. Utilisateur navigue vers /bikes?status=AVAILABLE
2. Server Component lit searchParams, prefetch via TanStack Query (server→NestJS direct port 3000)
3. HydrationBoundary passe les donnees au client
4. Client Component useBikes() a les donnees immediatement (zero spinner)
5. Utilisateur change un filtre → nuqs met a jour l'URL → query key change → TanStack refetch via proxy.ts
6. Mutation (ex: changer statut) → useMutation → POST /api/bikes/:id/status → proxy.ts → NestJS → invalidation queries

## Proxy

```ts
// proxy.ts (Next.js 16, remplace middleware.ts)
export function proxy(request: Request) {
  const url = new URL(request.url)
  if (url.pathname.startsWith('/api/')) {
    const backendUrl = new URL(url.pathname.replace('/api/', '/'), 'http://localhost:3000')
    backendUrl.search = url.search
    return Response.redirect(backendUrl)
  }
}
```

## Composants shadcn a ajouter

table, dialog, form, select, badge, separator, sheet, skeleton, toast, dropdown-menu, label, textarea, tabs, popover, command

## Types frontend (miroir DTOs backend)

Tous les types en `src/types/` miroir exact des DTOs backend.
Prix en centimes (number), dates en string ISO, IDs en string UUID.
Enums reproduits comme union types TypeScript.

## Tests

- Types : validation que les types correspondent aux DTOs backend
- Hooks : tests avec QueryClientProvider wrapper + MSW pour mocker les appels
- Composants : tests de rendu des tables, formulaires, filtres
- Integration : proxy.ts + fetcher

# Dashboard MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Construire le dashboard admin avec les pages CRUD pour les 5 modules (vélos, clients, locations, ventes, inventaire) connectées à l'API backend NestJS.

**Architecture:** Pattern Hydration -- les Server Components préfetchent les données via TanStack Query (`prefetchQuery` + `dehydrate`), les Client Components consomment via `useQuery`/`useMutation`. Les mutations client passent par `proxy.ts` qui réécrit `/api/*` vers le backend NestJS. Les filtres utilisent nuqs pour l'état URL. Structure feature-based.

**Tech Stack:** Next.js 16, React 19.2, TanStack Query 5, nuqs, shadcn/ui, Tailwind 4, TypeScript 5.9

---

### Task 1: Create feature branch and install shadcn components

**Files:**
- Modify: `apps/web/package.json` (deps added by shadcn CLI)
- Modify: `apps/web/src/app/globals.css` (shadcn CSS variables)
- Create: multiple `apps/web/src/components/ui/*.tsx` files

**Step 1: Create feature branch**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/dashboard-mvp
```

**Step 2: Install shadcn/ui components**

```bash
cd apps/web
pnpm dlx shadcn@latest add table dialog form select badge separator sheet skeleton toast dropdown-menu label textarea tabs popover sonner --yes
```

**Step 3: Verify build**

Run: `pnpm build` from `apps/web/`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add .
git commit -m "feat(web): add shadcn/ui components for dashboard"
```

---

### Task 2: Setup proxy.ts, API fetcher, and query client helper

**Files:**
- Create: `apps/web/proxy.ts`
- Create: `apps/web/src/lib/api.ts`
- Create: `apps/web/src/lib/query.ts`

**Step 1: Create proxy.ts**

`apps/web/proxy.ts` -- rewrites `/api/*` requests to the NestJS backend:

```ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export function proxy(request: NextRequest) {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/api/')) {
    const backendPath = url.pathname.replace('/api', '');
    const backendUrl = new URL(backendPath, BACKEND_URL);
    backendUrl.search = url.search;

    return NextResponse.rewrite(backendUrl, {
      request: { headers: request.headers },
    });
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

**Step 2: Create API fetcher**

`apps/web/src/lib/api.ts` -- fetcher that picks the right base URL (server vs client):

```ts
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    return BACKEND_URL;
  }
  return '/api';
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

**Step 3: Create query client helper**

`apps/web/src/lib/query.ts` -- singleton QueryClient per server request:

```ts
import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
```

**Step 4: Verify build**

Run: `pnpm build` from `apps/web/`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add apps/web/proxy.ts apps/web/src/lib/api.ts apps/web/src/lib/query.ts
git commit -m "feat(web): add proxy.ts, API fetcher, and query client helper"
```

---

### Task 3: Define all TypeScript types (mirror backend DTOs)

**Files:**
- Create: `apps/web/src/types/bike.ts`
- Create: `apps/web/src/types/customer.ts`
- Create: `apps/web/src/types/rental.ts`
- Create: `apps/web/src/types/sale.ts`
- Create: `apps/web/src/types/inventory.ts`
- Create: `apps/web/src/types/index.ts`

**Step 1: Create all type files**

`apps/web/src/types/bike.ts`:

```ts
export type BikeType = 'ROAD' | 'MOUNTAIN' | 'CITY' | 'ELECTRIC' | 'KIDS';

export type BikeStatus = 'AVAILABLE' | 'RENTED' | 'SOLD' | 'MAINTENANCE' | 'RETIRED';

export type BikeStatusAction = 'rent' | 'return' | 'sell' | 'maintenance' | 'retire';

export interface Bike {
  id: string;
  name: string;
  brand: string;
  model: string;
  type: BikeType;
  size: string;
  priceCents: number;
  dailyRateCents: number;
  status: BikeStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBikeInput {
  name: string;
  brand: string;
  model: string;
  type: BikeType;
  size: string;
  priceCents: number;
  dailyRateCents: number;
}

export interface UpdateBikeInput {
  name?: string;
  brand?: string;
  model?: string;
  type?: BikeType;
  size?: string;
  priceCents?: number;
  dailyRateCents?: number;
}
```

`apps/web/src/types/customer.ts`:

```ts
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

`apps/web/src/types/rental.ts`:

```ts
export type RentalStatus = 'RESERVED' | 'ACTIVE' | 'RETURNED' | 'CANCELLED';

export type RentalStatusAction = 'start' | 'return' | 'cancel';

export interface RentalItem {
  bikeId: string;
  dailyRateCents: number;
}

export interface Rental {
  id: string;
  customerId: string;
  items: RentalItem[];
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalInput {
  customerId: string;
  items: RentalItem[];
  startDate: string;
  endDate: string;
}

export interface ExtendRentalInput {
  newEndDate: string;
}
```

`apps/web/src/types/sale.ts`:

```ts
export type SaleStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export type SaleStatusAction = 'confirm' | 'cancel';

export interface SaleItem {
  bikeId: string;
  priceCents: number;
}

export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  status: SaleStatus;
  totalCents: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleInput {
  customerId: string;
  items: SaleItem[];
}
```

`apps/web/src/types/inventory.ts`:

```ts
export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export type MovementReason =
  | 'PURCHASE'
  | 'SALE'
  | 'RENTAL_OUT'
  | 'RENTAL_RETURN'
  | 'MAINTENANCE'
  | 'LOSS'
  | 'ADJUSTMENT';

export interface Stock {
  bikeId: string;
  quantity: number;
}

export interface InventoryMovement {
  id: string;
  bikeId: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface RecordMovementInput {
  bikeId: string;
  type: MovementType;
  reason: MovementReason;
  quantity: number;
  date?: string;
  notes?: string;
}
```

`apps/web/src/types/index.ts` -- barrel export:

```ts
export * from './bike.js';
export * from './customer.js';
export * from './rental.js';
export * from './sale.js';
export * from './inventory.js';
```

**Step 2: Verify build**

Run: `pnpm build` from `apps/web/`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add apps/web/src/types/
git commit -m "feat(web): add TypeScript types mirroring backend DTOs"
```

---

### Task 4: Dashboard layout (sidebar, header, breadcrumb)

**Files:**
- Create: `apps/web/src/components/sidebar.tsx`
- Create: `apps/web/src/components/header.tsx`
- Create: `apps/web/src/components/loading-skeleton.tsx`
- Create: `apps/web/app/(dashboard)/layout.tsx`
- Create: `apps/web/app/(dashboard)/page.tsx`
- Modify: `apps/web/src/app/page.tsx` (redirect to dashboard)

**Step 1: Create sidebar component**

`apps/web/src/components/sidebar.tsx` -- `'use client'` component with navigation links:

Links: Accueil (/), Vélos (/bikes), Clients (/customers), Locations (/rentals), Ventes (/sales), Inventaire (/inventory).
Use `lucide-react` icons: Home, Bike, Users, CalendarDays, ShoppingCart, Package.
Use `sheet` for mobile (responsive).
Highlight active link with `usePathname()`.

**Step 2: Create header component**

`apps/web/src/components/header.tsx` -- breadcrumb + theme toggle.
Use `usePathname()` to generate breadcrumb segments.
Include the existing `ThemeToggle` component.
Mobile: include a sheet trigger for the sidebar.

**Step 3: Create loading skeleton**

`apps/web/src/components/loading-skeleton.tsx` -- reusable skeleton for tables (rows of skeleton rectangles).

**Step 4: Create dashboard layout**

`apps/web/app/(dashboard)/layout.tsx` -- Server Component:
- Sidebar on the left (hidden on mobile, visible on md+)
- Header on top
- Main content area with padding

**Step 5: Create dashboard home page**

`apps/web/app/(dashboard)/page.tsx` -- simple welcome page with navigation cards to each module.

**Step 6: Update root page**

Modify `apps/web/src/app/page.tsx` to redirect to the dashboard (use `redirect()` from `next/navigation`).

**Step 7: Verify build**

Run: `pnpm build` from `apps/web/`
Expected: Build succeeds

**Step 8: Commit**

```bash
git add .
git commit -m "feat(web): add dashboard layout with sidebar and header"
```

---

### Task 5: Bikes module (API, hooks, components, pages)

This is the template module. All subsequent modules follow the same pattern.

**Files:**
- Create: `apps/web/src/features/bikes/api.ts`
- Create: `apps/web/src/features/bikes/hooks.ts`
- Create: `apps/web/src/features/bikes/components/bikes-table.tsx`
- Create: `apps/web/src/features/bikes/components/bike-form.tsx`
- Create: `apps/web/src/features/bikes/components/bike-status-badge.tsx`
- Create: `apps/web/src/features/bikes/components/bike-filters.tsx`
- Create: `apps/web/app/(dashboard)/bikes/page.tsx`
- Create: `apps/web/app/(dashboard)/bikes/[id]/page.tsx`
- Create: `apps/web/app/(dashboard)/bikes/new/page.tsx`

**Step 1: Create API functions**

`apps/web/src/features/bikes/api.ts`:

```ts
import { apiFetch } from '@/lib/api';
import type { Bike, CreateBikeInput, UpdateBikeInput, BikeStatusAction } from '@/types';

export interface BikesFilters {
  type?: string;
  status?: string;
  brand?: string;
}

export function fetchBikes(filters?: BikesFilters): Promise<Bike[]> {
  const params = new URLSearchParams();
  if (filters?.type) params.set('type', filters.type);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.brand) params.set('brand', filters.brand);
  const qs = params.toString();
  return apiFetch<Bike[]>(`/bikes${qs ? `?${qs}` : ''}`);
}

export function fetchBike(id: string): Promise<Bike> {
  return apiFetch<Bike>(`/bikes/${id}`);
}

export function createBike(input: CreateBikeInput): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/bikes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateBike(id: string, input: UpdateBikeInput): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/bikes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export function updateBikeStatus(id: string, action: BikeStatusAction): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/bikes/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ action }),
  });
}
```

**Step 2: Create hooks**

`apps/web/src/features/bikes/hooks.ts`:

```ts
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { fetchBikes, fetchBike, createBike, updateBike, updateBikeStatus } from './api';
import type { BikesFilters } from './api';
import type { CreateBikeInput, UpdateBikeInput, BikeStatusAction } from '@/types';

export const bikeKeys = {
  all: ['bikes'] as const,
  list: (filters?: BikesFilters) => [...bikeKeys.all, 'list', filters] as const,
  detail: (id: string) => [...bikeKeys.all, 'detail', id] as const,
};

export function useBikes(filters?: BikesFilters) {
  return useQuery({
    queryKey: bikeKeys.list(filters),
    queryFn: () => fetchBikes(filters),
  });
}

export function useBike(id: string) {
  return useQuery({
    queryKey: bikeKeys.detail(id),
    queryFn: () => fetchBike(id),
  });
}

export function useCreateBike() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (input: CreateBikeInput) => createBike(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      router.push('/bikes');
      router.refresh();
    },
  });
}

export function useUpdateBike(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBikeInput) => updateBike(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      queryClient.invalidateQueries({ queryKey: bikeKeys.detail(id) });
    },
  });
}

export function useUpdateBikeStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (action: BikeStatusAction) => updateBikeStatus(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bikeKeys.all });
      queryClient.invalidateQueries({ queryKey: bikeKeys.detail(id) });
    },
  });
}
```

**Step 3: Create components**

`bike-status-badge.tsx` -- badge with color per status:
- AVAILABLE: green
- RENTED: blue
- SOLD: slate
- MAINTENANCE: yellow
- RETIRED: red

`bike-filters.tsx` -- `'use client'` component using `useQueryState` from nuqs:
- Select for type (ROAD, MOUNTAIN, CITY, ELECTRIC, KIDS)
- Select for status (AVAILABLE, RENTED, SOLD, MAINTENANCE, RETIRED)
- Text input for brand search

`bikes-table.tsx` -- `'use client'` component:
- Columns: Nom, Marque, Type, Taille, Prix, Tarif/jour, Statut, Actions
- Format prices from cents to EUR (ex: 1999 → 19,99 EUR)
- Actions: Voir, Modifier statut (dropdown)
- Use the `useBikes()` hook with filters from nuqs

`bike-form.tsx` -- `'use client'` component:
- Form fields: name, brand, model, type (select), size, priceCents, dailyRateCents
- Validation: all required, prices > 0
- Submit via `useCreateBike()` or `useUpdateBike()`
- Input prices in EUR, convert to cents on submit

**Step 4: Create pages**

`app/(dashboard)/bikes/page.tsx` -- Server Component with hydration:

```tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query';
import { fetchBikes } from '@/features/bikes/api';
import { bikeKeys } from '@/features/bikes/hooks';
import { BikesTable } from '@/features/bikes/components/bikes-table';
import { BikeFilters } from '@/features/bikes/components/bike-filters';

interface Props {
  searchParams: Promise<{ type?: string; status?: string; brand?: string }>;
}

export default async function BikesPage({ searchParams }: Props) {
  const filters = await searchParams;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: bikeKeys.list(filters),
    queryFn: () => fetchBikes(filters),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Vélos</h1>
          <a href="/bikes/new">Ajouter un vélo</a>
        </div>
        <BikeFilters />
        <BikesTable />
      </div>
    </HydrationBoundary>
  );
}
```

`app/(dashboard)/bikes/[id]/page.tsx` -- Server Component: prefetch single bike, display detail with status actions.

`app/(dashboard)/bikes/new/page.tsx` -- Server Component wrapping the BikeForm client component.

**Step 5: Verify build**

Run: `pnpm build` from `apps/web/`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add .
git commit -m "feat(web): add bikes module with CRUD pages"
```

---

### Task 6: Customers module

**Files:**
- Create: `apps/web/src/features/customers/api.ts`
- Create: `apps/web/src/features/customers/hooks.ts`
- Create: `apps/web/src/features/customers/components/customers-table.tsx`
- Create: `apps/web/src/features/customers/components/customer-form.tsx`
- Create: `apps/web/src/features/customers/components/customer-filters.tsx`
- Create: `apps/web/app/(dashboard)/customers/page.tsx`
- Create: `apps/web/app/(dashboard)/customers/[id]/page.tsx`
- Create: `apps/web/app/(dashboard)/customers/new/page.tsx`

Same pattern as bikes. Key differences:
- API: `GET /customers?limit=10&offset=0` (pagination), `POST /customers`, `PATCH /customers/:id`
- Filters: text search on name/email (client-side filter or query param)
- Table columns: Nom, Prénom, Email, Téléphone, Adresse
- Form: firstName, lastName, email (email validation), phone (FR format), address
- No status badge

**Step 1-5: Follow same pattern as Task 5**

**Step 6: Commit**

```bash
git add .
git commit -m "feat(web): add customers module with CRUD pages"
```

---

### Task 7: Rentals module

**Files:**
- Create: `apps/web/src/features/rentals/api.ts`
- Create: `apps/web/src/features/rentals/hooks.ts`
- Create: `apps/web/src/features/rentals/components/rentals-table.tsx`
- Create: `apps/web/src/features/rentals/components/rental-form.tsx`
- Create: `apps/web/src/features/rentals/components/rental-status-badge.tsx`
- Create: `apps/web/src/features/rentals/components/rental-filters.tsx`
- Create: `apps/web/app/(dashboard)/rentals/page.tsx`
- Create: `apps/web/app/(dashboard)/rentals/[id]/page.tsx`
- Create: `apps/web/app/(dashboard)/rentals/new/page.tsx`

Key differences:
- API: `GET /rentals?customerId=&status=`, `POST /rentals`, `PATCH /rentals/:id/status`, `PATCH /rentals/:id/extend`
- Status badge: RESERVED (yellow), ACTIVE (green), RETURNED (slate), CANCELLED (red)
- Status actions: start, return, cancel (transitions depend on current status)
- Form: select customer (fetch customers list), select bikes (multi), date range (start/end), daily rate per bike
- Table columns: Client, Vélos, Dates, Durée, Total, Statut, Actions
- Detail page: extend rental action

**Step 1-5: Follow same pattern as Task 5**

**Step 6: Commit**

```bash
git add .
git commit -m "feat(web): add rentals module with CRUD pages"
```

---

### Task 8: Sales module

**Files:**
- Create: `apps/web/src/features/sales/api.ts`
- Create: `apps/web/src/features/sales/hooks.ts`
- Create: `apps/web/src/features/sales/components/sales-table.tsx`
- Create: `apps/web/src/features/sales/components/sale-form.tsx`
- Create: `apps/web/src/features/sales/components/sale-status-badge.tsx`
- Create: `apps/web/src/features/sales/components/sale-filters.tsx`
- Create: `apps/web/app/(dashboard)/sales/page.tsx`
- Create: `apps/web/app/(dashboard)/sales/[id]/page.tsx`
- Create: `apps/web/app/(dashboard)/sales/new/page.tsx`

Key differences:
- API: `GET /sales?customerId=&status=`, `POST /sales`, `PATCH /sales/:id/status`
- Status badge: PENDING (yellow), CONFIRMED (green), CANCELLED (red)
- Status actions: confirm, cancel
- Form: select customer, select bikes (multi), price per bike
- Table columns: Client, Vélos, Total, Statut, Date, Actions

**Step 1-5: Follow same pattern as Task 5**

**Step 6: Commit**

```bash
git add .
git commit -m "feat(web): add sales module with CRUD pages"
```

---

### Task 9: Inventory module

**Files:**
- Create: `apps/web/src/features/inventory/api.ts`
- Create: `apps/web/src/features/inventory/hooks.ts`
- Create: `apps/web/src/features/inventory/components/movements-table.tsx`
- Create: `apps/web/src/features/inventory/components/movement-form.tsx`
- Create: `apps/web/src/features/inventory/components/stock-display.tsx`
- Create: `apps/web/app/(dashboard)/inventory/page.tsx`

Key differences:
- API: `GET /inventory/stock/:bikeId`, `GET /inventory/movements/:bikeId`, `POST /inventory/movements`
- No list-all endpoint -- inventory is per-bike
- Page: search/select a bike, then show stock + movements
- Movement form: select bike, type (IN/OUT/ADJUSTMENT), reason, quantity, optional date and notes
- Table columns: Date, Type, Raison, Quantité, Notes

**Step 1-5: Follow same pattern as Task 5**

**Step 6: Commit**

```bash
git add .
git commit -m "feat(web): add inventory module with stock and movements"
```

---

### Task 10: Format cents as EUR utility

**Files:**
- Create: `apps/web/src/lib/format.ts`

**Step 1: Create formatting utilities**

```ts
export function formatCents(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat('fr-FR').format(new Date(isoDate));
}

export function formatDateTime(isoDate: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(isoDate));
}
```

**Step 2: Use in all table components**

Replace all raw cents/dates with `formatCents()` and `formatDate()` calls.

**Step 3: Commit**

```bash
git add .
git commit -m "feat(web): add formatting utilities for cents and dates"
```

---

### Task 11: Responsive adjustments and final polish

**Files:**
- Modify: `apps/web/src/components/sidebar.tsx` (mobile sheet)
- Modify: all table components (responsive scroll)
- Modify: all form components (stack on mobile)

**Step 1: Sidebar mobile**

Use shadcn `Sheet` component for mobile sidebar. Trigger from header hamburger icon. Close on navigation.

**Step 2: Table responsive**

Wrap all tables in `<div className="overflow-x-auto">` for horizontal scroll on small screens.

**Step 3: Form responsive**

Use `grid grid-cols-1 md:grid-cols-2 gap-4` for form layouts.

**Step 4: Commit**

```bash
git add .
git commit -m "style(web): responsive adjustments for mobile"
```

---

### Task 12: Verify build, lint, and create PR

**Step 1: Run lint**

```bash
cd /Users/bozzettomirko/stuffs/veloshop
pnpm lint
```

Expected: 0 errors for both apps

**Step 2: Run build**

```bash
pnpm build
```

Expected: Both `@veloshop/api` and `@veloshop/web` build successfully

**Step 3: Run API tests**

```bash
pnpm --filter api test
```

Expected: 219 tests passing

**Step 4: Final commit if needed**

Fix any lint/type errors, commit fixes.

**Step 5: Push and create PR**

```bash
git push -u origin feature/dashboard-mvp
gh pr create --base develop --head feature/dashboard-mvp --title "feat(web): dashboard MVP with CRUD for all modules" --body "..."
```

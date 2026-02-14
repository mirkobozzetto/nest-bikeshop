import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight">VeloShop</h1>
        <ThemeToggle />
      </div>
      <p className="max-w-md text-center text-foreground/60">
        Gestion de vente et location de vélos. Dashboard en cours de
        construction.
      </p>
    </div>
  );
}

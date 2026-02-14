import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { QueryProvider } from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-provider'
import { NuqsProvider } from '@/providers/nuqs-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VeloShop',
  description: 'Gestion de vente et location de vélos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <QueryProvider>
            <NuqsProvider>{children}</NuqsProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Syne, DM_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'

import LenisProvider from '@/components/shared/LenisProvider'
import AvailabilityBanner from '@/components/layout/AvailabilityBanner'
import Nav from '@/components/layout/Nav'
import { SITE_META } from '@/lib/constants'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: SITE_META.title,
  description: SITE_META.description,
  metadataBase: new URL(SITE_META.url),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={[syne.variable, dmSans.variable, jetbrainsMono.variable].join(' ')}
    >
      <body>
        <LenisProvider>
          <AvailabilityBanner />
          <Nav />
          {children}
        </LenisProvider>
      </body>
    </html>
  )
}

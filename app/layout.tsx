import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { LanguageProvider } from "@/hooks/use-language"
import { SubscriptionProvider } from "@/hooks/use-subscription"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  fallback: ["Georgia", "Times New Roman", "serif"],
  preload: true,
})

export const metadata: Metadata = {
  metadataBase: new URL("https://menubase.eu"),
  title: "MenuBase – Digitale Speisekarten für Bars, Cafés & Restaurants (AT & SI)",
  description:
    "Aktualisieren Sie Preise und Gerichte in Sekunden. QR-Menüs, Premium-Themes, Analytics. Ideal für Österreich & Slowenien.",
  openGraph: {
    title: "MenuBase – Digitale Speisekarten für Bars, Cafés & Restaurants (AT & SI)",
    description:
      "Aktualisieren Sie Preise und Gerichte in Sekunden. QR-Menüs, Premium-Themes, Analytics. Ideal für Österreich & Slowenien.",
    url: "https://menubase.eu",
    images: ["/og.png"],
    siteName: "MenuBase",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuBase – Digitale Speisekarten für Bars, Cafés & Restaurants (AT & SI)",
    description:
      "Aktualisieren Sie Preise und Gerichte in Sekunden. QR-Menüs, Premium-Themes, Analytics. Ideal für Österreich & Slowenien.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://menubase.eu",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
          <SubscriptionProvider>{children}</SubscriptionProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}

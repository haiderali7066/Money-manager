import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Money Manager - Track Your Finances",
  description:
    "Modern personal finance management app to track income and expenses",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/piemvp.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/piemvp.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/piemvp.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/piemvp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OtoFiyat AI",
  description: "Fotoğraftan araç bilgisi çıkarıp fiyat aralığı tahmini üretir."
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default RootLayout

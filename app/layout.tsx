// Layout.tsx
// Layout principale per la pagina GeoLab

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoLab - oltre i confini",
  description: "Sfide geografiche quotidiane.",
  keywords: "geografia, giochi, bandiere, confini, capitali",
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: [{
      url: "/favicon.ico",
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${inter.className} bg-dark-900`}>
        {/* Navbar Trasparente e Assoluta per non occupare spazio fisico */}
        <nav className="absolute top-0 left-0 w-full z-50 p-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <a href="/" className="text-2xl font-black text-gold-500 tracking-tighter">
              🌍 GEOLAB
            </a>
          </div>
        </nav>

        {/* Rimosso main con max-width per permettere lo sfondo full-screen */}
        {children}
      </body>
    </html>
  );
}
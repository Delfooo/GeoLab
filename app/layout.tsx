// Layout.tsx
// Layout principale per la pagina GeoLab

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../src/components/shared/Navbar";
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
      url: "/icona_mondo_negativo.ico",
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
      <body className={`${inter.className} bg-dark-900 antialiased`}>
        <Navbar />
        
        {children}
      </body>
    </html>
  );
}
// Layout.tsx
// Layout principale per la pagina

import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Importa Inter da Google Fonts API
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GeoLab - Il laboratorio dei piccoli geografi",
  description: "Sfide geografiche quotidiane, bandiere, confini e capitali.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={inter.className}>
        {/* Qui puoi aggiungere una Navbar comune a tutte le pagine */}
        <nav className="p-4 bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <a href="/" className="text-xl font-black text-slate-900 tracking-tighter">
              🌍 GEOLAB
            </a>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
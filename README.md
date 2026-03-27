🌍 GeoLab: La Hub dei Mini-Giochi Geografici
GeoLab è una Progressive Web App (PWA) dedicata agli amanti della geografia. Ispirata a successi come Wordle e Worldle, l'app offre una collezione di sfide quotidiane basate su dati geografici reali, confini, bandiere e distanze.

🚀 Caratteristiche Principali
- Daily Challenges: Un nuovo enigma per ogni modalità ogni 24 ore, uguale per tutti gli utenti.
- Statistiche Persistenti: Monitoraggio delle serie di vittorie (streak) e percentuali di successo tramite LocalStorage.
- Mobile First: Interfaccia ottimizzata per il gioco rapido da smartphone.
- Condivisione social: Generazione di griglie emoji per condividere i risultati senza fare spoiler.

🛠 Stack Tecnologico
Framework: Next.js 14+ (App Router) per massime performance e SEO.
Linguaggio: TypeScript per una gestione dei dati tipizzata e sicura.
Styling: Tailwind CSS per un design reattivo e moderno.
Stato & Logica: Zustand per la gestione dello stato globale dei giochi.
Dati: JSON statici per i paesi (basati su REST Countries API).
Icone: Lucide React per una UI pulita.

📂 Struttura del Progetto
geolab/
├── public/                 # Asset statici (bandiere, mappe SVG, icone)
├── src/
│   ├── app/                # Rotte di Next.js (App Router)
│   │   ├── layout.tsx      # Layout principale (Navbar, Footer)
│   │   ├── page.tsx        # Homepage (Selezione giochi)
│   │   ├── flagle/         # Gioco: Indovina la bandiera
│   │   ├── borderle/       # Gioco: Indovina dai confini
│   │   └── capitalle/      # Gioco: Indovina la capitale
│   ├── components/         # Componenti UI riutilizzabili
│   │   ├── ui/             # Bottoni, input, modali (base)
│   │   ├── shared/         # Navbar, Keyboard, SearchBar
│   │   └── game/           # Logica visuale specifica per i mini-giochi
│   ├── data/               # Dataset JSON (countries.json)
│   ├── hooks/              # Custom hooks (useLocalStorage, useGameLogic)
│   ├── lib/                # Utility (calcolo distanze, formattazione stringhe)
│   ├── store/              # Gestione stato globale (Zustand)
│   └── types/              # Definizioni interfacce TypeScript
├── tailwind.config.ts      # Configurazione stili
└── package.json            # Dipendenze del progetto

🕹 Mini-Giochi Inclusi
- Flagle: Indovina la bandiera. Ogni tentativo rivela un pezzo della bandiera o dà indizi sulla regione.
- Borderle: Identifica lo stato basandoti esclusivamente sulla sagoma dei suoi confini.
- Capitalle: Trova lo stato partendo dal nome della sua capitale, con indizi sulla distanza chilometrica.

🛠 Come Avviare il Progetto

Segui questi passaggi per configurare l'ambiente di sviluppo locale:

Clona la repository:
    git clone https://github.com/tuo-username/geolab.git
    cd geolab

Installa le dipendenze:
    npm install
    # oppure
    yarn install

Avvia il server di sviluppo:
    npm run dev
    
Visualizza l'app:
Apri il browser all'indirizzo http://localhost:3000.

Per popolare il file JSON (countries.json):
    node seed-countries.mjs

# Scheda Allenamento

PWA mobile-first per tracciare gli allenamenti in palestra. Registra serie e pesi esercizio per esercizio, mostra i progressi nel tempo e funziona offline.

---

## Funzionalità

### Sessione di allenamento
- **Rotazione automatica dei giorni** — le sessioni ruotano in ordine; la selezione manuale è sempre disponibile prima di iniziare
- **Tracker serie** — per ogni esercizio segna le serie completate con peso e ripetizioni; supporta esercizi a corpo libero (nessun peso) e a tempo
- **Pre-compilazione pesi** — all'avvio di una sessione i pesi vengono auto-popolati con i valori dell'ultima volta che quell'esercizio è stato eseguito
- **Timer di recupero sticky** — countdown configurabile (60–180 s) che parte automaticamente alla spunta di ogni serie, sempre visibile mentre si scrolla
- **Barra avanzamento** — percentuale di serie completate rispetto al totale
- **Schermo sempre acceso** — impedisce allo schermo di spegnersi durante la sessione (Screen Wake Lock API)

### Schede e sessioni personalizzabili
- **Multi-scheda** — crea, rinomina, duplica ed elimina più schede (es. Bulk, Cut, Principiante)
- **Sessioni configurabili** — ogni scheda può avere da 1 a 5 sessioni con nome, emoji e colore personalizzati
- **Database di esercizi** — oltre 80 esercizi predefiniti divisi per gruppo muscolare selezionabili con ricerca e filtro
- **Esercizi custom** — crea i tuoi esercizi personalizzati, salvati e riutilizzabili in tutte le schede
- **Esercizi comuni** — aggiungi un esercizio a tutte le sessioni contemporaneamente (icona <kbd>⊞</kbd>); vengono mostrati in una sezione separata in fondo alla sessione
- **Modifica inline** — modifica nome, serie, reps e note di ogni esercizio direttamente dall'app
- **Reset al default** — ripristina la scheda predefinita (Push / Pull / Legs) con un tap

### Storico e progressi
- **Calendario mensile** — ogni mese mostra i giorni di allenamento colorati per tipo di sessione, il giorno odierno evidenziato e i giorni futuri sfumati
- **Dettaglio allenamento passato** — tocca qualsiasi giorno nel calendario per vedere serie e pesi registrati; i dati sono modificabili direttamente dalla stessa schermata
- **Streak e statistiche** — giorni consecutivi di allenamento, totale sessioni, frequenza settimanale media
- **Grafici progressione** — linea di tendenza del carico (kg) per ogni esercizio nelle ultime sessioni, filtrabili per sessione

### Backup e ripristino
- **Esporta dati** — serializza schede, storico e impostazioni in un file `.json`; su iOS/Android apre il foglio di condivisione nativo (iCloud Drive, AirDrop, Mail, ecc.), su desktop scarica il file
- **Importa dati** — ripristina un backup precedente caricando il file `.json`
- **Notifica di backup** — pallino rosso sull'icona impostazioni e banner in-app se non è mai stato fatto un backup o l'ultimo risale a più di 30 giorni fa

### Impostazioni
- Numero di giorni di allenamento per settimana (1–5) — determina quante sessioni ruotano
- Durata recupero di default (60–180 s)
- Gestione schede (crea, rinomina, duplica, elimina, cambia scheda attiva)
- Reset completo dei dati con doppia conferma

### PWA
- Funziona offline dopo il primo caricamento grazie al service worker (Workbox)
- Installabile su iOS (Safari → "Aggiungi alla schermata Home") e Android (Chrome → "Installa app")
- Aggiornamenti automatici applicati al primo ricaricamento senza dover chiudere l'app (`skipWaiting` + `clientsClaim`)

---

## Stack tecnico

| Strumento | Versione | Ruolo |
|-----------|----------|-------|
| [React](https://react.dev) | 19 | UI e gestione stato (Context API) |
| [Vite](https://vite.dev) | 8 | Build tool e dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Stile — dark mode, mobile-first |
| [vite-plugin-pwa](https://vite-pwa-org.netlify.app) | 1 | Service worker + Web App Manifest |
| [Recharts](https://recharts.org) | 3 | Grafici progressione pesi |
| [Lucide React](https://lucide.dev) | — | Icone |

Tutti i dati sono salvati in `localStorage` tramite un hook personalizzato. **Nessun backend, nessun account.**

---

## Struttura del progetto

```
src/
├── context/
│   └── AppContext.jsx           # stato globale: sessioni, streak, rotazione giorni
├── hooks/
│   ├── useStorage.js            # persistenza localStorage con React state
│   ├── useTimer.js              # countdown con vibrazione
│   ├── useSchedeData.js         # CRUD schede, sessioni ed esercizi + migrazioni dati
│   └── useWakeLock.js           # Screen Wake Lock API
├── data/
│   ├── workout.js               # scheda predefinita Push/Pull/Legs + colori sessione
│   └── exerciseDatabase.js      # database 80+ esercizi divisi per gruppo muscolare
├── utils/
│   └── backup.js                # helper per la notifica di backup
├── pages/
│   ├── Oggi.jsx                 # sessione attiva, selettore giorno, timer sticky
│   └── Storico.jsx              # calendario mensile + dettaglio + grafici progressione
└── components/
    ├── ExerciseCard.jsx          # card esercizio con serie interattive
    ├── ExercisePicker.jsx        # bottom sheet selezione esercizio dal database
    ├── EditExerciseModal.jsx     # bottom sheet aggiungi/modifica esercizio custom
    ├── SessionePassataModal.jsx  # bottom sheet visualizza/modifica allenamento passato
    ├── SessionEditModal.jsx      # bottom sheet nome + emoji + colore sessione
    ├── SchedeSheet.jsx           # bottom sheet gestione multi-scheda
    ├── SettingsSheet.jsx         # bottom sheet impostazioni + backup
    ├── Timer.jsx                 # timer recupero con anello SVG animato
    └── ProgressChart.jsx         # grafico Recharts per singolo esercizio
```

---

## Sviluppo locale

```bash
npm install
npm run dev      # avvia il dev server su http://localhost:5174
npm run build    # build di produzione in dist/
```

## Deploy

Configurato per **GitHub Pages** con deploy automatico via GitHub Actions a ogni push su `main`. Il base URL è `/scheda-allenamento/`.

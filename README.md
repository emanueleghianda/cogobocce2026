# Torneo di Bocce Doppio – Cogoleto 2K26

Web app ufficiale per seguire coppie, gironi, calendario, risultati live, classifiche, fase finale e ranking storico 2020–2025. L’area pubblica è in sola lettura; tutte le modifiche passano dall’area amministratore protetta.

## Funzioni incluse

- 16 coppie e 4 gironi con calendario all’italiana da 24 partite.
- Classifiche calcolate da vittorie, differenza punti e scontro diretto.
- Gestione esplicita delle parità fra tre o più coppie.
- Fase finale con quarti, semifinali, finale 3°/4° e finale 1°/2°.
- Propagazione automatica di vincitori e perdenti, anche dopo una correzione.
- Validazione lato server: gironi ai 10 punti, fase finale ai 12.
- Risultati parziali, stati partita, campi, date, orari e note.
- Ranking ufficiale 2020–2025 con 30 record e posizioni a pari merito conservate.
- Comunicazione pubblica e stato del torneo.
- Supabase Realtime con aggiornamento periodico e al ritorno online.
- Esportazione CSV e JSON.
- PWA base, metadati SEO, Open Graph, pagina 404 e interfaccia mobile-first.
- Sessione amministratore firmata e cookie HttpOnly.

## Avvio locale

Requisiti: Node.js 20 o successivo e pnpm.

1. Installa le dipendenze con `pnpm install`.
2. Copia `.env.example` in `.env.local` e valorizza tutte le variabili.
3. Esegui la migrazione `supabase/migrations/20260804120000_initial_tournament.sql` nel SQL Editor del progetto Supabase.
4. Avvia con `pnpm dev` e apri `http://localhost:3000`.

L’app può essere compilata anche senza variabili: mostra i dati iniziali ufficiali in sola lettura e non abilita i salvataggi. Per il funzionamento live e amministrativo servono le credenziali Supabase e i segreti amministratore.

## Variabili d’ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

`ADMIN_SESSION_SECRET` deve essere casuale e contenere almeno 32 caratteri. La password e la Service Role Key non devono mai avere il prefisso `NEXT_PUBLIC_` e non devono essere committate.

## Supabase

La migrazione crea:

- `teams`
- `matches`
- `tournament_settings`
- `ranking_overrides`
- `historical_ranking`
- `admin_audit_log`
- `admin_login_attempts`

Sono inclusi seed, vincoli di punteggio, indici, trigger `updated_at`, RLS, policy pubbliche di sola lettura e pubblicazione Realtime. Le tabelle sensibili non hanno policy pubbliche. Tutte le scritture applicative usano la Service Role Key esclusivamente nei Route Handler lato server.

La funzione `cleanup_admin_login_attempts()` elimina i tentativi più vecchi di 24 ore. Può essere richiamata periodicamente con Supabase Cron; non è esposta ai ruoli pubblici.

## Sicurezza amministratore

- Login con sola password letta da `ADMIN_PASSWORD`.
- Confronto a tempo costante lato server.
- JWT firmato con `jose`, valido circa 12 ore.
- Cookie HttpOnly, SameSite Strict e Secure in produzione.
- Verifica della sessione per ogni scrittura ed esportazione.
- Massimo 5 tentativi falliti in 15 minuti per hash HMAC dell’IP.
- Nessun IP, segreto, token o cookie viene scritto nell’audit log.

Il rate limiting usa `admin_login_attempts` quando Supabase è configurato. Il fallback in memoria serve solo allo sviluppo locale; in ambienti serverless non è condiviso fra istanze, perciò la tabella Supabase è la protezione effettiva in produzione.

## Logo ufficiale

Il logo ufficiale originale è conservato senza modifiche in `public/logo-torneo.png` ed è usato in home, header, login, ranking, fase finale e 404. Le favicon, le icone PWA e `public/og.png` sono varianti derivate deterministicamente dal file originale, senza alterarne testo, colori o proporzioni. Rimane disponibile un fallback testuale accessibile nel caso eccezionale in cui l’immagine non possa essere caricata.

## Test e build

- `pnpm test` — test Vitest della logica torneo.
- `pnpm lint` — controlli ESLint.
- `pnpm build` — build di produzione Next.js.

## Deploy su Vercel

1. Carica il repository su GitHub e importalo in Vercel.
2. Inserisci in Vercel le cinque variabili elencate in `.env.example`.
3. Imposta il dominio pubblico e distribuisci.
4. In Supabase, verifica che Realtime sia attivo per le quattro tabelle pubbliche indicate dalla migrazione.

Non sono richiesti servizi a pagamento: la configurazione è compatibile con i piani gratuiti di Supabase e Vercel.

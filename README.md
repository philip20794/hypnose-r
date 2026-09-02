# Hypnose R

SEO-fähige Nuxt-Webapp mit Firebase Hosting und Firebase Functions für die Hypnose-Terminreservierung.

## Übernommene Logik aus `herrin-r`

- Freie Termine kommen aus dem Google-Kalender `herrin.r.2000@gmail.com`.
- Für 60-Minuten-Hypnosesitzungen sind Kalender-Events mit Summary `Frei` oder `Freix` sichtbar.
- Für kostenlose 15-Minuten-Erstgespräche sind Kalender-Events mit Summary `15frei` sichtbar. Zusätzlich kann der Start eines normalen `Frei`-Stundenblocks als 15-Minuten-Erstgespräch reserviert werden.
- Wenn ein 15-Minuten-Erstgespräch aus einem 60-Minuten-`Frei`-Block reserviert wird, kürzt die Function den reservierten Slot auf 15 Minuten und legt die restlichen 15-Minuten-Slots mit Summary `15frei` im freien Kalender an.
- Eine Reservierung patcht den freien Kalender-Eintrag auf `Reserviert` und schreibt Terminart plus Kundendaten in die Beschreibung.
- Reservierungen laufen nach 48 Stunden ab, wenn sie nicht über den E-Mail-Link bestätigt werden.
- Die Scheduled Function `hypnoseExpirePendingReservations` storniert abgelaufene Reservierungen automatisch und stellt den freien Kalender zurück.
- Erst nach Klick auf den E-Mail-Link und dem Button `Verbindlich bestätigen` wird der Termin in den gebuchten Kalender `runaundphilip@gmail.com` verschoben.
- Beim Storno vor verbindlicher Bestätigung wird der Kalender-Eintrag wieder auf `Frei` gesetzt und die Beschreibung geleert.
- E-Mail-Versand läuft über Mailgun mit `MAILGUN_API_KEY`. Das bestehende `SENDGRID_FROM_EMAIL` Secret bleibt als konfigurierte Absenderadresse erhalten.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Wenn du lokal gegen bereits deployte Functions testen willst:

```bash
npm run dev:live-api
```

Das Script lädt `.env.local`, nutzt `https://hypnose-r.web.app` als API-Basis und
startet Nuxt auf Port `4173`.

## Design-System

Quasar ist als UI-Basis installiert. Die App-Komponenten greifen nicht direkt auf
Quasar-Stile zu, sondern auf die kleine Design-System-Schicht:

- `src/design-system/tokens.ts`: zentrale Farben, Radien, Schatten und Button-Varianten.
- `assets/design-system.css`: CSS Custom Properties, Quasar-Overrides und Basisstile für DS-Komponenten.
- `components/design-system/`: Wrapper wie `DsButton`, `DsTextField`, `DsPanel`, `DsState`, `DsBadge` und `DsDialog`.

Wenn Buttons, Farben oder Formularfelder global angepasst werden sollen, zuerst diese
Dateien ändern und nicht die Fachkomponenten.

## Build

```bash
npm run build
```

Der statische Nuxt-Build landet in `.output/public` und wird von Firebase Hosting ausgeliefert. Die Token-Seite `/bestaetigen/:token` ist bewusst `noindex` und nicht prerendered.

## Firebase/Functions Konfiguration

Die Datei `functions/service-account.json` ist lokal kopiert und in `.gitignore` eingetragen. Sie wird für Google Calendar verwendet.

Firebase Secrets, die gesetzt sein müssen:

```bash
firebase functions:secrets:set MAILGUN_API_KEY
firebase functions:secrets:set SENDGRID_FROM_EMAIL
```

Optionale Functions-Umgebungswerte stehen in `functions/.env.example`:

- `PUBLIC_SITE_URL`
- `MAILGUN_DOMAIN`
- `MAILGUN_API_URL`
- `HYPNOSE_OWNER_EMAIL`
- `HYPNOSE_PRICE_EUR`
- `HYPNOSE_ADDRESS`
- `HYPNOSE_FREE_CALENDAR_ID`
- `HYPNOSE_BOOKED_CALENDAR_ID`

Das kostenlose Erstgespräch kostet `0 EUR`; die 60-Minuten-Hypnosesitzung nutzt aktuell `HYPNOSE_PRICE_EUR=120`. Die Zahlung erfolgt vor Ort oder per Rechnung.

Mailgun ist für Production auf `MAILGUN_DOMAIN=hypnose-r.de` und
`MAILGUN_API_URL=https://api.eu.mailgun.net` konfiguriert. Als Absender nutzt
die Function `SENDGRID_FROM_EMAIL`, sofern diese Adresse zur Mailgun-Domain
passt, sonst `postmaster@MAILGUN_DOMAIN`.

## Mailgun Templates

Diese Template-Namen erwartet die Function:

- `hypnose termin bestaetigungslink`: Mail an Kundin/Kunden nach Reservierung, muss `confirmUrl` als Button/Link enthalten.
- `me - hypnose termin reserviert`: Mail an dich nach Reservierung.
- `hypnose termin bestaetigt`: Mail an Kundin/Kunden nach verbindlicher Bestätigung.
- `me - hypnose termin bestaetigt`: Mail an dich nach verbindlicher Bestätigung.
- `hypnose termin storniert`: Mail an Kundin/Kunden nach Storno.
- `me - hypnose termin storniert`: Mail an dich nach Storno.

Die Function übergibt die Template-Daten als `t:variables` JSON-String. In den
Mailgun-Templates können die Werte mit Handlebars-Platzhaltern verwendet werden,
zum Beispiel `{{name}}`, `{{service}}`, `{{appointmentDate}}`, `{{confirmUrl}}`
und `{{cancelUrl}}`.

Die Copy-Paste-Dateien für Mailgun liegen unter `mailgun-templates/`.

Der hinterlegte API-Key muss Nachrichten senden dürfen. Geeignet ist entweder
ein Account-API-Key mit Schreibrechten für `Messages` oder ein Domain-Sending-Key
für genau die konfigurierte `MAILGUN_DOMAIN`.

## Deployment

`.firebaserc` zeigt aktuell auf ein Firebase-Projekt mit ID `hypnose-r`. `firebase.json` deployed `.output/public`. Falls du stattdessen ein anderes Firebase-Projekt oder eine Hosting-Site nutzt, diesen Wert vor dem Deploy bewusst anpassen.

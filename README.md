# TCF French Coach

Application web full stack pour la préparation au **TCF Canada / TCF**, centrée sur l’objectif **B2** (expression orale et écrite, avec grammaire, compréhension et stratégie d’examen). Interface sobre, bilingue (FR + explications EN), **mode sombre**, responsive.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **PostgreSQL** via **Prisma** (compatible **Supabase** : même `DATABASE_URL`)
- **OpenAI API** pour l’agent « Exam Coach » (chat, corrections structurées JSON, plans)

## Architecture (refonte « premium prep »)

- **Aucun scraping** ni contenu payant tiers : seuls les fichiers **que vous importez** (droits attestés) alimentent la bibliothèque PostgreSQL.
- **Routes principales** : `/dashboard`, `/library`, `/practice/*`, `/admin/import`, `/mock-exam`, `/progress`, `/mistakes`, `/tutor`, etc.
- **Pipeline d’import** : validation Zod (`src/lib/import/schemas.ts`), parseurs JSON / CSV / Markdown+JSON / texte (`parse-file.ts`), persistance (`ingest.ts`) + traçabilité `ContentImportBatch` (source, format, attestation légale).
- **Démo** : `prisma/data/demo-authorized-library.json` importé au seed si la bibliothèque est vide.

## Structure du projet

```
src/
  app/
    dashboard/page.tsx       # Pilotage premium (compte à rebours, compétences, bibliothèque)
    library/page.tsx         # Vue bibliothèque + lots d’import
    admin/import/page.tsx    # Upload / collage JSON + attestation de droits
    practice/*/page.tsx      # Oral (DB), écrit/lecture/écoute/grammaire (réutilise les écrans existants)
    api/
      admin/import           # POST multipart ou JSON collé
      library                # GET compteurs + lots
      dashboard/summary      # GET agrégats profil + tentatives + bibliothèque
      content/speaking-prompts
  components/
    layout/app-shell.tsx
    premium/                 # en-têtes, cartes stats, grille compétences
    ui/
  lib/
    import/                  # schémas, parse, ingest
    agent/ … content/ …
prisma/
  schema.prisma
  data/demo-authorized-library.json
  seed.ts
```

## Schéma base de données (résumé)

| Modèle | Rôle |
|--------|------|
| `User` | Utilisateur (anonyme par défaut, email optionnel) |
| `UserProfile` | Date d’examen, objectif, temps/jour, forces/faiblesses (JSON), plans |
| `CoachMessage` | Historique chat coach |
| `WritingPiece` | Textes + `feedbackJson` |
| `SpeakingSession` | Transcription + feedback |
| `QuizAttempt`, `ReadingAttempt`, `ListeningAttempt` | Scores par compétence |
| `Bookmark` | Phrases / modèles favoris |
| `MistakeEntry` | Erreurs récurrentes (prêt pour agrégation automatique) |
| `MockExamResult` | Scores blancs |
| `FlashcardState` | SRS (intervalles à activer côté UI) |
| `ContentImportBatch` | Lot d’import (format, fichier, **rightsDeclaration**, libellé source) |
| `SpeakingPromptContent`, `WritingPromptContent`, … | Contenus indexés (attribution + tags JSON) |
| `ReadingPassageContent` + `ReadingQuestionContent` | Texte + QCM structurés |
| `ListeningExerciseContent` + `ListeningQuestionContent` | Transcript + audio optionnel + QCM |
| `GrammarDrillContent`, `VocabularyCardContent`, `PhraseBankContent` | Drills / cartes / phrases |
| `PracticeAttempt` | Historique unifié par compétence (extensible) |
| `MistakeLog` | Journal d’erreurs (granulaire) |
| `MockExamSession` | Examen blanc : progression JSON, reprise, résultats |

## Import JSON (schéma)

Champs racine obligatoires : `sourceLabel`, `sourceAttribution`. Sections optionnelles : `speakingPrompts`, `writingPrompts`, `readingPassages` (avec `questions[]`: `prompt`, `choices[]`, `correctIndex`, `explanation`), `listeningExercises` (même principe + `transcript`, `audioUrl?`), `grammarDrills`, `vocabularyCards`, `phraseBank`.

- **CSV** : colonnes minimales `type,prompt,title,taskType,level,topic,difficulty` (`type=speaking`).
- **Markdown** : inclure un bloc de code JSON (triple backticks + `json`) conforme au schéma.
- **Texte (.txt)** : importe un passage de lecture générique avec QCM d’appoint (à remplacer par un JSON complet pour un usage sérieux).

Référence code : `src/lib/import/schemas.ts`, exemple `prisma/data/demo-authorized-library.json`.

## Architecture de l’agent « Exam Coach »

1. **Modes** (`tutor` | `examiner` | `drill`) : prompts système dans `src/lib/agent/prompts.ts`.
2. **Chat** : `POST /api/chat` — message utilisateur + contexte profil (objectif, faiblesses).
3. **Tâches structurées** : `response_format: json_object` + instructions dédiées pour :
   - correction écrite (grammaire, cohérence, versions corrigée / B2),
   - analyse orale (critères type grille + sections de feedback),
   - réécriture B2,
   - plan hebdomadaire.

### Exemples de prompts système (extraits)

Voir `src/lib/agent/prompts.ts`. Idée directrice :

> Optimiser la réussite au TCF ; feedback honnête et priorisé ; explications simples ; modèles B2 et stratégie d’examen ; suivre les faiblesses supposées à partir des productions.

## Contenu seed inclus

- **20** consignes **expression orale** — `src/lib/content/speaking-prompts.ts`
- **20** consignes **expression écrite** (débutant / intermédiaire / examen) — `writing-prompts.ts`
- **55** connecteurs & formules — `connectors.ts` + banques thématiques — `phrase-banks.ts`
- **12** exemples **B1 → B2** — `b1-b2-upgrades.ts`
- Passages **compréhension** + QCM — `passages.ts`
- Micro-exercices **grammaire** — `grammar-drills.ts`

## Dépannage Node (macOS / Homebrew)

Si `node` échoue avec `Library not loaded: ... libicui18n.74.dylib`, votre Node Homebrew n’est pas aligné avec `icu4c`. Pistes : `brew reinstall icu4c node` ou utiliser **nvm** / **fnm** avec une version LTS officielle.

## Prérequis

- Node.js **20+** (LTS recommandé)
- Compte **PostgreSQL** local, Docker, ou **Supabase**
- Clé **OpenAI**

## Installation

```bash
cd /Users/oliverhuang/Projects/tcf-french-coach
cp .env.example .env
# Renseignez DATABASE_URL et OPENAI_API_KEY

npm install
npx prisma generate
npx prisma db push
npm run db:seed   # optionnel — utilisateur démo
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Variables d’environnement

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | URL PostgreSQL |
| `OPENAI_API_KEY` | Clé API OpenAI |
| `OPENAI_MODEL` | (optionnel) défaut `gpt-4o-mini` |

## Données de démo (UI)

Si la base n’est pas joignable, le **tableau de bord** affiche quand même des **métriques d’exemple** pour explorer l’interface. Les routes API qui écrivent en base renverront une erreur **503** tant que `DATABASE_URL` n’est pas valide.

## Prochaines itérations suggérées

1. **Auth** (Supabase Auth, NextAuth, Clerk) et synchronisation profil.
2. **TTS / STT** côté serveur pour une vraie piste audio + scoring prononciation plus riche.
3. **Agrégation automatique** des `MistakeEntry` à partir des `feedbackJson` (script batch ou tool call).
4. **SRS complet** : algorithme SM-2 sur `FlashcardState` + rappels push/email.
5. **Évaluation speaking** : enregistrement audio + durée, métriques WPM, détection fillers.
6. **Admin** : import de vrais sujets blancs, gestion de contenu.
7. **Tests** : Playwright sur les parcours critiques ; tests API avec base éphémère.
8. **i18n** : basculer libellés UI EN/FR selon préférence utilisateur.

## Licence & usage TCF

Ce projet est un **outil pédagogique indépendant** ; il ne remplace pas les ressources officielles du TCF. Adaptez les barèmes et consignes à votre centre d’examen.

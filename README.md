# TCF French Coach

Application web full stack pour la préparation au **TCF Canada / TCF**, centrée sur l’objectif **B2** (expression orale et écrite, avec grammaire, compréhension et stratégie d’examen). Interface sobre, bilingue (FR + explications EN), **mode sombre**, responsive.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **PostgreSQL** via **Prisma** (compatible **Supabase** : même `DATABASE_URL`)
- **OpenAI API** pour l’agent « Exam Coach » (chat, corrections structurées JSON, plans)

## Structure du projet

```
src/
  app/                    # Pages & routes API
    api/                  # profile, chat, writing/feedback, speaking/analyze, rewrite, planner, quiz, bookmarks, mock-exam, comprehension
    .../page.tsx          # Écrans : dashboard, tutor, speaking, writing, grammar, listening, reading, planner, progress, strategy, mock-exam, history, mistakes, bookmarks, phrases
  components/
    layout/app-shell.tsx    # Navigation + thème
    ui/                     # Cartes, boutons, onglets, champs
  lib/
    agent/
      prompts.ts            # Identité agent + instructions JSON (écrit, oral, réécriture B2, plan)
      coach.ts              # Appels OpenAI
    content/                # Données seed : prompts oral/écrit, connecteurs, B1→B2, passages, grammaire
    db.ts                   # Client Prisma singleton
    session.ts              # Cookie anonyme `tcf_user_id` + création utilisateur
prisma/
  schema.prisma             # Schéma utilisateur, profil, historiques, favoris, etc.
  seed.ts                   # Utilisateur démo (optionnel)
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

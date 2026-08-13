# JEE Tracker

A simple app to log your JEE Main mock test scores and see your progress as graphs.

- **`/add`** — enter how many questions you got correct/wrong per subject (this is your "backend"/data entry)
- **`/`** — dashboard with graphs: correct/incorrect/unattempted, and your score vs your average, per subject

Scoring follows the real JEE Main scheme: MCQ = +4 correct / -1 wrong, Numerical = +4 correct / 0 wrong, no negative marking for unattempted.

---

## 1. Run it on your laptop

You need **Node.js** installed first. Download it from https://nodejs.org (choose the "LTS" version), install it like any normal program, then restart your terminal.

Then, inside this project folder, run these commands one at a time:

```bash
npm install
```
This downloads all the code libraries the app needs. Takes a minute or two.

```bash
npx prisma migrate dev --name init
```
This creates your local database file (`prisma/dev.db`) and sets up the tables. You'll only need to run this once.

```bash
npm run dev
```
This starts the app. Open **http://localhost:3000** in your browser. Go to "Add Test" to log your first mock test, then check the "Dashboard" tab.

To stop the app, go back to the terminal and press `Ctrl + C`.

---

## 2. Put it on your phone (deploy to Vercel)

Right now your data lives in a file on your laptop only. To use the app from your phone too, you deploy it to the internet and switch to a small free cloud database (Turso — it's the same SQLite you're already using, just hosted online, so no code changes needed beyond one connection string).

**Step A — Get a free cloud database (Turso)**
1. Go to https://turso.tech and sign up (free tier is plenty for this).
2. Create a new database.
3. Copy the **connection URL** and the **auth token** it gives you.

**Step B — Push your code to GitHub**
1. Create a free account at https://github.com if you don't have one.
2. Create a new repository and upload this whole project folder to it (GitHub's website has an "upload files" option — no command line needed).

**Step C — Deploy on Vercel**
1. Go to https://vercel.com and sign up with your GitHub account.
2. Click "Add New Project" and pick the repository you just uploaded.
3. Before clicking Deploy, open "Environment Variables" and add:
   - `DATABASE_URL` = the Turso URL from Step A
   - `TURSO_AUTH_TOKEN` = the auth token from Step A
4. Click **Deploy**.

Once it's live, Vercel gives you a link like `jee-tracker.vercel.app` — open that on your phone and bookmark it. Any test you add from your phone or laptop will show up on both, since they now share the same cloud database.

> Note: switching from local SQLite to Turso requires installing one extra small package (`@libsql/client`) and a two-line change to `lib/prisma.js`. If you get to this step, just paste your `lib/prisma.js` file back to Claude and ask for the Turso version — it's a quick edit.

---

## Project structure (for reference)

```
app/
  page.js              -> Dashboard (charts)
  add/page.js           -> Add Test form
  api/tests/route.js    -> Backend: list + create tests
  api/tests/[id]/route.js -> Backend: delete a test
components/
  AccuracyChart.js       -> correct/incorrect/unattempted graph
  ScoreChart.js           -> score vs average graph
lib/
  scoring.js              -> JEE marking scheme math
  prisma.js               -> database connection
prisma/
  schema.prisma           -> database structure (Test, SubjectResult)
```

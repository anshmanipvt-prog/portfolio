# Ansh Mani Portfolio

A responsive React portfolio and separately deployed Express/Mongoose API. Projects, experience, achievements, profile details, and contact messages are backed by MongoDB. The initial project set contains only the four projects provided for this portfolio.

## Structure

```text
client/
  public/              favicon and robots.txt
  src/components/      shared navigation, cards, section heading, footer
  src/data/             supplied portfolio details and local project fallback
  src/pages/             portfolio and /admin dashboard
  src/services/          API client
  scripts/               deployment-aware sitemap generator
server/
  config/                environment, database and initial projects
  controllers/           API handlers
  middleware/            JWT authorization and input safety
  models/                User, Project, Experience, Achievement, Message, Profile
  routes/                API routes and validators
  scripts/               administrator account setup
  tests/                 API security and validation tests
.env.example
render.yaml
```

## Requirements

- Node.js 20 or newer
- npm
- Local MongoDB or MongoDB Atlas

## Local Setup

1. Install API dependencies: `npm install --prefix server`.
2. Install frontend dependencies: `npm install --prefix client`.
3. Copy `.env.example` to `.env` in the repository root.
4. Set `MONGO_URI` to your local or Atlas database URI.
5. Replace `JWT_SECRET` with a random value of at least 32 characters. PowerShell can generate one with `[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(48))`.
6. Keep `PORT=5000` and `CLIENT_URL=http://localhost:5173` for local development.
7. Start the API in one terminal: `npm run dev:server`.
8. Start the frontend in another terminal: `npm run dev:client`.
9. Open the Vite URL shown in the terminal. Vite proxies `/api` to the local Express service.

The API seeds the four supplied projects on first startup. Experience and achievements start empty. Contact messages are stored after MongoDB connects.

## Environment Variables

| Variable | Used by | Purpose |
| --- | --- | --- |
| `MONGO_URI` | API | MongoDB connection URI; never expose it to the browser. |
| `JWT_SECRET` | API | Secret for 8-hour administrator tokens. |
| `PORT` | API | HTTP port; Render supplies this in production. |
| `CLIENT_URL` | API | Allowed frontend origin(s), comma-separated if needed. |
| `VITE_API_URL` | Frontend build | Public API origin for deployed client builds; omit locally to use the Vite proxy. |
| `SITE_URL` | Client build | Canonical HTTPS origin for sitemap/robots generation. Vercel's `VERCEL_URL` is used when unset. |

Only `VITE_API_URL` belongs in the client environment. Never put database credentials or `JWT_SECRET` in a `VITE_` variable.

## MongoDB Atlas

1. Create an Atlas project and cluster.
2. Create an app database user with read/write access to the portfolio database.
3. Configure Network Access for your development machine and Render service. Restrict egress where your provider supports it.
4. Copy the Atlas connection URI, replace its database name and password placeholders, and set it as `MONGO_URI` in root `.env`.
5. Start the API and verify `http://localhost:5000/api/health`.

Do not commit `.env`, put credentials in source files, or use an Atlas administrator account for the application.

## Administrator Account

After MongoDB is reachable, run:

```powershell
npm --prefix server run admin:create
```

The command asks for an email and a password of at least 12 characters. Password input is hidden and stored as a bcrypt hash. No default credentials exist and public signup is disabled. Sign in at `/admin`. Use a password manager; create any additional admin only through a deliberate server-side operation.

## API

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Public, rate-limited |
| `GET` | `/api/projects` | Public |
| `POST`, `PUT`, `DELETE` | `/api/projects` and `/api/projects/:id` | Admin JWT |
| `GET` | `/api/experience` | Public |
| `POST`, `PUT`, `DELETE` | `/api/experience` and `/api/experience/:id` | Admin JWT |
| `GET` | `/api/achievements` | Public |
| `POST`, `PUT`, `DELETE` | `/api/achievements` and `/api/achievements/:id` | Admin JWT |
| `POST` | `/api/contact` | Public, validated and rate-limited |
| `GET`, `DELETE` | `/api/contact` and `/api/contact/:id` | Admin JWT |
| `GET` | `/api/profile` | Public |
| `PUT` | `/api/profile` | Admin JWT |
| `GET` | `/api/health` | Public |

Contact submissions are limited to 5 per IP per 15 minutes. API traffic and login attempts have separate limits. The service also enables validation, CORS allowlisting, Helmet headers, JWT role checks, password hashing, Mongo operator-key rejection, and a bounded JSON body size.

## Tests and Production Build

```powershell
npm --prefix server test
npm run build
```

Automated HTTP tests cover health, JWT authorization, roles, contact validation, and Mongo operator rejection without a database. Persistence, admin creation, and the contact-to-Mongo flow still need a smoke test against a configured database before launch.

## GitHub

Create an empty repository on GitHub. From this folder, connect and push using the repository URL GitHub provides:

```powershell
git init
git add .
git commit -m "Build Ansh Mani portfolio"
git branch -M main
git remote add origin <your-github-repository-url>
git push -u origin main
```

The project does not initialize or push a repository automatically. Confirm `.env` is ignored before committing.

## Deploy the API to Render

1. Push the source to GitHub and create a Render Blueprint from the repository.
2. `render.yaml` sets `server/` as the root, `npm install` as the build command, `npm start` as the start command, and `/api/health` as the health check.
3. In Render, set `MONGO_URI` to the Atlas app-user URI and `CLIENT_URL` to the exact Vercel production origin. Add preview origins only when you intend to allow them.
4. Keep Render's generated `JWT_SECRET`; Render supplies `PORT` automatically.
5. Create the admin using `npm run admin:create` from the server shell with production environment access, or create the first account locally against the production database before disabling local access.
6. Verify the Render health URL returns `{"status":"ok"}`.

Never put Atlas credentials or admin passwords in `render.yaml` or GitHub.

## Deploy the Frontend to Vercel

1. Import the GitHub repository and set Vercel's project root directory to `client`.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Set `VITE_API_URL` to the Render service origin shown in its dashboard. This is public and must not contain secrets.
4. Optionally set `SITE_URL` to the canonical HTTPS domain. If unset, the build uses Vercel's `VERCEL_URL` to generate `sitemap.xml` and `robots.txt`.
5. Add the Vercel production origin to Render's `CLIENT_URL`, redeploy the API, and test contact submission and admin login against the production stack.

The Vercel rewrite supports direct navigation and refresh at `/admin`. Deploy the frontend, API, and Atlas database separately; database credentials must never reach Vercel.

## Resume and Content Updates

Sign in at `/admin` to edit selected profile fields and the resume URL, manage projects, add experience or achievements, and view/delete messages. The page previews a resume URL and offers open/download actions. Upload a PDF to a storage provider you control and enter its HTTPS URL; this application does not upload files. The public site keeps empty states until resume, experience, and achievement content is added.

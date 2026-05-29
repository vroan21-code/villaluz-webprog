# Vercel deployment guide (Villaluz)

You need **two Vercel projects** from the same GitHub repo.

---

## Before you deploy

### MongoDB Atlas

1. **Network Access** → add `0.0.0.0/0` (Allow access from anywhere) for Vercel.
2. Keep your home IP entry if you want local access too.
3. **Database Access** → user with password for `MONGO_URI`.
4. Database name in URI: `/webprog`

### GitHub

- Push `villaluz-client` and `villaluz-server` only.
- Never commit `.env` (secrets).
- Use `env.template` files as a reference.

```powershell
cd Villaluz-webprog
git add villaluz-client villaluz-server DEPLOYMENT.md .gitignore
git commit -m "Prepare for Vercel deployment"
git push origin production
```

---

## Project 1 — Server (API)

| Setting | Value |
|--------|--------|
| Repository | `villaluz-webprog` |
| Branch | `production` (or your branch) |
| **Root Directory** | `villaluz-server` |
| Framework | Other |
| Build Command | *(leave empty)* |
| Output Directory | *(leave empty)* |
| Install Command | `npm install` |

### Environment variables (server)

| Name | Value |
|------|--------|
| `MONGO_URI` | Full Atlas connection string with `/webprog` |
| `JWT_SECRET` | Your secret (same as local) |
| `NODE_ENV` | `production` |

Deploy → copy URL, e.g. `https://villaluz-webprog-server.vercel.app`

### Test after deploy

| URL | Expected |
|-----|----------|
| `/` | `Cannot GET /` |
| `/api/health` | `{"ok":true,...}` |
| `/api/users` | `{"users":[...]}` |

---

## Project 2 — Client (React)

| Setting | Value |
|--------|--------|
| Repository | `villaluz-webprog` |
| Branch | `production` |
| **Root Directory** | `villaluz-client` |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### Environment variables (client)

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://YOUR-SERVER-URL.vercel.app/api` |

**Redeploy** the client after setting `VITE_API_URL`.

---

## Local development

**Server** — copy `villaluz-server/env.template` → `.env` and fill in values.

```powershell
cd villaluz-server
npm install
npm run dev
```

**Client** — copy `villaluz-client/env.template` → `.env`.

```powershell
cd villaluz-client
npm install
npm run dev
```

---

## Troubleshooting

| Problem | Fix |
|--------|-----|
| Serverless Function crashed | Vercel → server → **Logs**. Usually missing `MONGO_URI` or Atlas IP not `0.0.0.0/0`. |
| Client can't load users/articles | Wrong `VITE_API_URL` or client not redeployed after env change. |
| Image upload fails on production | Vercel storage is temporary; seeded `/public` images still work. |

---

## Files not needed on Vercel

These stay in the repo for local use only:

- `seed.js` — run locally: `npm run seed`
- `env.template` — reference only
- `node_modules/` — installed by Vercel during build

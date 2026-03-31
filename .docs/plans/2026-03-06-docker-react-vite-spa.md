# React + Vite + TypeScript SPA Docker Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan.

**Goal:** Build and run the Vite-built React SPA in a small, reproducible Docker image served by Nginx with correct React Router v6 SPA deep-link routing.

**Architecture:** Multi-stage Docker build compiles the SPA (`npm run build`) in a Node Alpine builder stage, then copies the static `dist/` output into an Nginx Alpine runtime stage. Nginx is configured with `try_files ... /index.html` so all non-asset routes resolve to the SPA entry.

**Tech Stack:** React 18, TypeScript, Vite 5, Nginx (Alpine), Docker, docker compose.

---

## Files To Create / Modify

**Create:**
- `.dockerignore`
- `Dockerfile`
- `docker-compose.yml`
- `nginx/default.conf`

**Modify:**
- `README.md` (add Docker build/run instructions)

---

## Task 1: Add `.dockerignore`

**Files:**
- Create: `.dockerignore`

**Step 1: Write the file**

Create `.dockerignore`:

```gitignore
# Dependencies
node_modules

# Build output
dist

# Vite cache
.vite

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS / editor
.DS_Store
Thumbs.db
.vscode
.idea

# Git
.git
.gitignore

# Docs / misc (optional but keeps context small)
*.md
!README.md

# Env files (never bake secrets into images)
.env
.env.*
```

**Step 2: Verify `.dockerignore` is picked up**

Run:

```bash
docker build -t prototype-spa:ignore-check .
```

Expected: build succeeds; build context is small (Docker prints `Sending build context to Docker daemon ...`).

---

## Task 2: Add Nginx SPA routing config

**Files:**
- Create: `nginx/default.conf`

**Step 1: Write the file**

Create `nginx/default.conf`:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # Serve static assets directly (cacheable)
  location ~* \.(?:css|js|mjs|map|json|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$ {
    expires 7d;
    add_header Cache-Control "public, max-age=604800, immutable";
    try_files $uri =404;
  }

  # SPA fallback: any other route -> index.html
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

**Step 2: Verify config syntax inside an Nginx container**

Run:

```bash
docker run --rm -v %cd%/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro nginx:1.27-alpine nginx -t
```

Expected: `syntax is ok` and `test is successful`.

---

## Task 3: Add production Dockerfile (multi-stage)

**Files:**
- Create: `Dockerfile`

**Step 1: Write the file**

Create `Dockerfile`:

```dockerfile
# syntax=docker/dockerfile:1

FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the project and build
COPY . .
RUN npm run build


FROM nginx:1.27-alpine AS runtime

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# SPA routing
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Default Nginx CMD from base image
```

**Step 2: Build the image**

Run:

```bash
docker build -t prototype-spa:local .
```

Expected: succeeds; last stage is `nginx:1.27-alpine`.

---

## Task 4: Add `docker-compose.yml`

**Files:**
- Create: `docker-compose.yml`

**Step 1: Write the file**

Create `docker-compose.yml`:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    restart: unless-stopped
```

**Step 2: Start via compose**

Run:

```bash
docker compose up --build -d
```

Expected: service `web` is `Up`.

---

## Task 5: Update `README.md` with Docker instructions

**Files:**
- Modify: `README.md`

**Step 1: Add a Docker section**

Append (or insert near “快速開始”) this section to `README.md`:

```md
## Docker 部署（內部展示/測試用）

### 方式 A：docker compose（建議）

建置並啟動：

```bash
docker compose up --build -d
```

開啟：`http://localhost:8080`

停止：

```bash
docker compose down
```

### 方式 B：docker build / docker run

```bash
docker build -t prototype-spa:local .
docker run --rm -p 8080:80 prototype-spa:local
```

開啟：`http://localhost:8080`

### React Router SPA 路由驗證

直接開啟任一路由（例如 `http://localhost:8080/projects/123`）應該仍能載入頁面，而非 404。
```

**Step 2: Quick sanity check formatting**

Open `README.md` and ensure the code fences are balanced and render correctly.

---

## Task 6: Verification checklist (local)

**Files:**
- Verify: `.dockerignore`, `Dockerfile`, `docker-compose.yml`, `nginx/default.conf`, `README.md`

**Step 1: Ensure app builds locally (non-Docker)**

Run:

```bash
npm run build
```

Expected: exits 0; `dist/` is generated.

**Step 2: Start container and verify homepage**

Run:

```bash
docker compose up --build -d
```

Expected: `http://localhost:8080` serves the SPA.

**Step 3: Verify deep-link routing (SPA fallback)**

Option A (browser): open a nested route that React Router handles (e.g. `/redlight`, `/projects/1`) and refresh; it should still load.

Option B (curl):

```bash
curl -i http://localhost:8080/some/non-asset/route
```

Expected: HTTP 200 and response body contains the SPA HTML (`<div id=\"root\">` or similar), not an Nginx 404 page.

**Step 4: Verify assets still 404 correctly when missing**

Run:

```bash
curl -i http://localhost:8080/assets/does-not-exist.js
```

Expected: HTTP 404.

**Step 5: Stop**

Run:

```bash
docker compose down
```

---

## Notes / Common Adjustments

1) Serving under a sub-path (optional): if you deploy under `/demo/` instead of `/`, set Vite `base` and adjust Nginx (keep SPA fallback under that prefix). For internal demo on localhost root, no change is needed.

2) Port conflicts: if `8080` is in use, change compose mapping to something else (e.g. `"8090:80"`).

3) Image size: the runtime image is only Nginx + static files; Node is not included in the final image.

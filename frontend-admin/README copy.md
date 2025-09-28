# Frontend - Kementerian Haji dan Umrah App

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## 🚀 Quick Start dengan Docker

```bash
# 1. Pastikan file .env ada
cp .env.example .env

# 2. Edit file .env sesuai kebutuhan
# API_BASE_URL=http://localhost:8000/api
# API_BPH_URL=http://localhost:8000/bph

# 3. Build dan jalankan aplikasi
docker-compose up --build

# 4. Akses aplikasi di http://localhost:3000
```

### Perintah Docker Lainnya

```bash
# Jalankan di background
docker-compose up -d --build

# Stop aplikasi
docker-compose down

# Lihat logs
docker-compose logs -f
```

## Development (Lokal)

### Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

### Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

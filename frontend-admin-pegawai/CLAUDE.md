# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SuperApp is a monorepo for Kementerian Haji dan Umrah (Indonesian Ministry of Hajj and Umrah) containing:
- **backend/** - Node.js/Express API server with Prisma ORM
- **frontend/** - Main Nuxt 4 app (employee/user-facing, PWA)
- **frontend-admin/** - Admin dashboard (Nuxt 4, Keycloak SSO)
- **frontend-admin-pegawai/** - Employee attendance admin (Nuxt 4, local auth)

## Development Commands

### Frontend Apps (frontend-admin-pegawai, frontend-admin, frontend)
```bash
npm run dev        # Start Nuxt dev server (port 3000)
npm run build      # Build for production
npm run generate   # Generate static site
npm run preview    # Preview production build
```

### Backend
```bash
npm run dev           # Start with nodemon
npm run dev:consumer  # Run Kafka consumer mode
npm run start         # Production API
npm run start:consumer # Production consumer
npm run test          # Run all tests (Jest)
npm run test:watch    # Tests in watch mode
npm run test:coverage # Generate coverage
npm run test:unit     # Unit tests only
npm run test:integration # Integration tests
npm run prisma        # Prisma CLI
npm run seed          # Seed database
npm run lint:fix      # Fix ESLint issues
```

## Technology Stack

### Frontend
- **Nuxt 4** with Vue 3 Composition API
- **@nuxt/ui v3** - Component library (based on Tailwind)
- **TypeScript**
- **Tailwind CSS** - Custom teal theme (#019eab)
- **Keycloak** (frontend-admin) or cookie-based auth (frontend-admin-pegawai)

### Backend
- **Express.js 5.1** with Node.js
- **Prisma 6.16** ORM with PostgreSQL
- **Kafka** for event streaming
- **JWT** authentication with Keycloak integration
- **AWS S3/MinIO** for file storage

## Architecture

### Frontend Structure (frontend-admin-pegawai)
```
app/
├── composables/      # Business logic (useAuth, useServiceBphapi, etc.)
├── pages/            # File-based routing
├── components/
│   ├── global/       # Reusable (ModalComponent, DataTableComponent)
│   └── dashboard/    # Layout components (Topbar, Sidebar)
├── middleware/       # auth.global.js - route protection
├── layouts/          # default.vue, auth.vue
└── constants/        # text.js - Indonesian UI strings
```

### Backend Structure
```
src/
├── controllers/      # Route handlers
├── routes/           # API route definitions
├── middleware/       # Auth, validation
├── models/           # Data access layer
├── consumers/        # Kafka event handlers
└── utils/            # JWT, Storage, Response helpers
prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations
```

## API Patterns

### Frontend API Composables
All API calls follow this pattern in `/app/composables/useService*.js`:
```javascript
const { token, logout } = useAuth()
const config = useRuntimeConfig()

const apiCall = async (data) => {
  return $fetch(`${config.public.apiBaseUrl}/endpoint`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token.value}` },
    body: data
  }).catch((error) => {
    if (error?.status === 403) logout()
    throw error
  })
}
```

### Key API Endpoints (Presensi API)
Base: `{{baseUrl}}/presensi/v1`

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/users/login` | POST | None | Login → `{ token }` |
| `/users` | GET/POST | Bearer | List/Create users |
| `/users/:id` | GET/PUT/DELETE | Bearer | User CRUD |
| `/kantor` | GET | None | Get offices (satker) |
| `/kehadiran/rekap-satker` | GET | Bearer | Attendance recap |
| `/izin` | GET/PUT | Bearer | Leave management |
| `/pegawai` | GET | Bearer | Employee data |

## Authentication

### frontend-admin-pegawai (Current Focus)
- **Cookie-based auth** with `useAuth()` composable
- Cookies: `auth_user`, `auth_token`, `auth_token_created_at`
- Roles: `admin_pusat` (super admin), `admin_satker` (office admin)
- Token expiration: 8 hours (tracked by creation timestamp)
- Global middleware protects all routes except `/auth/login`

### frontend-admin
- **Keycloak SSO** integration via `keycloak-js`
- Plugin at `/app/plugins/keycloak.client.js`
- PKCE flow enabled

## Role-Based Access

| Feature | admin_pusat | admin_satker |
|---------|-------------|--------------|
| User Management | Full CRUD | No access |
| Attendance Recap | All satker | Own satker only |
| Leave Approval | All | Own satker only |

## Environment Variables

### Frontend
```
API_BASE_URL=         # Main API base URL
API_BPH_URL=          # BPHAPI endpoint
API_MASTER_DATA_URL=  # Master data service
API_SUPER_APP_URL=    # Super app service
API_PERSURATAN_URL=   # Correspondence service
```

### Backend
```
DATABASE_URL=         # PostgreSQL connection
PORT=3000             # API port
JWT_SECRET=           # JWT signing key
KAFKA_BROKERS=        # Kafka broker addresses
```

## UI Components (Nuxt UI v3)

Common components from `@nuxt/ui`:
- `UButton`, `UInput`, `USelect` - Form elements
- `UIcon` - Icons (use `ph:*` Phosphor icons)
- `UTable` - Data tables

Custom global components at `/app/components/global/`:
- `ModalComponent` - Modal dialogs with slots
- `ModalConfirmComponent` - Confirmation dialogs
- `DataTableComponent` - Enhanced table with pagination
- `PaginationComponent` - Standalone pagination

## Conventions

- **Language**: Indonesian for UI text (see `/app/constants/text.js`)
- **Naming**: camelCase for JS, PascalCase for Vue components
- **API errors**: 401/403 triggers automatic logout
- **Toast notifications**: Use `useToast()` for user feedback
- **Form validation**: Inline with error state in `formErrors` ref

## Database (Prisma)

Key models: `User`, `UserSuperApp`, `Pegawai`, `Kantor`, `Kehadiran`, `Izin`

Run migrations:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

## Docker

```bash
docker-compose up -d   # Start all services
```

Services: PostgreSQL, Backend API, Frontend apps

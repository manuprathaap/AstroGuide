# AstroGuide — Frontend Angular Architecture

Welcome to the **AstroGuide** frontend documentation. This guide details how the Angular application is structured, how authentication and language selection work, and how the client communicates seamlessly with the FastAPI backend.

---

## 1. High-Level Architecture

The frontend follows a modern, decoupled architecture where Angular connects **exclusively** to the FastAPI REST API:

```
┌─────────────────────────────────────────────────────────────┐
│                      Angular Frontend                       │
│  (Standalone Components, Signals, Reactive Forms, SCSS)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │  HttpClient + RxJS
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       Auth Interceptor                      │
│        (Attaches `Authorization: Bearer <access_token>`)    │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │  HTTP / JSON
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       FastAPI Backend                       │
│                  (http://127.0.0.1:8000/api/v1)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │  SQLAlchemy ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                        MySQL Database                       │
└─────────────────────────────────────────────────────────────┘
```

> **Security Rule**: Angular never communicates directly with MySQL or handles raw database queries. All persistent data flows strictly through validated FastAPI REST endpoints.

---

## 2. Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                        # Core singletons and business rules
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts        # Protects private routes (/language, /dashboard)
│   │   │   │   └── guest.guard.ts       # Redirects logged-in users away from /auth/*
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts  # Adds JWT header and catches 401s
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts        # AuthResponse, LoginRequest, RegisterRequest
│   │   │   │   ├── user.model.ts        # User profile interface
│   │   │   │   └── language.model.ts    # Language and update language interfaces
│   │   │   └── services/
│   │   │       ├── auth.service.ts      # Authentication, signals state, and JWT storage
│   │   │       ├── language.service.ts  # Languages fetching and language patching
│   │   │       └── user.service.ts      # User state helper service
│   │   │
│   │   ├── features/                    # Feature modules (views & pages)
│   │   │   ├── landing/                 # Public landing page with hero & celestial preview
│   │   │   ├── auth/
│   │   │   │   ├── login/               # Sign in page with validation & show/hide password
│   │   │   │   └── register/            # Sign up page with password matching
│   │   │   ├── language/
│   │   │   │   └── language-selection/  # Language grid loaded from GET /languages
│   │   │   └── dashboard/               # Member dashboard with upcoming astrology modules
│   │   │
│   │   ├── shared/                      # Reusable components across features
│   │   │   └── components/
│   │   │       ├── navbar/              # Responsive navbar with drawer & auth context
│   │   │       └── footer/              # Celestial footer with links & disclaimer
│   │   │
│   │   ├── app.config.ts                # Application configuration & providers
│   │   ├── app.routes.ts                # Route definitions & guards
│   │   ├── app.ts                       # Root standalone shell
│   │   ├── app.html                     # Root template (<router-outlet>)
│   │   └── app.scss                     # Host styles
│   │
│   ├── environments/
│   │   ├── environment.ts               # Development API URL
│   │   └── environment.production.ts    # Production API configuration
│   │
│   ├── styles.scss                      # AstroGuide design tokens, palette & utilities
│   └── index.html                       # HTML shell with Google Fonts preconnect
└── docs/
    └── frontend/
        └── angular-architecture.md      # This document
```

---

## 3. Brand & Visual Design System

AstroGuide uses a celestial, modern, mystical theme built entirely with SCSS variables and vanilla CSS tokens in `src/styles.scss`:

| Token | Hex / Value | Usage |
| :--- | :--- | :--- |
| `--bg-primary` | `#0B1020` | Deep cosmic canvas background |
| `--bg-secondary` | `#121A2F` | Sub-surfaces & mobile navigation drawer |
| `--bg-card` | `#17213A` | Glassmorphic cards & container surfaces |
| `--color-gold` | `#D4AF37` | Celestial gold accents, primary buttons & logos |
| `--color-gold-highlight` | `#F4D77D` | Golden glow highlights & active links |
| `--color-white` | `#FFFFFF` | Primary headings & high-emphasis text |
| `--text-secondary` | `#AAB3C5` | Body copy & subtext |
| `--text-muted` | `#737D93` | Captions, dates, & placeholders |
| `--color-success` | `#4CAF7D` | Success alerts & active badges |
| `--color-error` | `#E05A67` | Validation errors & failure alerts |
| `--border-subtle` | `rgba(255, 255, 255, 0.10)` | Card borders & dividers |
| `--border-gold` | `rgba(212, 175, 55, 0.35)` | Interactive highlighted card borders |

---

## 4. Authentication Flow

### New User Registration & Onboarding
```
[ Landing Page (/) ]
         │
         ▼
[ Register (/auth/register) ]
         │  POST /api/v1/auth/register { full_name, email, password }
         ▼
[ Login (/auth/login) ]
         │  POST /api/v1/auth/login { email, password }
         │  Receives: { access_token, token_type: "bearer" }
         │  Saves access_token in localStorage
         ▼
[ Query User State ]
         │  GET /api/v1/auth/me (Bearer Token)
         ▼
   Does user have `language_id`?
       ├── NO  ──► [ Language Selection (/language) ]
       │                │  PATCH /api/v1/users/me/language { language_id }
       │                ▼
       └── YES ─► [ Dashboard (/dashboard) ]
```

### Returning User Login
```
[ Login (/auth/login) ]
         │  POST /api/v1/auth/login
         │  Save access_token
         ▼
[ GET /api/v1/auth/me ]
         │  language_id exists
         ▼
[ Dashboard (/dashboard) ]
```

### Sign Out (Logout)
```
[ Any Page / Dashboard ]
         │  Click "Sign Out"
         ▼
[ AuthService.logout() ]
         ├── Removes `access_token` from localStorage
         ├── Clears `currentUser` signal
         └── Navigates to `/auth/login`
```

---

## 5. Security & HTTP Interceptor

### Bearer Token Injection
In `core/interceptors/auth.interceptor.ts`, an Angular `HttpInterceptorFn` intercepts all outgoing requests:
1. It inspects `localStorage` for `access_token`.
2. If present, it clones the request with:
   ```http
   Authorization: Bearer <access_token>
   ```
3. If absent, the request proceeds unmodified.

### Graceful 401 Handling
If any authenticated API call fails with HTTP status `401 Unauthorized`:
- The interceptor automatically removes the invalid or expired `access_token`.
- If the user is on a protected route, it redirects them to `/auth/login` with an informative message (`Session expired. Please sign in again.`).
- Redirect loops are prevented by checking if the current URL is already an auth route.

---

## 6. Route Protection & Guards

- **`authGuard`** (`core/guards/auth.guard.ts`): Protects `/language` and `/dashboard`. If the user does not possess a valid JWT in storage, they are redirected to `/auth/login` with a `returnUrl` query parameter.
- **`guestGuard`** (`core/guards/guest.guard.ts`): Prevents already authenticated users from seeing `/auth/login` or `/auth/register`. If logged in, they are immediately redirected to `/dashboard`.

---

## 7. Dynamic Language Selection & Dashboard Display Flow

The language list is **never hardcoded**, and the full lifecycle connects user selection, database persistence, and dashboard display:

```
Language Selection (/language)
       ↓
PATCH /api/v1/users/me/language  (payload: { language_id: Malayalam ID })
       ↓
Database (MySQL)
users.language_id = Malayalam ID
       ↓
Dashboard (/dashboard)
       ↓
GET /api/v1/auth/me
       ↓
user.language_id
       ↓
GET /api/v1/languages
       ↓
Find matching language (langs.find(l => l.id === user.language_id))
       ↓
Display "Malayalam"
  • Active Language Pill: 🌐 Malayalam
  • Member Profile Bar: Language Preference = Malayalam
  • Global Navbar Pill: 🌐 Malayalam
```

1. When `/language` loads, `LanguageSelectionComponent` executes `GET /api/v1/languages`.
2. The UI renders available languages with native script names (e.g. English, മലയാളം, हिन्दी, தமிழ், etc.) and English names.
3. Upon selecting a language (e.g., Malayalam, id: 2) and clicking **Continue**:
   - `PATCH /api/v1/users/me/language` is executed with `{ language_id: 2 }`.
   - The backend database updates `users.language_id = 2`.
   - `LanguageService.currentLanguage` is populated and user state is synchronized.
   - The user is routed to `/dashboard`.
4. On `/dashboard`:
   - `GET /api/v1/auth/me` fetches the authenticated profile with `language_id`.
   - `GET /api/v1/languages` retrieves the language master list.
   - The component finds the matching language entity matching `user.language_id`.
   - It sets `currentLanguageName` to `matched.name` to display **"Malayalam"** in the topbar pill, profile summary, and global navbar.


---

## 8. Development & Build Commands

### Start Development Server
```bash
npm start
# or
ng serve
```
The Angular application will be accessible at: `http://localhost:4200`

### Build Production Bundle
```bash
npm run build
# or
ng build
```
The compiled assets will be output to `dist/frontend/browser/`.

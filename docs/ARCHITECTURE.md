# Arquitectura Técnica

Documento que describe las decisiones arquitectónicas del proyecto UPMINA Web.

---

## 🎯 Principios rectores

1. **Seguridad primero**: los secretos nunca tocan el cliente.
2. **Simplicidad operativa**: mínimo de servicios externos que mantener.
3. **Escalabilidad horizontal**: serverless y bases de datos gestionadas.
4. **Modularidad**: cada integración externa es reemplazable sin romper el resto.
5. **Performance**: caché agresiva y carga diferida de contenido pesado.

---

## 🏛️ Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVEGADOR                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         SPA React + Vite + TypeScript                  │  │
│  │  - TanStack Query (fetch + caché)                      │  │
│  │  - HeroUI + Tailwind (UI)                               │  │
│  │  - Zustand (estado de UI)                               │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────┬────────────────────┘
               │                          │
               │ fetch                    │ fetch
               ▼                          ▼
┌──────────────────────────┐   ┌──────────────────────────────┐
│   VERCEL FUNCTIONS        │   │   SUPABASE (directo)          │
│   /api/twitch-status      │   │   - Auth                      │
│   /api/twitch-clips       │   │   - Postgres                  │
│   /api/youtube-latest     │   │   - Storage                   │
│   /api/youtube-videos     │   │   - Realtime                  │
│   /api/instagram-feed     │   └──────────────────────────────┘
│   /api/tiktok-videos      │
└────┬───────┬────────┬─────┘
     │       │        │
     ▼       ▼        ▼
┌────────┐ ┌──────────┐ ┌──────────┐
│ Twitch │ │ YouTube  │ │Instagram │
│ Helix  │ │Data API  │ │ Graph    │
└────────┘ └──────────┘ └──────────┘
                              │
                              ▼
                        ┌──────────┐
                        │  TikTok  │
                        │ Display  │
                        └──────────┘
```

---

## 🔐 Gestión de secretos

| Secreto | Dónde vive | Quién lo usa |
|---|---|---|
| Twitch Client Secret | Vercel Env Vars | `api/twitch-*` |
| YouTube API Key | Vercel Env Vars | `api/youtube-*` |
| Instagram Access Token | Vercel Env Vars | `api/instagram-feed` |
| TikTok Client Secret | Vercel Env Vars | `api/tiktok-videos` |
| Supabase Service Role Key | Vercel Env Vars | Funciones admin |
| Supabase Anon Key | Cliente (`VITE_*`) | Solo para RLS |

**Regla de oro:** cualquier secreto con capacidad de escritura o que represente
a la app ante una plataforma externa vive SOLO en el backend.

---

## 📡 Flujo de datos por integración

### Twitch
1. Cliente → `GET /api/twitch-status`
2. Vercel Function → Twitch Helix (`/streams?user_login=upminaa`)
3. Twitch responde → Function → Cliente

**Por qué el proxy:** Twitch aplica CORS estricto y exige que el token de app
no viaje al navegador.

### YouTube
1. Cliente → `GET /api/youtube-latest` (último video)
2. Cliente → `GET /api/youtube-videos?maxResults=12` (lista)
3. Vercel Function → YouTube Data API v3 (`/playlistItems` + `/videos`)
4. Function transforma y devuelve JSON limpio → Cliente

**Por qué el proxy:** la API Key consume cuota y no debe exponerse en el bundle.
Además se normalizan los datos (ISO 8601 → formato legible) en el servidor.

**Caché:** Edge `s-maxage=900` + TanStack `staleTime=900000`. Reduce el consumo
de cuota de 10,000 uds/día a un valor insignificante.

### Instagram
1. Cliente → `GET /api/instagram-feed`
2. Vercel Function → Graph API (`/{ig-user-id}/media`)
3. Graph API responde con URLs firmadas (expiran en ~24h)
4. Function devuelve JSON limpio → Cliente

**Por qué el proxy:** evitar exponer el token de 60 días en el bundle.

### TikTok
1. Cliente → `GET /api/tiktok-videos`
2. Vercel Function → Display API (`/v2/video/list/`)
3. Function mapea IDs → URLs públicas
4. Cliente usa `TikTokEmbed` (oEmbed) para renderizar

**Por qué el proxy:** el access token caduca en 24h y se renueva con refresh
token desde el backend.

### Enlaces sociales

Los enlaces a YouTube, Instagram, TikTok y Reddit son enlaces externos
estáticos renderizados en el Footer. No requieren integración API ni secretos.

---

## 🗄️ Esquema de base de datos (Supabase)

```sql
-- Perfiles públicos (extiende auth.users)
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamptz default now()
);

-- Edits subidos por la comunidad
create table edits (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  video_path text not null,
  thumbnail_path text,
  status text default 'pending' check (status in ('pending','approved','rejected')),
  moderation_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Votos (uno por usuario por edit)
create table votes (
  user_id uuid references profiles(id) on delete cascade,
  edit_id uuid references edits(id) on delete cascade,
  value smallint check (value in (-1, 1)),
  created_at timestamptz default now(),
  primary key (user_id, edit_id)
);

-- Reportes de contenido inapropiado
create table reports (
  id uuid primary key default gen_random_uuid(),
  edit_id uuid references edits(id) on delete cascade,
  reporter_id uuid references profiles(id) on delete set null,
  reason text not null,
  resolved boolean default false,
  created_at timestamptz default now()
);
```

### Row-Level Security (ejemplos)

```sql
alter table edits enable row level security;

create policy "edits públicos solo si aprobados"
  on edits for select
  using (status = 'approved' or auth.uid() = author_id or is_moderator(auth.uid()));

create policy "usuarios pueden insertar sus propios edits"
  on edits for insert
  with check (auth.uid() = author_id);

create policy "solo moderadores actualizan status"
  on edits for update
  using (is_moderator(auth.uid()));
```

---

## ⚡ Estrategia de caché

| Recurso | staleTime | refetchInterval | Motivo |
|---|---|---|---|
| Twitch status | 30s | 60s | Cambia con frecuencia |
| Twitch clips | 5min | — | Contenido semi-estático |
| YouTube latest | 15min | — | Cuota limitada |
| YouTube videos | 15min | — | Cuota limitada |
| Instagram feed | 1h | — | Rate limit estricto (200/h) |
| TikTok videos | 30min | — | Cambia con frecuencia media |
| Comunidad edits | 1min | — | Refresco tras acciones |
| Perfil usuario | 5min | — | Cambia poco |

---

## 🚀 Estrategia de despliegue

- **Preview deploys**: cada PR genera una URL única de Vercel.
- **Production**: push a `main` despliega automáticamente.
- **Variables de entorno**: separadas por entorno (Development / Preview / Production).
- **Dominio**: configurado en Vercel con HTTPS automático (Let's Encrypt).
- **Cron jobs**: Vercel Cron para renovar tokens de Instagram cada 55 días.

---

## 🧪 Testing

| Tipo | Herramienta | Cobertura objetivo |
|---|---|---|
| Unitario | Vitest | Lógica de hooks y utilidades |
| Componentes | React Testing Library | Componentes de UI |
| E2E | Playwright | Flujos críticos (login, subida, votar) |
| Tipos | TypeScript strict | 100% del código |

---

## 🔄 Decisiones arquitectónicas (ADR)

### ADR-001: Vercel Functions como proxy de APIs
**Contexto:** Twitch, YouTube, Instagram y TikTok aplican CORS y requieren secretos.
**Decisión:** usar Vercel Functions en lugar de un backend dedicado.
**Consecuencias:** menos infraestructura, pero dependencia del runtime de Vercel.

### ADR-002: Supabase en lugar de backend propio
**Contexto:** necesitamos auth, storage y DB para la comunidad.
**Decisión:** Supabase gestiona las tres cosas con RLS.
**Consecuencias:** menos código, pero acoplamiento a Supabase.

### ADR-003: SPA en lugar de SSR
**Contexto:** contenido dinámico con mucho fetching en cliente.
**Decisión:** Vite SPA. SEO no es crítico (marca personal, no ecommerce).
**Consecuencias:** más simple, pero peor SEO. Se puede migrar a Next.js si cambia.

### ADR-004: Dos endpoints separados para YouTube
**Contexto:** el hero video y la lista podrían devolverse en una sola llamada.
**Decisión:** separarlos en `/youtube-latest` y `/youtube-videos`.
**Consecuencias:** más flexibilidad (el hero puede refrescarse solo) y
mejor caché diferencial, a costa de un pequeño overhead.

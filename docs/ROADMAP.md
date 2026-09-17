# Roadmap de Desarrollo

Plan por fases desde el setup hasta el lanzamiento público.

---

## 🎯 Fase 0 — Fundaciones (Semana 1)

**Objetivo:** Tener el esqueleto del proyecto funcionando.

- [ ] Crear repositorio y estructura de carpetas
- [ ] Configurar Vite + React + TypeScript
- [ ] Configurar Tailwind + HeroUI
- [ ] Definir design tokens (colores, tipografía, espaciados)
- [ ] Configurar ESLint + Prettier + Husky
- [ ] Configurar Vitest + Playwright
- [ ] Crear layout base (Header, Footer, contenedor)
- [ ] Deploy inicial a Vercel

**Entregable:** URL con landing estática de la marca.

---

## 🎯 Fase 1 — Integración Twitch (Semana 2)

**Objetivo:** Módulo live y clips completos.

- [ ] Registrar app en Twitch Developer Console
- [ ] Implementar `api/twitch-status.ts`
- [ ] Implementar `api/twitch-clips.ts`
- [ ] Crear hook `useTwitchStatus`
- [ ] Crear componente `<LiveBadge>`
- [ ] Integrar `<TwitchPlayer>` cuando esté online
- [ ] Crear `<ClipGrid>` con los últimos 6 clips
- [ ] Manejo de errores y estado offline

**Entregable:** Sección Twitch funcional con datos reales.

---

## 🎯 Fase 2 — Integración Instagram (Semana 3)

**Objetivo:** Feed visual de Instagram integrado.

- [ ] Verificar cuenta Business/Creator de UPMINA
- [ ] Crear app en Meta for Developers
- [ ] Implementar `api/instagram-feed.ts`
- [ ] Crear hook `useInstagramFeed`
- [ ] Crear componente `<InstagramGrid>`
- [ ] Distinguir visualmente reels vs fotos
- [ ] Configurar cron de renovación de token

**Entregable:** Grid de Instagram con contenido reciente.

---

## 🎯 Fase 3 — Integración YouTube (Semana 3.5)

**Objetivo:** Hero video + grid de videos anteriores.

- [ ] Crear proyecto en Google Cloud Console
- [ ] Habilitar YouTube Data API v3
- [ ] Generar API Key y restringirla al dominio
- [ ] Implementar `api/youtube-latest.ts`
- [ ] Implementar `api/youtube-videos.ts`
- [ ] Crear hook `useYouTubeVideos`
- [ ] Crear componente `<HeroVideo>` con reproductor grande
- [ ] Crear componente `<VideoGrid>` con cards clicables
- [ ] Crear componente `<VideoCard>` con miniatura y metadata
- [ ] Implementar estado compartido `selectedVideoId`
- [ ] Parsear duración ISO 8601 a formato legible
- [ ] Configurar caché de 15 minutos

**Entregable:** Sección YouTube con hero video y lista funcional.

---

## 🎯 Fase 4 — Integración TikTok (Semana 4)

**Objetivo:** Videos de TikTok embebidos.

- [ ] Crear app en TikTok Developer Portal
- [ ] Implementar flujo OAuth (una vez autorizado)
- [ ] Implementar `api/tiktok-videos.ts`
- [ ] Crear hook `useTikTokVideos`
- [ ] Crear `<TikTokGrid>` con oEmbed
- [ ] Configurar refresh de tokens

**Entregable:** Cuadrícula de videos de TikTok.

---

## 🎯 Fase 5 — Comunidad (Semanas 5-7)

**Objetivo:** Sistema completo de subida y votación de edits.

- [ ] Crear proyecto en Supabase
- [ ] Definir tablas, RLS y storage buckets
- [ ] Implementar auth (email + Discord OAuth)
- [ ] Crear flujo de subida de edits
- [ ] Implementar sistema de votos
- [ ] Crear feed público con filtros (recientes, top semanal)
- [ ] Crear perfil de usuario público
- [ ] Crear página de ajustes de perfil

**Entregable:** Comunidad funcional con contenido real de usuarios.

---

## 🎯 Fase 6 — Moderación (Semana 8)

**Objetivo:** Herramientas para mantener la comunidad sana.

- [ ] Panel de moderación (`/moderation`)
- [ ] Vista de edits pendientes
- [ ] Aprobación / rechazo con nota
- [ ] Sistema de reportes de usuarios
- [ ] Log de acciones de moderación
- [ ] Roles y permisos

**Entregable:** Panel de moderación operativo.

---

## 🎯 Fase 7 — Pulido y lanzamiento (Semana 9)

**Objetivo:** Preparar para producción.

- [ ] Optimización de imágenes (next-gen formats)
- [ ] Lazy loading de iframes y videos
- [ ] Auditoría de accesibilidad (WCAG AA)
- [ ] SEO on-page (meta tags, Open Graph)
- [ ] Tests E2E de flujos críticos
- [ ] Documentación final
- [ ] Contacto con UPMINA / management para autorización

**Entregable:** Web lista para presentar a la creadora.

---

## 🔮 Post-lanzamiento (Backlog)

- Notificaciones por email de "está en vivo"
- Multi-idioma (ES / EN / DE)
- PWA con soporte offline
- Chat de Twitch embebido
- Rankings semanales con premios
- Dashboard de analytics para la creadora
- Integración con Discord (roles automáticos)

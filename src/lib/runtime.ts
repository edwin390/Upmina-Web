// Modo demo explícito y global: cuando está activo, todas las
// integraciones (Twitch, YouTube, Instagram, TikTok) devuelven datos mock
// en vez de golpear sus respectivas APIs. Pensado para mostrar el sitio
// (p. ej. a UPMINA/management, Fase 7 del roadmap) sin depender de cuotas,
// tokens o disponibilidad de ninguna API externa.
//
// Importante: esto es independiente de si Supabase está configurado. La
// disponibilidad de Supabase se verifica por separado con
// `isSupabaseConfigured` / `supabase === null` en cada componente de
// Comunidad — nunca deben mezclarse los dos flags.
export const isDemoMode = import.meta.env.VITE_DEMO_MODE === "true";

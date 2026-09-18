export const isDemoMode =
  import.meta.env.VITE_DEMO_MODE === "true" || !import.meta.env.VITE_SUPABASE_URL;
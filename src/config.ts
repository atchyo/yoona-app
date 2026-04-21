const baseUrl = import.meta.env.BASE_URL || "/";
const normalizedBasePath = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");

export const appConfig = {
  basePath: normalizedBasePath,
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
};

export const isSupabaseConfigured = Boolean(
  appConfig.supabaseUrl && appConfig.supabaseAnonKey,
);

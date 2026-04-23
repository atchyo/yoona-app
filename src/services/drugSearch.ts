import { supabase } from "./supabaseClient";
import type { DrugDatabaseMatch } from "../types";

export interface DrugCatalogSyncSummary {
  source: string;
  fetchedCount: number;
  upsertedCount: number;
}

export async function searchDrugDatabase(query: string): Promise<DrugDatabaseMatch[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (supabase) {
    try {
      const { data, error } = await supabase.functions.invoke("drug-search", {
        body: { query: trimmed },
      });
      if (!error && Array.isArray(data?.matches) && data.matches.length > 0) {
        return data.matches as DrugDatabaseMatch[];
      }
    } catch {
      return [];
    }
  }

  return [];
}

export async function syncDrugCatalog(): Promise<DrugCatalogSyncSummary[]> {
  if (!supabase) {
    throw new Error("Supabase가 연결되지 않았습니다.");
  }

  const { data, error } = await supabase.functions.invoke("sync-drug-catalog", {
    body: {
      sources: ["mfds_permit", "mfds_easy", "mfds_health"],
      reset: false,
    },
  });

  if (error) {
    throw new Error(error.message || "약 카탈로그 동기화에 실패했습니다.");
  }

  if (!Array.isArray(data?.sources)) {
    throw new Error("동기화 응답 형식이 올바르지 않습니다.");
  }

  return data.sources as DrugCatalogSyncSummary[];
}

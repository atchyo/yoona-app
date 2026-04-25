import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { drugMatches, interactionRules } from "../data/demoData";
import { supabase } from "../services/supabaseClient";
import type { DrugSource } from "../types";

interface CatalogCount {
  source: Extract<DrugSource, "mfds_permit" | "mfds_easy" | "mfds_health">;
  label: string;
  count: number;
}

const catalogSources: CatalogCount[] = [
  { source: "mfds_health", label: "건강기능식품정보", count: 0 },
  { source: "mfds_permit", label: "의약품 허가정보", count: 0 },
  { source: "mfds_easy", label: "e약은요", count: 0 },
];

export function ServiceAdminPage(): ReactElement {
  const [catalogCounts, setCatalogCounts] = useState<CatalogCount[]>(catalogSources);
  const [statusMessage, setStatusMessage] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastLoadedAt, setLastLoadedAt] = useState("");

  useEffect(() => {
    void loadCatalogCounts();
  }, []);

  async function loadCatalogCounts(): Promise<void> {
    setIsRefreshing(true);
    if (!supabase) {
      setCatalogCounts([
        { source: "mfds_health", label: "건강기능식품정보", count: 0 },
        { source: "mfds_permit", label: "의약품 허가정보", count: drugMatches.length },
        { source: "mfds_easy", label: "e약은요", count: 0 },
      ]);
      setLastLoadedAt(new Date().toLocaleString("ko-KR"));
      setIsRefreshing(false);
      return;
    }

    try {
      const client = supabase;
      const nextCounts = await Promise.all(
        catalogSources.map(async (item) => {
          const { count, error } = await client
            .from("drug_catalog_items")
            .select("id", { count: "exact", head: true })
            .eq("source", item.source);

          if (error) {
            return { ...item, count: 0 };
          }

          return { ...item, count: count || 0 };
        }),
      );

      setCatalogCounts(nextCounts);
      setLastLoadedAt(new Date().toLocaleString("ko-KR"));
      setStatusMessage("약 DB 상태를 새로 확인했습니다.");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "약 DB 상태 확인 중 문제가 발생했습니다.");
    } finally {
      setIsRefreshing(false);
    }
  }

  const totalCatalogCount = catalogCounts.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="admin-layout">
      <section className="card">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Service Admin</p>
            <h2>약 DB 연동 상태</h2>
            <p className="muted">
              검색은 Supabase에 동기화된 공식 DB 인덱스를 먼저 사용합니다. 대량 동기화는 브라우저가 아니라 로컬 CLI 작업으로 처리합니다.
            </p>
          </div>
          <button className="primary-button" disabled={isRefreshing || !supabase} onClick={() => void loadCatalogCounts()} type="button">
            {isRefreshing ? "확인 중" : "상태 새로고침"}
          </button>
        </div>
        <div className="stat-grid">
          <div className="stat-card"><span>공식 DB 인덱스</span><strong>{totalCatalogCount.toLocaleString("ko-KR")}</strong></div>
          <div className="stat-card"><span>규칙</span><strong>{interactionRules.length}</strong></div>
          <div className="stat-card"><span>AI 비용</span><strong>0원</strong></div>
        </div>
        <div className="catalog-source-grid">
          {catalogCounts.map((item) => (
            <div className="catalog-source-card" key={item.source}>
              <span>{item.label}</span>
              <strong>{item.count.toLocaleString("ko-KR")}건</strong>
            </div>
          ))}
        </div>
        <div className="service-admin-note">
          <strong>동기화 기준</strong>
          <p>
            건강기능식품정보, 의약품 허가정보, e약은요 순서로 보강합니다. 앱에서는 상태만 확인하고,
            긴 동기화 작업은 배포와 별도로 안전하게 실행합니다.
          </p>
          {lastLoadedAt && <span>마지막 확인: {lastLoadedAt}</span>}
        </div>
        {statusMessage && <p className="form-note">{statusMessage}</p>}
      </section>
    </div>
  );
}

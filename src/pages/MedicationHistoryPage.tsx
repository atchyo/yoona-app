import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import type { CareProfile, Medication, MedicationLog, MedicationSchedule } from "../types";

interface MedicationHistoryPageProps {
  careProfiles: CareProfile[];
  currentProfile: CareProfile;
  logs: MedicationLog[];
  medications: Medication[];
  onMarkTaken: (schedule: MedicationSchedule) => Promise<void> | void;
  schedules: MedicationSchedule[];
}

type HistoryFilter = "all" | "taken" | "planned";

interface HistoryRow {
  id: string;
  kind: "taken" | "planned";
  profile: CareProfile;
  medication: Medication;
  schedule?: MedicationSchedule;
  at: string;
  label: string;
}

export function MedicationHistoryPage({
  careProfiles,
  currentProfile,
  logs,
  medications,
  onMarkTaken,
  schedules,
}: MedicationHistoryPageProps): ReactElement {
  const [profileId, setProfileId] = useState(currentProfile.id);
  const [filter, setFilter] = useState<HistoryFilter>("all");
  const [pendingScheduleId, setPendingScheduleId] = useState("");
  const selectedProfile =
    careProfiles.find((profile) => profile.id === profileId) || careProfiles[0] || currentProfile;
  const rows = useMemo(
    () => buildHistoryRows(careProfiles, medications, schedules, logs),
    [careProfiles, logs, medications, schedules],
  );
  const visibleRows = rows
    .filter((row) => row.profile.id === selectedProfile.id)
    .filter((row) => filter === "all" || row.kind === filter);
  const takenCount = rows.filter((row) => row.profile.id === selectedProfile.id && row.kind === "taken").length;
  const plannedCount = rows.filter((row) => row.profile.id === selectedProfile.id && row.kind === "planned").length;

  async function markTaken(schedule: MedicationSchedule): Promise<void> {
    setPendingScheduleId(schedule.id);
    try {
      await onMarkTaken(schedule);
    } finally {
      setPendingScheduleId("");
    }
  }

  function exportCsv(): void {
    const header = ["구분", "일시", "관리대상", "약명", "내용"];
    const body = visibleRows.map((row) => [
      row.kind === "taken" ? "복용 완료" : "복용 예정",
      formatDateTime(row.at),
      row.profile.name,
      row.medication.productName,
      row.label,
    ]);
    const csv = [header, ...body]
      .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `optime-${selectedProfile.name}-history.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="history-page">
      <aside className="card history-filter-panel">
        <div className="section-heading">
          <p className="eyebrow">Medication Log</p>
          <h2>복용 기록</h2>
          <p className="muted">가족별 복용 완료와 예정 기록을 날짜순으로 확인합니다.</p>
        </div>
        <label className="field-label" htmlFor="history-profile">관리대상</label>
        <select id="history-profile" value={selectedProfile.id} onChange={(event) => setProfileId(event.target.value)}>
          {careProfiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
        <div className="history-filter-buttons">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")} type="button">
            전체
          </button>
          <button className={filter === "taken" ? "active" : ""} onClick={() => setFilter("taken")} type="button">
            복용 완료
          </button>
          <button className={filter === "planned" ? "active" : ""} onClick={() => setFilter("planned")} type="button">
            복용 예정
          </button>
        </div>
        <div className="history-summary">
          <span>완료 {takenCount}건</span>
          <span>예정 {plannedCount}건</span>
        </div>
        <button className="ghost-button wide" onClick={exportCsv} type="button">
          기록 내보내기
        </button>
      </aside>

      <section className="card history-list-card">
        <div className="section-heading row-heading">
          <div>
            <p className="eyebrow">Timeline</p>
            <h2>{selectedProfile.name} 복용 타임라인</h2>
          </div>
          <span className="owner-badge">{visibleRows.length}건</span>
        </div>
        <div className="history-table">
          <div className="history-table-head">
            <span>일시</span>
            <span>약 정보</span>
            <span>내용</span>
            <span>상태</span>
          </div>
          {visibleRows.map((row) => (
            <article className="history-table-row" key={row.id}>
              <time>{formatDateTime(row.at)}</time>
              <div>
                <strong>{row.medication.productName}</strong>
                <span>{row.medication.ingredients.map(formatIngredient).join(", ") || "성분 미등록"}</span>
              </div>
              <span>{row.label}</span>
              {row.kind === "taken" ? (
                <strong className="status-pill done">복용 완료</strong>
              ) : (
                <button
                  className="primary-button table-action"
                  disabled={!row.schedule || pendingScheduleId === row.schedule.id}
                  onClick={() => row.schedule && void markTaken(row.schedule)}
                  type="button"
                >
                  {pendingScheduleId === row.schedule?.id ? "기록 중" : "복용 완료"}
                </button>
              )}
            </article>
          ))}
          {!visibleRows.length && <p className="empty-panel">표시할 복용 기록이 없습니다.</p>}
        </div>
      </section>
    </div>
  );
}

function buildHistoryRows(
  profiles: CareProfile[],
  medications: Medication[],
  schedules: MedicationSchedule[],
  logs: MedicationLog[],
): HistoryRow[] {
  const rows: HistoryRow[] = [];

  logs.forEach((log) => {
    const medication = medications.find((item) => item.id === log.medicationId);
    const profile = profiles.find((item) => item.id === medication?.careProfileId);
    if (!medication || !profile) return;

    rows.push({
      id: `log-${log.id}`,
      kind: "taken",
      profile,
      medication,
      at: log.takenAt,
      label: log.note || "복용 완료 기록",
    });
  });

  schedules.forEach((schedule) => {
    const medication = medications.find((item) => item.id === schedule.medicationId);
    const profile = profiles.find((item) => item.id === medication?.careProfileId);
    if (!medication || !profile) return;

    rows.push({
      id: `schedule-${schedule.id}`,
      kind: "planned",
      profile,
      medication,
      schedule,
      at: schedule.nextDueAt,
      label: schedule.label,
    });
  });

  return rows.sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime());
}

function formatIngredient(ingredient: Medication["ingredients"][number]): string {
  return ingredient.amount ? `${ingredient.name} ${ingredient.amount}` : ingredient.name;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

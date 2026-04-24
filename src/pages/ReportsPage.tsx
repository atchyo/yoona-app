import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { buildSafetyFindings } from "../services/safety";
import type { CareProfile, FamilyMember, Medication, MedicationSchedule, TemporaryMedication } from "../types";

interface ReportsPageProps {
  careProfiles: CareProfile[];
  currentProfileId: string;
  familyMembers: FamilyMember[];
  medications: Medication[];
  schedules: MedicationSchedule[];
  temporaryMedications: TemporaryMedication[];
}

type ReportKind = "medication" | "visit" | "supplement";

const reportKinds: Array<{ id: ReportKind; title: string; description: string }> = [
  {
    id: "medication",
    title: "복약 지도 리포트",
    description: "현재 복용약, 성분, 주기, 주의사항을 병원 방문용으로 정리합니다.",
  },
  {
    id: "visit",
    title: "진료 전 체크 리포트",
    description: "복용 중인 약과 최근 검토 항목을 간호사에게 바로 보여줄 수 있게 정리합니다.",
  },
  {
    id: "supplement",
    title: "영양제 점검 리포트",
    description: "건강기능식품과 처방약 조합, 장기복용 검토 항목을 중심으로 정리합니다.",
  },
];

export function ReportsPage({
  careProfiles,
  currentProfileId,
  familyMembers,
  medications,
  schedules,
  temporaryMedications,
}: ReportsPageProps): ReactElement {
  const [selectedProfileId, setSelectedProfileId] = useState(currentProfileId);
  const [reportKind, setReportKind] = useState<ReportKind>("medication");

  useEffect(() => {
    if (careProfiles.some((profile) => profile.id === currentProfileId)) {
      setSelectedProfileId(currentProfileId);
    }
  }, [careProfiles, currentProfileId]);

  const selectedProfile =
    careProfiles.find((profile) => profile.id === selectedProfileId) || careProfiles[0];
  const selectedMedications = useMemo(
    () => medications.filter((medication) => medication.careProfileId === selectedProfile?.id),
    [medications, selectedProfile?.id],
  );
  const findings = selectedProfile ? buildSafetyFindings(selectedMedications, selectedProfile) : [];
  const temporaryCount = temporaryMedications.filter(
    (medication) => medication.careProfileId === selectedProfile?.id,
  ).length;
  const reportTitle =
    reportKinds.find((kind) => kind.id === reportKind)?.title || reportKinds[0].title;

  return (
    <div className="reports-page">
      <aside className="card report-type-panel">
        <p className="eyebrow">Report Output</p>
        <h2>리포트 종류</h2>
        <div className="report-type-list">
          {reportKinds.map((kind) => (
            <button
              className={kind.id === reportKind ? "report-type-button active" : "report-type-button"}
              key={kind.id}
              onClick={() => setReportKind(kind.id)}
              type="button"
            >
              <strong>{kind.title}</strong>
              <span>{kind.description}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="card report-preview-card">
        <div className="report-page-toolbar">
          <div>
            <p className="eyebrow">Preview</p>
            <h2>{reportTitle}</h2>
          </div>
          <div className="report-control-row">
            <select
              aria-label="리포트 대상"
              onChange={(event) => setSelectedProfileId(event.target.value)}
              value={selectedProfile?.id || ""}
            >
              {careProfiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
            <button className="ghost-button" onClick={() => window.print()} type="button">
              인쇄
            </button>
          </div>
        </div>

        {selectedProfile ? (
          <article className="printable-report">
            <header>
              <div>
                <span>Opti-Me</span>
                <h3>{selectedProfile.name} 복약 지도 리포트</h3>
              </div>
              <time>{new Date().toLocaleDateString("ko-KR")}</time>
            </header>

            <dl className="report-summary-list">
              <div>
                <dt>구분</dt>
                <dd>{profileRoleLabel(selectedProfile, familyMembers)}</dd>
              </div>
              <div>
                <dt>등록 약</dt>
                <dd>{selectedMedications.length}건</dd>
              </div>
              <div>
                <dt>검토 필요</dt>
                <dd>{findings.length + temporaryCount}건</dd>
              </div>
              <div>
                <dt>메모</dt>
                <dd>{selectedProfile.notes || "등록된 메모가 없습니다."}</dd>
              </div>
            </dl>

            <section>
              <h4>복용약 정보</h4>
              <div className="report-table">
                <div className="report-table-head">
                  <span>약명</span>
                  <span>성분</span>
                  <span>복용기간</span>
                  <span>주기</span>
                </div>
                {selectedMedications.map((medication) => (
                  <div className="report-table-row" key={medication.id}>
                    <strong>{medication.productName}</strong>
                    <span>{medication.ingredients.map(formatIngredient).join(", ") || "성분 미등록"}</span>
                    <span>{periodText(medication)}</span>
                    <span>{scheduleText(medication, schedules)}</span>
                  </div>
                ))}
                {!selectedMedications.length && (
                  <p className="empty-panel">아직 등록된 복용약이 없습니다.</p>
                )}
              </div>
            </section>

            <section>
              <h4>상호작용 및 확인 항목</h4>
              <div className="report-finding-list">
                {findings.map((finding) => (
                  <article key={finding.id}>
                    <strong>{finding.title}</strong>
                    <p>{finding.message}</p>
                  </article>
                ))}
                {!findings.length && <p className="safe-box">현재 등록 약 기준으로 표시할 중대한 충돌은 없습니다.</p>}
              </div>
            </section>
          </article>
        ) : (
          <p className="empty-panel">리포트로 만들 관리대상이 없습니다.</p>
        )}
      </section>
    </div>
  );
}

function profileRoleLabel(profile: CareProfile, familyMembers: FamilyMember[]): string {
  if (profile.type === "pet") return "반려동물";

  const member = familyMembers.find(
    (item) => item.userId === profile.ownerUserId || item.careProfileId === profile.id,
  );
  if (member?.role === "owner") return "가족대표";
  if (member?.role === "manager") return "가족관리자";
  return "가족구성원";
}

function formatIngredient(ingredient: Medication["ingredients"][number]): string {
  return ingredient.amount ? `${ingredient.name} ${ingredient.amount}` : ingredient.name;
}

function periodText(medication: Medication): string {
  const start = medication.startedAt || "시작일 미등록";
  return medication.reviewAt
    ? `복용 시작 ${start} · 검토일 ${medication.reviewAt}`
    : `${start}부터 복용 기록`;
}

function scheduleText(medication: Medication, schedules: MedicationSchedule[]): string {
  const medicationSchedules = schedules.filter((schedule) => schedule.medicationId === medication.id);
  if (medicationSchedules.length) {
    return medicationSchedules.map((schedule) => `${schedule.timeOfDay} ${schedule.label}`).join(", ");
  }

  return medication.instructions || medication.dosage || "복용 주기 미등록";
}

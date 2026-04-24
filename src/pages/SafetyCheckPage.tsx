import { useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { buildSafetyFindings } from "../services/safety";
import type { CareProfile, Medication, SafetyFinding } from "../types";

interface SafetyCheckPageProps {
  careProfiles: CareProfile[];
  currentProfile: CareProfile;
  medications: Medication[];
}

type SafetyTab = "current" | "family" | "guide";

export function SafetyCheckPage({
  careProfiles,
  currentProfile,
  medications,
}: SafetyCheckPageProps): ReactElement {
  const [selectedProfileId, setSelectedProfileId] = useState(currentProfile.id);
  const [activeTab, setActiveTab] = useState<SafetyTab>("current");

  useEffect(() => {
    if (careProfiles.some((profile) => profile.id === currentProfile.id)) {
      setSelectedProfileId(currentProfile.id);
    }
  }, [careProfiles, currentProfile.id]);

  const selectedProfile =
    careProfiles.find((profile) => profile.id === selectedProfileId) || careProfiles[0] || currentProfile;
  const selectedMedications = medications.filter(
    (medication) => medication.careProfileId === selectedProfile.id,
  );
  const selectedFindings = buildSafetyFindings(selectedMedications, selectedProfile);
  const familyFindings = useMemo(
    () =>
      careProfiles.flatMap((profile) =>
        buildSafetyFindings(
          medications.filter((medication) => medication.careProfileId === profile.id),
          profile,
        ).map((finding) => ({ ...finding, profile })),
      ),
    [careProfiles, medications],
  );
  const highRiskCount = familyFindings.filter((finding) => finding.level === "고위험").length;
  const cautionCount = familyFindings.filter((finding) => finding.level === "주의").length;

  return (
    <div className="safety-page">
      <section className="card safety-hero-card">
        <div>
          <p className="eyebrow">Interaction Check</p>
          <h2>함께 먹어도 되는지 먼저 확인해요</h2>
          <p className="muted">
            확정된 복용약과 영양제 성분을 기준으로 중복 성분, 주의 조합, 장기복용 검토 항목을 정리합니다.
          </p>
        </div>
        <div className="safety-score-panel">
          <span>주의 항목</span>
          <strong>{familyFindings.length}건</strong>
          <small>고위험 {highRiskCount}건 · 주의 {cautionCount}건</small>
        </div>
      </section>

      <section className="card safety-workspace">
        <div className="segmented-tabs" role="tablist" aria-label="상호작용 확인 범위">
          <button
            aria-selected={activeTab === "current"}
            className={activeTab === "current" ? "active" : ""}
            onClick={() => setActiveTab("current")}
            role="tab"
            type="button"
          >
            선택 대상
          </button>
          <button
            aria-selected={activeTab === "family"}
            className={activeTab === "family" ? "active" : ""}
            onClick={() => setActiveTab("family")}
            role="tab"
            type="button"
          >
            가족 전체
          </button>
          <button
            aria-selected={activeTab === "guide"}
            className={activeTab === "guide" ? "active" : ""}
            onClick={() => setActiveTab("guide")}
            role="tab"
            type="button"
          >
            확인 기준
          </button>
        </div>

        {activeTab === "current" && (
          <div className="safety-current-grid">
            <aside className="safety-profile-list" aria-label="관리 대상 선택">
              {careProfiles.map((profile) => (
                <button
                  className={profile.id === selectedProfile.id ? "safety-profile active" : "safety-profile"}
                  key={profile.id}
                  onClick={() => setSelectedProfileId(profile.id)}
                  type="button"
                >
                  <strong>{profile.name}</strong>
                  <span>{profile.type === "pet" ? "반려동물" : `${profile.ageGroup}대`}</span>
                </button>
              ))}
            </aside>
            <div className="safety-result-panel">
              <div className="section-heading row-heading">
                <div>
                  <p className="eyebrow">Selected Profile</p>
                  <h2>{selectedProfile.name} 기준 확인</h2>
                </div>
                <span className="owner-badge">등록 약 {selectedMedications.length}건</span>
              </div>
              <MedicationIngredientList medications={selectedMedications} />
              <SafetyFindingList findings={selectedFindings} medications={selectedMedications} />
            </div>
          </div>
        )}

        {activeTab === "family" && (
          <div className="family-safety-list">
            {careProfiles.map((profile) => {
              const profileMeds = medications.filter((medication) => medication.careProfileId === profile.id);
              const findings = buildSafetyFindings(profileMeds, profile);
              return (
                <article className="family-safety-card" key={profile.id}>
                  <div>
                    <strong>{profile.name}</strong>
                    <span>{profileMeds.length}개 복용약 · 주의 {findings.length}건</span>
                  </div>
                  {findings.length ? (
                    <SafetyFindingList compact findings={findings} medications={profileMeds} />
                  ) : (
                    <p className="safe-box">현재 등록 약 기준으로 표시할 중대한 충돌은 없습니다.</p>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {activeTab === "guide" && (
          <div className="safety-guide-grid">
            <GuideCard title="동일 성분 중복" text="해열진통제, 감기약, 두통약은 같은 성분이 겹칠 수 있어 먼저 성분명을 확인합니다." />
            <GuideCard title="영양제와 처방약" text="오메가3, 마그네슘, 칼슘, 비타민K 등은 일부 약과 복용 간격이나 병용 주의가 필요할 수 있습니다." />
            <GuideCard title="고령자·반려동물" text="연령, 체중, 기존 질환에 따라 같은 성분도 다르게 판단해야 하므로 전문가 확인을 기본값으로 둡니다." />
          </div>
        )}
      </section>
    </div>
  );
}

function MedicationIngredientList({ medications }: { medications: Medication[] }): ReactElement {
  if (!medications.length) {
    return <p className="empty-panel">등록된 약이 없어 성분을 비교할 수 없습니다.</p>;
  }

  return (
    <div className="ingredient-strip">
      {medications.map((medication) => (
        <article key={medication.id}>
          <strong>{medication.productName}</strong>
          <span>{medication.ingredients.map(formatIngredient).join(", ") || "성분 미등록"}</span>
        </article>
      ))}
    </div>
  );
}

function SafetyFindingList({
  compact,
  findings,
  medications,
}: {
  compact?: boolean;
  findings: SafetyFinding[];
  medications: Medication[];
}): ReactElement {
  if (!findings.length) {
    return <p className="safe-box">현재 등록 약 기준으로 표시할 중대한 충돌은 없습니다.</p>;
  }

  return (
    <div className={compact ? "finding-stack compact" : "finding-stack"}>
      {findings.map((finding) => (
        <article className={finding.level === "고위험" ? "danger-box" : "warning-box"} key={finding.id}>
          <div>
            <strong>{finding.title}</strong>
            <span>{finding.level}</span>
          </div>
          <p>{finding.message}</p>
          <small>
            관련 약:{" "}
            {finding.medicationIds
              .map((id) => medications.find((medication) => medication.id === id)?.productName)
              .filter(Boolean)
              .join(", ") || "확인 필요"}
          </small>
        </article>
      ))}
    </div>
  );
}

function GuideCard({ title, text }: { title: string; text: string }): ReactElement {
  return (
    <article className="guide-card">
      <strong>{title}</strong>
      <p>{text}</p>
    </article>
  );
}

function formatIngredient(ingredient: Medication["ingredients"][number]): string {
  return ingredient.amount ? `${ingredient.name} ${ingredient.amount}` : ingredient.name;
}

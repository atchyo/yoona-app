import type { ReactElement } from "react";
import { isPastReviewDate } from "../services/safety";
import type { CareProfile, Medication, MedicationSchedule } from "../types";

interface RemindersPageProps {
  currentProfile: CareProfile;
  medications: Medication[];
  schedules: MedicationSchedule[];
  onMarkTaken: (scheduleId: string) => void;
}

export function RemindersPage({
  currentProfile,
  medications,
  schedules,
  onMarkTaken,
}: RemindersPageProps): ReactElement {
  const profileMeds = medications.filter((medication) => medication.careProfileId === currentProfile.id);
  const profileSchedules = schedules
    .map((schedule) => ({
      schedule,
      medication: profileMeds.find((medication) => medication.id === schedule.medicationId),
    }))
    .filter((item): item is { schedule: MedicationSchedule; medication: Medication } => Boolean(item.medication));
  const reviewMeds = profileMeds.filter((medication) => isPastReviewDate(medication));

  return (
    <div className="reminder-page">
      <section className="card reminder-main-card">
        <div className="row-heading">
          <div>
            <p className="eyebrow">Medication Alerts</p>
            <h2>{currentProfile.name}님 복약 알림</h2>
            <p className="muted">복용 시간을 확인하고 완료 기록을 남길 수 있습니다.</p>
          </div>
          <span className="owner-badge">전체 {profileSchedules.length}건</span>
        </div>

        <div className="reminder-table" role="table" aria-label="복약 알림 목록">
          <div className="reminder-table-head" role="row">
            <span role="columnheader">시간</span>
            <span role="columnheader">약 정보</span>
            <span role="columnheader">주기</span>
            <span role="columnheader">상태</span>
          </div>
          {profileSchedules.map(({ medication, schedule }) => (
            <div className="reminder-table-row" key={schedule.id} role="row">
              <time>{schedule.timeOfDay}</time>
              <div>
                <strong>{medication.productName}</strong>
                <span>{medication.dosage || medication.ingredients[0]?.amount || "용량 미등록"}</span>
              </div>
              <span>{schedule.label}</span>
              <button className="primary-button" onClick={() => onMarkTaken(schedule.id)} type="button">
                복용 완료
              </button>
            </div>
          ))}
          {!profileSchedules.length && (
            <div className="empty-panel">등록된 복약 알림이 없습니다. 약 등록 후 복용 주기를 추가해 주세요.</div>
          )}
        </div>
      </section>

      <aside className="reminder-side">
        <section className="card compact-card">
          <p className="eyebrow">Reminder Settings</p>
          <h2>알림 설정</h2>
          <div className="setting-list">
            <label className="setting-row">
              <span>앱내 알림</span>
              <input checked readOnly type="checkbox" />
            </label>
            <label className="setting-row">
              <span>중요 상호작용 강조</span>
              <input checked readOnly type="checkbox" />
            </label>
            <label className="setting-row">
              <span>장기복용 검토</span>
              <input checked readOnly type="checkbox" />
            </label>
          </div>
        </section>

        <section className="card compact-card">
          <p className="eyebrow">Duration Review</p>
          <h2>장기복용 검토</h2>
          <ul className="finding-list">
            {reviewMeds.map((medication) => (
              <li className="warning-box" key={medication.id}>
                <strong>{medication.productName}</strong>
                <span>{medication.reviewAt} 이후 복용 지속 여부를 검토하세요.</span>
              </li>
            ))}
          </ul>
          {!reviewMeds.length && <p className="muted">현재 검토일이 지난 약은 없습니다.</p>}
        </section>
      </aside>
    </div>
  );
}

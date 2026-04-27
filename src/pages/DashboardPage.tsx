import type { ReactElement, ReactNode } from "react";
import { Icon } from "../components/Icon";
import type { IconName } from "../components/Icon";
import type { CareProfile, FamilyMember, Medication, MedicationLog, MedicationSchedule, OcrScan } from "../types";

interface DashboardPageProps {
  careProfiles: CareProfile[];
  currentProfile: CareProfile;
  familyMembers: FamilyMember[];
  medications: Medication[];
  logs: MedicationLog[];
  schedules: MedicationSchedule[];
  scans: OcrScan[];
  onNavigateScan: () => void;
  onNavigateProfiles: () => void;
  onNavigateReminders: () => void;
  onNavigateInteractions: () => void;
  onNavigateChat: () => void;
  onNavigateHistory: () => void;
  onNavigateReports: () => void;
  onMarkTaken: (schedule: MedicationSchedule) => Promise<void> | void;
}

type Tone = "indigo" | "blue" | "danger" | "success" | "mint" | "slate" | "violet";

interface SummaryFixture {
  action: string;
  icon: IconName;
  label: string;
  tone: Tone;
  value: string;
}

interface ScheduleFixture {
  dose: string;
  iconTone: "red" | "blue" | "document";
  medicine: string;
  person: string;
  personTone: Tone;
  period: string;
  status: "복용 완료" | "복용 예정";
  time: string;
}

interface RecentFixture {
  date: string;
  dose: string;
  medicine: string;
  person: string;
  personTone: Tone;
  period: string;
}

interface ReportFixture {
  date: string;
  title: string;
}

interface FamilyFixture {
  avatar: "self" | "father" | "mother" | "son" | "dog" | "add";
  label: string;
}

const dashboardDate = "5월 24일 (금요일)";

const summaryCards: SummaryFixture[] = [
  { icon: "pill", label: "복용중인 약", value: "7개", action: "전체 보기", tone: "indigo" },
  { icon: "clock", label: "오늘 복용 예정", value: "3개", action: "상세 보기", tone: "violet" },
  { icon: "warning", label: "주의 상호작용", value: "1건", action: "확인하기", tone: "danger" },
  { icon: "file", label: "이번 주 리포트", value: "2개", action: "출력하기", tone: "indigo" },
];

const scheduleRows: ScheduleFixture[] = [
  {
    time: "08:00",
    period: "아침",
    medicine: "고혈압약 (암로디핀 5mg)",
    dose: "1정 식후",
    person: "본인",
    personTone: "blue",
    status: "복용 완료",
    iconTone: "red",
  },
  {
    time: "09:00",
    period: "아침",
    medicine: "비타민D 1000IU",
    dose: "1정 식후",
    person: "본인",
    personTone: "blue",
    status: "복용 완료",
    iconTone: "document",
  },
  {
    time: "12:00",
    period: "점심",
    medicine: "오메가3",
    dose: "1캡슐 식후",
    person: "본인",
    personTone: "blue",
    status: "복용 예정",
    iconTone: "blue",
  },
  {
    time: "18:00",
    period: "저녁",
    medicine: "종합비타민",
    dose: "1정 식후",
    person: "어머니",
    personTone: "violet",
    status: "복용 예정",
    iconTone: "document",
  },
  {
    time: "21:00",
    period: "취침 전",
    medicine: "마그네슘",
    dose: "1정",
    person: "아버지",
    personTone: "indigo",
    status: "복용 예정",
    iconTone: "blue",
  },
];

const familyMembersFixture: FamilyFixture[] = [
  { avatar: "self", label: "본인" },
  { avatar: "father", label: "아버지" },
  { avatar: "mother", label: "어머니" },
  { avatar: "son", label: "김아들" },
  { avatar: "dog", label: "강아지" },
  { avatar: "add", label: "가족 추가" },
];

const recentRows: RecentFixture[] = [
  { date: "5.23 (목)", medicine: "비타민C", dose: "1정", period: "아침", person: "본인", personTone: "blue" },
  { date: "5.23 (목)", medicine: "오메가3", dose: "1캡슐", period: "저녁", person: "본인", personTone: "blue" },
  { date: "5.22 (수)", medicine: "고혈압약", dose: "1정", period: "아침", person: "본인", personTone: "blue" },
  { date: "5.22 (수)", medicine: "종합비타민", dose: "1정", period: "저녁", person: "어머니", personTone: "violet" },
];

const reportRows: ReportFixture[] = [
  { title: "김가족님 복약 지도 리포트", date: "2024.05.24" },
  { title: "김가족님 복약 지도 리포트", date: "2024.04.24" },
  { title: "김가족님 복약 지도 리포트", date: "2024.03.24" },
];

export function DashboardPage({
  onNavigateScan,
  onNavigateProfiles,
  onNavigateReminders,
  onNavigateInteractions,
  onNavigateChat,
  onNavigateHistory,
  onNavigateReports,
}: DashboardPageProps): ReactElement {
  const summaryActions = [onNavigateScan, onNavigateReminders, onNavigateInteractions, onNavigateReports];

  return (
    <div className="dashboard-v2" data-testid="dashboard-v2">
      <section aria-label="대시보드 요약" className="dv2-summary-grid">
        {summaryCards.map((card, index) => (
          <SummaryCard card={card} key={card.label} onClick={summaryActions[index]} />
        ))}
      </section>

      <section className="dv2-main-grid" aria-label="오늘의 건강 관리">
        <MedicationScheduleCard onNavigateReminders={onNavigateReminders} />
        <div className="dv2-side-stack">
          <InteractionWarningCard onNavigateInteractions={onNavigateInteractions} />
          <FamilyStatusCard onNavigateProfiles={onNavigateProfiles} />
          <PetStatusCard onNavigateProfiles={onNavigateProfiles} />
        </div>
      </section>

      <section className="dv2-lower-grid" aria-label="기록과 상담, 리포트">
        <RecentMedicationCard onNavigateHistory={onNavigateHistory} />
        <AiConsultCard onNavigateChat={onNavigateChat} />
        <ReportCard onNavigateReports={onNavigateReports} />
      </section>
    </div>
  );
}

function SummaryCard({ card, onClick }: { card: SummaryFixture; onClick: () => void }): ReactElement {
  return (
    <button className={`dv2-card dv2-summary-card ${card.tone}`} onClick={onClick} type="button">
      <IconCircle icon={card.icon} tone={card.tone} />
      <span className="dv2-summary-copy">
        <span>{card.label}</span>
        <strong>{card.value}</strong>
      </span>
      <span className="dv2-card-link">{card.action}</span>
    </button>
  );
}

function MedicationScheduleCard({ onNavigateReminders }: { onNavigateReminders: () => void }): ReactElement {
  return (
    <SectionCard className="dv2-schedule-card">
      <CardHeader
        action="전체 일정 보기"
        onAction={onNavigateReminders}
        title="오늘의 복용 일정"
        titleMeta={dashboardDate}
      />
      <div className="dv2-schedule-list">
        {scheduleRows.map((row) => (
          <div className="dv2-schedule-row" key={`${row.time}-${row.medicine}`}>
            <time className="dv2-schedule-time">
              <strong>{row.time}</strong>
              <span>{row.period}</span>
            </time>
            <MedicationDot tone={row.iconTone} />
            <div className="dv2-medication-copy">
              <strong>{row.medicine}</strong>
              <span>{row.dose}</span>
            </div>
            <div className="dv2-row-badges">
              <Badge tone={row.personTone}>{row.person}</Badge>
              <Badge tone={row.status === "복용 완료" ? "success" : "indigo"}>{row.status}</Badge>
            </div>
          </div>
        ))}
      </div>
      <button className="dv2-outline-wide-button" onClick={onNavigateReminders} type="button">
        복약 알림 설정
      </button>
    </SectionCard>
  );
}

function InteractionWarningCard({ onNavigateInteractions }: { onNavigateInteractions: () => void }): ReactElement {
  return (
    <SectionCard className="dv2-warning-card">
      <CardHeader count="1건" title="주의가 필요한 상호작용" />
      <div className="dv2-warning-box">
        <div className="dv2-warning-copy">
          <IconCircle icon="warning" tone="danger" />
          <div>
            <strong>고혈압약 + 감기약</strong>
            <p>감기약 성분이 혈압을 올릴 수 있어 고혈압약 효과를 떨어뜨릴 수 있습니다.</p>
          </div>
        </div>
        <button className="dv2-soft-button" onClick={onNavigateInteractions} type="button">
          자세히 보기
        </button>
      </div>
    </SectionCard>
  );
}

function FamilyStatusCard({ onNavigateProfiles }: { onNavigateProfiles: () => void }): ReactElement {
  return (
    <SectionCard className="dv2-family-card">
      <CardHeader count="전체 5명" title="가족 현황" />
      <div className="dv2-family-row">
        {familyMembersFixture.map((member) =>
          member.avatar === "add" ? (
            <button className="dv2-family-person add" key={member.label} onClick={onNavigateProfiles} type="button">
              <span className="dv2-family-avatar add">
                <Icon name="plus" />
              </span>
              <strong>{member.label}</strong>
            </button>
          ) : (
            <button className="dv2-family-person" key={member.label} onClick={onNavigateProfiles} type="button">
              <FamilyAvatar avatar={member.avatar} />
              <strong>{member.label}</strong>
            </button>
          ),
        )}
      </div>
    </SectionCard>
  );
}

function PetStatusCard({ onNavigateProfiles }: { onNavigateProfiles: () => void }): ReactElement {
  return (
    <button className="dv2-card dv2-pet-card" onClick={onNavigateProfiles} type="button">
      <div className="dv2-pet-copy">
        <FamilyAvatar avatar="dog" />
        <div>
          <h2>반려동물 현황</h2>
          <strong>강아지</strong>
          <p>말티즈 | 9살</p>
        </div>
      </div>
      <div className="dv2-pet-meta">
        <span>1마리</span>
        <Icon name="chevronRight" />
      </div>
    </button>
  );
}

function RecentMedicationCard({ onNavigateHistory }: { onNavigateHistory: () => void }): ReactElement {
  return (
    <SectionCard className="dv2-recent-card">
      <CardHeader action="전체 보기" onAction={onNavigateHistory} title="최근 복용 기록" />
      <div className="dv2-recent-list">
        {recentRows.map((row) => (
          <div className="dv2-recent-row" key={`${row.date}-${row.medicine}`}>
            <span className="dv2-recent-date">{row.date}</span>
            <MedicationDot tone="blue" small />
            <strong>{row.medicine}</strong>
            <span className="dv2-recent-dose">{row.dose} | {row.period}</span>
            <Badge tone={row.personTone}>{row.person}</Badge>
            <Badge tone="success">완료</Badge>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function AiConsultCard({ onNavigateChat }: { onNavigateChat: () => void }): ReactElement {
  return (
    <SectionCard className="dv2-ai-card">
      <div className="dv2-ai-header">
        <h2>AI 건강 상담</h2>
      </div>
      <div aria-label="AI 건강 상담 예시" className="dv2-chat-preview">
        <div className="dv2-chat-message user">
          <button className="dv2-chat-bubble dv2-user-bubble" onClick={onNavigateChat} type="button">
            감기약 먹으면서 운전해도 될까요?
          </button>
        </div>
        <div className="dv2-chat-message assistant">
          <span className="dv2-ai-bubble-mark" aria-hidden="true">AI</span>
          <div className="dv2-chat-bubble dv2-assistant-bubble">
            <p>
              일반적인 감기약 중 일부는 졸음을 유발할 수 있어 운전에 주의가 필요합니다. 항히스타민 성분을 확인하고, 복용 전 약사와 상담해 보세요.
            </p>
          </div>
        </div>
      </div>
      <form className="dv2-chat-input" onSubmit={(event) => event.preventDefault()}>
        <input aria-label="AI 건강 상담 질문" placeholder="궁금한 내용을 입력하세요..." />
        <button aria-label="질문 보내기" onClick={onNavigateChat} type="button">
          <Icon name="send" />
        </button>
      </form>
    </SectionCard>
  );
}

function ReportCard({ onNavigateReports }: { onNavigateReports: () => void }): ReactElement {
  return (
    <SectionCard className="dv2-report-card">
      <CardHeader action="전체 보기" onAction={onNavigateReports} title="복약 지도 리포트" />
      <div className="dv2-report-list">
        {reportRows.map((report) => (
          <div className="dv2-report-row" key={`${report.title}-${report.date}`}>
            <IconCircle icon="file" tone="mint" />
            <div>
              <strong>{report.title}</strong>
              <span>{report.date}</span>
            </div>
            <button className="dv2-download-button" onClick={onNavigateReports} type="button">
              다운로드
            </button>
          </div>
        ))}
      </div>
      <button className="dv2-primary-wide-button" onClick={onNavigateReports} type="button">
        새 리포트 생성
      </button>
    </SectionCard>
  );
}

function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }): ReactElement {
  return <article className={`dv2-card ${className}`.trim()}>{children}</article>;
}

function CardHeader({
  action,
  count,
  onAction,
  title,
  titleMeta,
}: {
  action?: string;
  count?: string;
  onAction?: () => void;
  title: string;
  titleMeta?: string;
}): ReactElement {
  return (
    <header className="dv2-card-header">
      <div className="dv2-card-title-row">
        <h2>{title}</h2>
        {titleMeta && <span>{titleMeta}</span>}
      </div>
      {action && (
        <button className="dv2-text-link" onClick={onAction} type="button">
          {action} &gt;
        </button>
      )}
      {count && <strong className="dv2-card-count">{count}</strong>}
    </header>
  );
}

function IconCircle({ icon, tone }: { icon: IconName; tone: Tone }): ReactElement {
  return (
    <span className={`dv2-icon-circle ${tone}`} aria-hidden="true">
      <Icon name={icon} />
    </span>
  );
}

function MedicationDot({ small = false, tone }: { small?: boolean; tone: "red" | "blue" | "document" }): ReactElement {
  return (
    <span className={`dv2-med-dot ${tone}${small ? " small" : ""}`} aria-hidden="true">
      {tone === "document" ? <Icon name="file" /> : <span />}
    </span>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: Tone }): ReactElement {
  return <span className={`dv2-badge ${tone}`}>{children}</span>;
}

function FamilyAvatar({ avatar }: { avatar: Exclude<FamilyFixture["avatar"], "add"> }): ReactElement {
  if (avatar === "dog") {
    return (
      <span className="dv2-family-avatar dog" aria-hidden="true">
        <span className="dv2-dog-ear left" />
        <span className="dv2-dog-ear right" />
        <span className="dv2-dog-face" />
      </span>
    );
  }

  return (
    <span className={`dv2-family-avatar person ${avatar}`} aria-hidden="true">
      <Icon name="user" />
    </span>
  );
}

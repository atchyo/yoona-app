import type { ReactElement } from "react";
import type { DemoUser, FamilyWorkspace, ThemeMode } from "../types";

interface SettingsPageProps {
  availableWorkspaceCount: number;
  onThemeToggle: () => void;
  theme: ThemeMode;
  user: DemoUser;
  workspace: FamilyWorkspace;
}

export function SettingsPage({
  availableWorkspaceCount,
  onThemeToggle,
  theme,
  user,
  workspace,
}: SettingsPageProps): ReactElement {
  return (
    <div className="settings-page">
      <section className="card settings-profile-card">
        <div className="section-heading">
          <p className="eyebrow">Account</p>
          <h2>{user.name} 계정</h2>
          <p className="muted">로그인 계정과 현재 연결된 가족공간 정보를 확인합니다.</p>
        </div>
        <dl className="settings-list">
          <div>
            <dt>이메일</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>권한</dt>
            <dd>{roleLabel(user.familyRole)}</dd>
          </div>
          <div>
            <dt>현재 공간</dt>
            <dd>{workspace.name}</dd>
          </div>
          <div>
            <dt>사용 가능 공간</dt>
            <dd>{availableWorkspaceCount}개</dd>
          </div>
        </dl>
      </section>

      <section className="card settings-control-card">
        <div className="section-heading">
          <p className="eyebrow">Display</p>
          <h2>화면 모드</h2>
          <p className="muted">선택한 라이트/다크 모드는 이 기기에 저장됩니다.</p>
        </div>
        <button className="theme-large-toggle" onClick={onThemeToggle} type="button">
          <span className={theme === "light" ? "active" : ""}>Light</span>
          <span className={theme === "dark" ? "active" : ""}>Dark</span>
        </button>
      </section>

      <section className="card settings-safety-card">
        <div className="section-heading">
          <p className="eyebrow">Data Policy</p>
          <h2>의료 정보 안내</h2>
        </div>
        <ul className="settings-bullet-list">
          <li>Opti-Me는 의료행위를 대체하지 않고 가족 복용 기록과 상담 준비를 돕습니다.</li>
          <li>사진에는 개인정보가 포함될 수 있어 불필요한 사진은 삭제하는 흐름을 유지합니다.</li>
          <li>약 DB 매칭이 불확실한 항목은 확정 약처럼 판단하지 않고 검토 필요로 표시합니다.</li>
        </ul>
      </section>
    </div>
  );
}

function roleLabel(role: DemoUser["familyRole"]): string {
  if (role === "owner") return "가족대표";
  if (role === "manager") return "가족관리자";
  return "가족구성원";
}

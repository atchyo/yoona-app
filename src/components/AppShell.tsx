import { useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";
import type { CareProfile, DemoUser, FamilyMember, ThemeMode } from "../types";

export type Route =
  | "/"
  | "/scan"
  | "/profiles"
  | "/reminders"
  | "/chat"
  | "/family"
  | "/service-admin"
  | "/login";

const navItems: Array<{ path: Route; label: string; ownerOnly?: boolean; adminOnly?: boolean }> = [
  { path: "/", label: "대시보드" },
  { path: "/scan", label: "약 등록" },
  { path: "/profiles", label: "가족약" },
  { path: "/reminders", label: "리마인더" },
  { path: "/chat", label: "상담" },
  { path: "/family", label: "가족관리", ownerOnly: true },
  { path: "/service-admin", label: "서비스", adminOnly: true },
];

const appIconSrc = `${import.meta.env.BASE_URL}opti_me_top_left_icon.png`;

interface AppShellProps {
  availableProfiles: CareProfile[];
  children: ReactNode;
  currentProfile: CareProfile;
  onLogout: () => void;
  onNavigate: (route: Route) => void;
  onProfileChange: (profileId: string) => void;
  onThemeToggle: () => void;
  route: Route;
  theme: ThemeMode;
  familyMembers: FamilyMember[];
  user: DemoUser;
}

export function AppShell({
  availableProfiles,
  children,
  currentProfile,
  familyMembers,
  onLogout,
  onNavigate,
  onProfileChange,
  onThemeToggle,
  route,
  theme,
  user,
}: AppShellProps): ReactElement {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly) return user.role === "admin";
    if (item.ownerOnly) return user.familyRole === "owner" || user.familyRole === "manager";
    return true;
  });
  const mobileItems = visibleItems.filter((item) => item.path !== "/service-admin");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <img alt="Opti-Me" className="app-icon brand-icon" src={appIconSrc} />
          <div>
            <strong>Opti-Me</strong>
            <span>가족 약 관리</span>
          </div>
        </div>
        <nav aria-label="주요 메뉴" className="nav-list">
          {visibleItems.map((item) => (
            <button
              aria-current={route === item.path ? "page" : undefined}
              className={route === item.path ? "nav-item active" : "nav-item"}
              key={item.path}
              onClick={() => onNavigate(item.path)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-card">
          <span className="sidebar-card-label">현재 관리 대상</span>
          <strong>{currentProfile.name}</strong>
          <p>우측 상단 이름을 눌러 다른 가족으로 전환할 수 있습니다.</p>
        </div>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">Family Medication Care</p>
            <h1>복용 기록을 정리하고, 가족 건강을 함께 확인하세요</h1>
          </div>
          <div className="topbar-actions">
            <ThemeToggle onToggle={onThemeToggle} theme={theme} />
            <div className="profile-switcher">
              <button
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="listbox"
                className="user-chip profile-switcher-button"
                onClick={() => setIsProfileMenuOpen((current) => !current)}
                type="button"
              >
                <span>{profileRoleLabel(currentProfile, familyMembers, user)}</span>
                <div className="profile-switcher-copy">
                  <strong>{currentProfile.name}</strong>
                  <small>{user.name} 계정으로 로그인됨</small>
                </div>
              </button>
              {isProfileMenuOpen && (
                <div aria-label="관리 대상 선택" className="profile-switcher-menu" role="listbox">
                  {availableProfiles.map((profile) => (
                    <button
                      aria-selected={profile.id === currentProfile.id}
                      className={profile.id === currentProfile.id ? "profile-option active" : "profile-option"}
                      key={profile.id}
                      onClick={() => {
                        onProfileChange(profile.id);
                        setIsProfileMenuOpen(false);
                      }}
                      role="option"
                      type="button"
                    >
                      <strong>{profile.name}</strong>
                      <span>{profileRoleLabel(profile, familyMembers, user)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="ghost-button" onClick={onLogout} type="button">
              로그아웃
            </button>
          </div>
        </header>

        <main className="page-content">{children}</main>
      </div>

      <nav aria-label="모바일 메뉴" className="mobile-tabbar">
        {mobileItems.map((item) => (
          <button
            aria-current={route === item.path ? "page" : undefined}
            className={route === item.path ? "mobile-tab active" : "mobile-tab"}
            key={item.path}
            onClick={() => onNavigate(item.path)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function profileRoleLabel(
  profile: CareProfile,
  familyMembers: FamilyMember[],
  user: DemoUser,
): string {
  if (profile.type === "pet") return "반려";
  const member = familyMembers.find((item) => item.userId === profile.ownerUserId);
  if (user.role === "admin") return "관리";
  if (member?.role === "owner") return "대표";
  if (member?.role === "manager") return "관리";
  return "가족";
}

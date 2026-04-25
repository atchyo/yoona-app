import type { ReactElement } from "react";
import { Icon } from "./Icon";
import type { ThemeMode } from "../types";

export function ThemeToggle({
  onToggle,
  theme,
}: {
  onToggle: () => void;
  theme: ThemeMode;
}): ReactElement {
  return (
    <button aria-label="화면 테마 변경" className="theme-toggle" onClick={onToggle} type="button">
      <span className="theme-toggle-track" aria-hidden="true">
        <Icon name="sun" />
        <span className="theme-toggle-knob" />
        <Icon name="moon" />
      </span>
      <span>{theme === "light" ? "라이트" : "다크"}</span>
    </button>
  );
}

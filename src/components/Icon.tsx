import type { ReactElement } from "react";

export type IconName =
  | "bell"
  | "calendar"
  | "chat"
  | "check"
  | "clipboard"
  | "family"
  | "file"
  | "home"
  | "moon"
  | "paw"
  | "pill"
  | "plus"
  | "scan"
  | "settings"
  | "shield"
  | "sun";

export function Icon({ name }: { name: IconName }): ReactElement {
  return (
    <svg aria-hidden="true" className="ui-icon" fill="none" viewBox="0 0 24 24">
      {iconPath(name)}
    </svg>
  );
}

function iconPath(name: IconName): ReactElement {
  const common = {
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.9,
  };

  switch (name) {
    case "bell":
      return (
        <>
          <path d="M6.4 10.3a5.6 5.6 0 0 1 11.2 0c0 3.8 1.6 4.9 1.6 4.9H4.8s1.6-1.1 1.6-4.9Z" {...common} />
          <path d="M9.8 18a2.4 2.4 0 0 0 4.4 0" {...common} />
        </>
      );
    case "calendar":
      return (
        <>
          <path d="M7 4v3M17 4v3M5 9h14M6.5 6h11A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-9A2.5 2.5 0 0 1 6.5 6Z" {...common} />
          <path d="M8 13h2M14 13h2M8 16h2" {...common} />
        </>
      );
    case "chat":
      return (
        <>
          <path d="M5 6.8A3.8 3.8 0 0 1 8.8 3h6.4A3.8 3.8 0 0 1 19 6.8v4.4a3.8 3.8 0 0 1-3.8 3.8H10l-4.5 4v-4.6A3.8 3.8 0 0 1 5 11.2V6.8Z" {...common} />
          <path d="M9 8.5h6M9 11.5h3.6" {...common} />
        </>
      );
    case "check":
      return <path d="m5 12.4 4.2 4.2L19 6.8" {...common} />;
    case "clipboard":
      return (
        <>
          <path d="M9 4h6l1 2h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2l1-2Z" {...common} />
          <path d="M9 6h6M8 11h8M8 15h5" {...common} />
        </>
      );
    case "family":
      return (
        <>
          <path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM15.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" {...common} />
          <path d="M3.7 19a4.8 4.8 0 0 1 9.6 0M12.8 18.6a4 4 0 0 1 7.5.4" {...common} />
        </>
      );
    case "file":
      return (
        <>
          <path d="M7 3.8h6l4 4V20H7V3.8Z" {...common} />
          <path d="M13 4v4h4M9 12h6M9 15h6" {...common} />
        </>
      );
    case "home":
      return (
        <>
          <path d="m4 11 8-7 8 7" {...common} />
          <path d="M6.5 10.2V20h4.2v-5.2h2.6V20h4.2v-9.8" {...common} />
        </>
      );
    case "moon":
      return <path d="M19 15.3A7.6 7.6 0 0 1 8.7 5a7.7 7.7 0 1 0 10.3 10.3Z" {...common} />;
    case "paw":
      return (
        <>
          <path d="M8.2 10.2c.8 0 1.4-.8 1.4-1.8S9 6.6 8.2 6.6 6.8 7.4 6.8 8.4s.6 1.8 1.4 1.8ZM15.8 10.2c.8 0 1.4-.8 1.4-1.8s-.6-1.8-1.4-1.8-1.4.8-1.4 1.8.6 1.8 1.4 1.8ZM11.8 8.8c.8 0 1.4-.9 1.4-2s-.6-2-1.4-2-1.4.9-1.4 2 .6 2 1.4 2ZM6.2 14c.7 0 1.2-.7 1.2-1.5S6.9 11 6.2 11 5 11.7 5 12.5 5.5 14 6.2 14ZM17.8 14c.7 0 1.2-.7 1.2-1.5s-.5-1.5-1.2-1.5-1.2.7-1.2 1.5.5 1.5 1.2 1.5Z" {...common} />
          <path d="M8.2 18.2c0-2.4 1.8-4.5 3.8-4.5s3.8 2.1 3.8 4.5c0 1.4-1.2 2-3.8 2s-3.8-.6-3.8-2Z" {...common} />
        </>
      );
    case "pill":
      return (
        <>
          <path d="M5.8 18.2a4 4 0 0 1 0-5.7l6.7-6.7a4 4 0 1 1 5.7 5.7l-6.7 6.7a4 4 0 0 1-5.7 0Z" {...common} />
          <path d="m9.4 8.9 5.7 5.7" {...common} />
        </>
      );
    case "plus":
      return <path d="M12 5v14M5 12h14" {...common} />;
    case "scan":
      return (
        <>
          <path d="M7 4H5.8A1.8 1.8 0 0 0 4 5.8V7M17 4h1.2A1.8 1.8 0 0 1 20 5.8V7M7 20H5.8A1.8 1.8 0 0 1 4 18.2V17M17 20h1.2a1.8 1.8 0 0 0 1.8-1.8V17M7 12h10" {...common} />
          <path d="M9 9h6M9 15h4" {...common} />
        </>
      );
    case "settings":
      return (
        <>
          <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" {...common} />
          <path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.5-2.4 1a8.6 8.6 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.5A8.6 8.6 0 0 0 7 6.5l-2.4-1-2 3.5 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.5 2.4-1a8.6 8.6 0 0 0 2.6 1.5l.4 2.5h4l.4-2.5a8.6 8.6 0 0 0 2.6-1.5l2.4 1 2-3.5-2-1.5Z" {...common} />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M12 21s7-3.2 7-9.8V5.5L12 3 5 5.5v5.7C5 17.8 12 21 12 21Z" {...common} />
          <path d="m8.9 12 2.1 2.1 4.1-4.4" {...common} />
        </>
      );
    case "sun":
      return (
        <>
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" {...common} />
          <path d="M12 2.5v2M12 19.5v2M4.8 4.8l1.4 1.4M17.8 17.8l1.4 1.4M2.5 12h2M19.5 12h2M4.8 19.2l1.4-1.4M17.8 6.2l1.4-1.4" {...common} />
        </>
      );
  }
}

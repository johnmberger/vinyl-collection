import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

function Icon({
  className = "h-3.5 w-3.5",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </Icon>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="7" cy="7" r="4.25" />
      <path d="M10.5 10.5L13.5 13.5" />
    </Icon>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.2" />
      <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" />
    </Icon>
  );
}

export function DiscIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="1.6" />
    </Icon>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M2.75 8.4V3.75H8.4l5.1 5.1a1 1 0 0 1 0 1.4l-3.25 3.25a1 1 0 0 1-1.4 0z" />
      <circle cx="5.6" cy="5.6" r="0.7" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function HashIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 2.5L5 13.5M11 2.5L10 13.5M3 6.25h10.5M2.5 10.25H13" />
    </Icon>
  );
}

export function ExternalIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6.5 3.5H3.75A1.25 1.25 0 0 0 2.5 4.75v7.5A1.25 1.25 0 0 0 3.75 13.5h7.5a1.25 1.25 0 0 0 1.25-1.25V9.5" />
      <path d="M8.5 2.5h5v5M13.5 2.5L7.5 8.5" />
    </Icon>
  );
}

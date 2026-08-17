type ChipProps = {
  children: string;
  active?: boolean;
  overlay?: boolean;
  onClick?: () => void;
};

export default function Chip({
  children,
  active = false,
  overlay = false,
  onClick,
}: ChipProps) {
  const className = `inline-flex max-w-full truncate rounded-full px-2.5 py-0.5 text-[11px] tracking-wide transition-colors ${
    active
      ? "bg-accent/15 text-accent ring-1 ring-accent/30"
      : overlay
        ? "bg-background/70 text-cream ring-1 ring-white/15 backdrop-blur-sm"
        : "bg-white/5 text-cream/80 ring-1 ring-white/10 hover:bg-white/10 hover:text-cream"
  }`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return <span className={className}>{children}</span>;
}

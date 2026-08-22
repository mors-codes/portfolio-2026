"use client";

type NavLinkProps = {
  href: string;
  number: string;
  label: string;
  onItemHover: (label: string, number: string, edge: "top" | "bottom") => void;
};

export default function NavLink({
  href,
  number,
  label,
  onItemHover,
}: NavLinkProps) {
  const handleMouseEnter = (ev: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const y = ev.clientY - rect.top;
    const edge = y < rect.height / 2 ? "top" : "bottom";
    onItemHover(label, number, edge);
  };

  return (
    
    <a
      href={href}
      onMouseEnter={handleMouseEnter}
      className="relative block px-4 py-3"
    >
      <span className="font-mono-label block text-xs text-ink/50">
        {number}
      </span>
      <span className="font-semibold">{label}</span>
    </a>
  );
}
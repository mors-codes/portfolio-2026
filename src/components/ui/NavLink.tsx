"use client";

type NavLinkProps = {
  href: string;
  number: string;
  label: string;
  onItemHover: (label: string) => void;
};

export default function NavLink({
  href,
  number,
  label,
  onItemHover,
}: NavLinkProps) {
  return (
    
    <a
      href={href}
      onMouseEnter={() => onItemHover(label)}
      className="relative block px-4 py-3"
    >
      <span className="font-mono-label block text-xs opacity-50">
        {number}
      </span>
      <span className="font-semibold">{label}</span>
    </a>
  );
}
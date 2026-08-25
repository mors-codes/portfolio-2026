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
      <span className="inline-flex items-center gap-1 font-semibold">
        {label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M7 17L17 7M17 7H7M17 7V17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}
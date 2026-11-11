"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import PillNav from "@/components/ui/PillNav";
import MobileNav from "@/components/ui/MobileNav";
import StaggeredMenu, {
  type StaggeredMenuHandle,
} from "@/components/ui/StaggeredMenu";
import { useTheme } from "@/lib/useTheme";

// Links start with "/" so they work from any page, not only the home page.
const PILL_ITEMS = [
  { label: "Home", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Works", href: "/#works" },
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
];

const MENU_ITEMS = [
  { label: "About", ariaLabel: "Go to About section", link: "/#about" },
  { label: "Works", ariaLabel: "Go to Works section", link: "/#works" },
  { label: "Stack", ariaLabel: "Go to Stack section", link: "/#stack" },
  { label: "Contact", ariaLabel: "Go to Contact section", link: "/#contact" },
];

const SOCIAL_ITEMS = [
  { label: "GitHub", link: "https://github.com/mors-codes" },
  { label: "Facebook", link: "https://www.facebook.com/mors.matias" },
];

export default function SiteNav() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<StaggeredMenuHandle>(null);

  return (
    <>
      <div className="hidden md:block">
        <PillNav
          visible
          isDark={isDark}
          onToggleTheme={toggleTheme}
          items={PILL_ITEMS}
        />
      </div>
      <MobileNav
        hidden={menuOpen}
        onMenuToggle={() => menuRef.current?.toggle()}
        onLogoClick={() => router.push("/")}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <StaggeredMenu
        ref={menuRef}
        onOpenChange={setMenuOpen}
        colors={["#3a3a3a", "#2a2a2a"]}
        items={MENU_ITEMS}
        socialItems={SOCIAL_ITEMS}
        displaySocials
        displayItemNumbering
      />
    </>
  );
}
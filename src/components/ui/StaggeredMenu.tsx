"use client";

import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import "./StaggeredMenu.css";

type StaggeredMenuItem = {
  label: string;
  ariaLabel: string;
  link: string;
};

type StaggeredMenuSocialItem = {
  label: string;
  link: string;
};

type StaggeredMenuHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

type StaggeredMenuProps = {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  isFixed?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  onOpenChange?: (open: boolean) => void;
};

const StaggeredMenu = forwardRef<StaggeredMenuHandle, StaggeredMenuProps>(
  (
    {
      position = "right",
      colors = ["#1e1e22", "#35353c"],
      items = [],
      socialItems = [],
      displaySocials = true,
      displayItemNumbering = true,
      className,
      isFixed = true,
      closeOnClickAway = true,
      onMenuOpen,
      onMenuClose,
      onOpenChange,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const openRef = useRef(false);
    const panelRef = useRef<HTMLElement>(null);
    const preLayersRef = useRef<HTMLDivElement>(null);
    const preLayerElsRef = useRef<HTMLDivElement[]>([]);

    const openTlRef = useRef<gsap.core.Timeline | null>(null);
    const closeTweenRef = useRef<gsap.core.Tween | null>(null);
    const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);
    const busyRef = useRef(false);

    useLayoutEffect(() => {
      const ctx = gsap.context(() => {
        const panel = panelRef.current;
        const preContainer = preLayersRef.current;
        if (!panel) return;

        let preLayers: HTMLDivElement[] = [];
        if (preContainer) {
          preLayers = Array.from(
            preContainer.querySelectorAll<HTMLDivElement>(".sm-prelayer")
          );
        }
        preLayerElsRef.current = preLayers;

        const offscreen = position === "left" ? -100 : 100;
        gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
        if (preContainer) {
          gsap.set(preContainer, { xPercent: 0, opacity: 1 });
        }
      });
      return () => ctx.revert();
    }, [position]);

    const buildOpenTimeline = useCallback(() => {
      const panel = panelRef.current;
      const layers = preLayerElsRef.current;
      if (!panel) return null;

      openTlRef.current?.kill();
      if (closeTweenRef.current) {
        closeTweenRef.current.kill();
        closeTweenRef.current = null;
      }
      itemEntranceTweenRef.current?.kill();

      const itemEls = Array.from(
        panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel")
      );
      const numberEls = Array.from(
        panel.querySelectorAll<HTMLElement>(
          ".sm-panel-list[data-numbering] .sm-panel-number"
        )
      );
      const socialTitle = panel.querySelector<HTMLElement>(".sm-socials-title");
      const socialLinks = Array.from(
        panel.querySelectorAll<HTMLElement>(".sm-socials-link")
      );

      const offscreen = position === "left" ? -100 : 100;
      const layerStates = layers.map((el) => ({ el, start: offscreen }));
      const panelStart = offscreen;

      if (itemEls.length) {
        gsap.set(itemEls, { yPercent: 140, rotate: 10 });
      }
      if (numberEls.length) {
        gsap.set(numberEls, { opacity: 0 });
      }
      if (socialTitle) {
        gsap.set(socialTitle, { opacity: 0 });
      }
      if (socialLinks.length) {
        gsap.set(socialLinks, { y: 25, opacity: 0 });
      }

      const tl = gsap.timeline({ paused: true });

      layerStates.forEach((ls, i) => {
        tl.fromTo(
          ls.el,
          { xPercent: ls.start },
          { xPercent: 0, duration: 0.5, ease: "power4.out" },
          i * 0.07
        );
      });
      const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
      const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
      const panelDuration = 0.65;
      tl.fromTo(
        panel,
        { xPercent: panelStart },
        { xPercent: 0, duration: panelDuration, ease: "power4.out" },
        panelInsertTime
      );

      if (itemEls.length) {
        const itemsStartRatio = 0.15;
        const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
        tl.to(
          itemEls,
          {
            yPercent: 0,
            rotate: 0,
            duration: 1,
            ease: "power4.out",
            stagger: { each: 0.1, from: "start" },
          },
          itemsStart
        );
        if (numberEls.length) {
          tl.to(
            numberEls,
            {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: { each: 0.08, from: "start" },
            },
            itemsStart + 0.1
          );
        }
      }

      if (socialTitle || socialLinks.length) {
        const socialsStart = panelInsertTime + panelDuration * 0.4;
        if (socialTitle) {
          tl.to(
            socialTitle,
            { opacity: 1, duration: 0.5, ease: "power2.out" },
            socialsStart
          );
        }
        if (socialLinks.length) {
          tl.to(
            socialLinks,
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: "power3.out",
              stagger: { each: 0.08, from: "start" },
              onComplete: () => {
                gsap.set(socialLinks, { clearProps: "opacity" });
              },
            },
            socialsStart + 0.04
          );
        }
      }

      openTlRef.current = tl;
      return tl;
    }, [position]);

    const playOpen = useCallback(() => {
      if (busyRef.current) return;
      busyRef.current = true;
      const tl = buildOpenTimeline();
      if (tl) {
        tl.eventCallback("onComplete", () => {
          busyRef.current = false;
        });
        tl.play(0);
      } else {
        busyRef.current = false;
      }
    }, [buildOpenTimeline]);

    const playClose = useCallback(() => {
      openTlRef.current?.kill();
      openTlRef.current = null;
      itemEntranceTweenRef.current?.kill();

      const panel = panelRef.current;
      const layers = preLayerElsRef.current;
      if (!panel) return;

      const all = [...layers, panel];
      closeTweenRef.current?.kill();
      const offscreen = position === "left" ? -100 : 100;
      closeTweenRef.current = gsap.to(all, {
        xPercent: offscreen,
        duration: 0.32,
        ease: "power3.in",
        overwrite: "auto",
        onComplete: () => {
          const itemEls = Array.from(
            panel.querySelectorAll<HTMLElement>(".sm-panel-itemLabel")
          );
          if (itemEls.length) {
            gsap.set(itemEls, { yPercent: 140, rotate: 10 });
          }
          const numberEls = Array.from(
            panel.querySelectorAll<HTMLElement>(
              ".sm-panel-list[data-numbering] .sm-panel-number"
            )
          );
          if (numberEls.length) {
            gsap.set(numberEls, { opacity: 0 });
          }
          const socialTitle = panel.querySelector<HTMLElement>(
            ".sm-socials-title"
          );
          const socialLinks = Array.from(
            panel.querySelectorAll<HTMLElement>(".sm-socials-link")
          );
          if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
          if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
          busyRef.current = false;
        },
      });
    }, [position]);

    const openMenu = useCallback(() => {
      if (openRef.current) return;
      openRef.current = true;
      setOpen(true);
      onMenuOpen?.();
      onOpenChange?.(true);
      playOpen();
    }, [playOpen, onMenuOpen, onOpenChange]);

    const closeMenu = useCallback(() => {
      if (!openRef.current) return;
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      onOpenChange?.(false);
      playClose();
    }, [playClose, onMenuClose, onOpenChange]);

    const toggleMenu = useCallback(() => {
      if (openRef.current) {
        closeMenu();
      } else {
        openMenu();
      }
    }, [openMenu, closeMenu]);

    useImperativeHandle(ref, () => ({
      open: openMenu,
      close: closeMenu,
      toggle: toggleMenu,
    }));

    useLayoutEffect(() => {
      if (!closeOnClickAway || !open) return;

      const handleClickOutside = (event: MouseEvent) => {
        if (
          panelRef.current &&
          !panelRef.current.contains(event.target as Node)
        ) {
          closeMenu();
        }
      };

      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [closeOnClickAway, open, closeMenu]);

    return (
      <div
        className={
          (className ? className + " " : "") +
          "staggered-menu-wrapper" +
          (isFixed ? " fixed-wrapper" : "")
        }
        data-position={position}
        data-open={open || undefined}
      >
        <div ref={preLayersRef} className="sm-prelayers" aria-hidden="true">
          {colors.slice(0, 4).map((c, i) => (
            <div key={i} className="sm-prelayer" style={{ background: c }} />
          ))}
        </div>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel"
          aria-hidden={!open}
        >
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="sm-close-button"
          >
            <span
              style={{
                display: "block",
                position: "absolute",
                top: "50%",
                left: "50%",
                height: "4px",
                width: "60px",
                backgroundColor: "#efefef",
                borderRadius: "9999px",
                transform: "translate(-50%, -50%) rotate(45deg)",
              }}
            />
            <span
              style={{
                display: "block",
                position: "absolute",
                top: "50%",
                left: "50%",
                height: "4px",
                width: "60px",
                backgroundColor: "#efefef",
                borderRadius: "9999px",
                transform: "translate(-50%, -50%) rotate(-45deg)",
              }}
            />
          </button>
          <div className="sm-panel-inner">
            <ul
              className="sm-panel-list"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items.map((it, idx) => (
                <li className="sm-panel-itemWrap" key={it.label + idx}>
                  <a
                    className="sm-panel-item"
                    href={it.link}
                    aria-label={it.ariaLabel}
                    onClick={closeMenu}
                  >
                    {displayItemNumbering && (
                      <span className="sm-panel-number font-mono-label">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    )}
                    <span className="sm-panel-itemLabel">{it.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {displaySocials && socialItems.length > 0 && (
              <div className="sm-socials" aria-label="Social links">
                <h3 className="sm-socials-title font-sans">Socials</h3>
                <ul className="sm-socials-list" role="list">
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link font-sans"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    );
  }
);

StaggeredMenu.displayName = "StaggeredMenu";

export default StaggeredMenu;
export type { StaggeredMenuHandle, StaggeredMenuItem, StaggeredMenuSocialItem };
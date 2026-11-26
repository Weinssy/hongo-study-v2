"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { href: "/kartu", label: "Kartu" },
  { href: "/belajar", label: "Belajar" },
  { href: "/kuis", label: "Kuis" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tentang", label: "Tentang" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const headerRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);
  const [isWide, setIsWide] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [supportsPopover, setSupportsPopover] = useState(true);
  const lastCollapsedWidthRef = useRef<number>(0);

  const measureLayout = useCallback((force = false) => {
    const header = headerRef.current;
    const inner = innerRef.current;
    const menu = menuRef.current;
    if (!header || !inner || !menu) return;

    const wasWide = header.classList.contains("is-wide");
    const currentWidth = header.clientWidth;

    if (
      !force &&
      !wasWide &&
      lastCollapsedWidthRef.current > 0 &&
      currentWidth <= lastCollapsedWidthRef.current
    ) {
      return;
    }

    const hasNativePopover = Object.hasOwn(HTMLElement.prototype, "popover");
    const wasOpen = hasNativePopover
      ? menu.matches(":popover-open")
      : menu.classList.contains(":popover-open");

    header.classList.add("is-measuring", "is-wide");
    if (hasNativePopover) menu.removeAttribute("popover");
    menu.classList.remove(":popover-open");

    const fits = inner.scrollWidth <= Math.min(inner.clientWidth, document.documentElement.clientWidth);
    if (fits) {
      lastCollapsedWidthRef.current = 0;
      setIsWide(true);
      setMenuOpen(false);
    } else {
      header.classList.remove("is-wide");
      if (hasNativePopover) menu.setAttribute("popover", "auto");
      lastCollapsedWidthRef.current = currentWidth;
      setIsWide(false);
      if (wasOpen) {
        if (hasNativePopover && typeof menu.showPopover === "function") {
          try {
            menu.showPopover();
            setMenuOpen(true);
          } catch {
            setMenuOpen(false);
          }
        } else {
          menu.classList.add(":popover-open");
          setMenuOpen(true);
        }
      }
    }

    requestAnimationFrame(() => {
      header.classList.remove("is-measuring");
    });
  }, []);

  useEffect(() => {
    const hasNativePopover = Object.hasOwn(HTMLElement.prototype, "popover");
    setSupportsPopover(hasNativePopover);
    measureLayout(true);

    const header = headerRef.current;
    const menu = menuRef.current;
    if (!header || !menu) return;

    const ro = new ResizeObserver(() => {
      measureLayout();
    });
    ro.observe(header);
    ro.observe(menu);

    const handleToggle = (event: Event) => {
      const toggleEvent = event as ToggleEvent;
      setMenuOpen(toggleEvent.newState === "open");
    };
    menu.addEventListener("toggle", handleToggle);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !hasNativePopover && menu.classList.contains(":popover-open")) {
        menu.classList.remove(":popover-open");
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      ro.disconnect();
      menu.removeEventListener("toggle", handleToggle);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [measureLayout]);

  useEffect(() => {
    measureLayout(true);
  }, [user, loading, measureLayout]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu || isWide) return;
    if (supportsPopover && menu.matches(":popover-open") && typeof menu.hidePopover === "function") {
      try {
        menu.hidePopover();
      } catch {
        // abaikan jika popover sudah tertutup
      }
    }
    menu.classList.remove(":popover-open");
    setMenuOpen(false);
  }, [pathname, isWide, supportsPopover]);

  function handleFallbackMenuClick() {
    if (supportsPopover) return;
    const menu = menuRef.current;
    if (!menu) return;
    const next = !menu.classList.contains(":popover-open");
    menu.classList.toggle(":popover-open", next);
    setMenuOpen(next);
  }

  return (
    <header
      ref={headerRef}
      className={`site-header${isWide ? " is-wide" : ""}${isScrolled ? " is-scrolled" : ""}`}
    >
      <div ref={innerRef} className="header-inner">
        <Link href="/" className="brand-link" aria-current={pathname === "/" ? "page" : undefined}>
          <span className="brand-seal" aria-hidden="true" lang="ja">
            語
          </span>
          <span>Hongo Study</span>
          <span className="brand-ver">v2</span>
        </Link>

        <nav className="site-nav" aria-label="Utama">
          <button
            type="button"
            className="menu-button"
            popoverTarget={supportsPopover ? "site-menu" : undefined}
            popoverTargetAction={supportsPopover ? "toggle" : undefined}
            aria-controls="site-menu"
            aria-expanded={menuOpen}
            onClick={handleFallbackMenuClick}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M4 7h16M4 12h16M4 17h16" />
            </svg>
            <span>Menu</span>
          </button>

          <ul
            ref={menuRef}
            id="site-menu"
            className="site-menu"
            {...(supportsPopover ? { popover: "auto" } : {})}
          >
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={active ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="menu-account-item">
              {loading ? (
                <span className="account-note">Memeriksa sesi…</span>
              ) : user ? (
                <div className="menu-account-row">
                  <span className="account-email-mobile" title={user.email ?? ""}>
                    {user.email}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => void signOut()}
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/masuk"
                  className="nav-link"
                  aria-current={pathname === "/masuk" ? "page" : undefined}
                >
                  Masuk akun
                </Link>
              )}
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
          <div className="header-account-inline">
            {loading ? (
              <span className="account-note">Memeriksa sesi…</span>
            ) : user ? (
              <>
                <span className="account-email" title={user.email ?? ""}>
                  {user.email}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => void signOut()}
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link href="/masuk" className="btn btn-ghost">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

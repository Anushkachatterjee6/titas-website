import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, Phone, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import { BrandRibbon } from "./BrandRibbon";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";
import { company, telHref } from "@/data/company";
import { legalDocs, legalPaths } from "@/data/legal";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Products", to: "/products" },
  { label: "Our Services", to: "/services" },
  { label: "Quality & Process", to: "/quality" },
  { label: "Gallery", to: "/gallery" },
  { label: "FAQs", to: "/faqs" },
];
const servicesMenu = [
  { label: "Services", to: "/services" },
  { label: "Become a Distributor", to: "/dealer-distributor" },
];
const contactItem = { label: "Contact", to: "/contact" } as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [legalMobileOpen, setLegalMobileOpen] = useState(false);
  const legalRef = useRef<HTMLLIElement>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [servicesMobileOpen, setServicesMobileOpen] = useState(false);
  const servicesRef = useRef<HTMLLIElement>(null);
  const { count, openCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setLegalOpen(false);
    setLegalMobileOpen(false);
    setServicesOpen(false);
    setServicesMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the Legal dropdown on outside click / Escape (keyboard support).
  useEffect(() => {
    if (!legalOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (legalRef.current && !legalRef.current.contains(e.target as Node)) {
        setLegalOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLegalOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [legalOpen]);

  // Close the Our Services dropdown on outside click / Escape.
  useEffect(() => {
    if (!servicesOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setServicesOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [servicesOpen]);

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname.startsWith(to);
  const isLegalActive = Object.values(legalPaths).some((p) => pathname.startsWith(p));
  const isServicesActive =
    pathname.startsWith("/services") || pathname.startsWith("/dealer-distributor");

  return (
    <>
      <div className="surface-deep hidden text-[0.72rem] tracking-[0.04em] md:block">
        <div className="container-page flex h-9 items-center justify-between text-ink-foreground/70">
          <p>
            {company.supportingLine} · {company.sinceLine}
          </p>
          <div className="flex items-center gap-5">
            <a
              href={telHref}
              className="transition-colors hover:text-ink-foreground"
            >
              Call {company.phone}
            </a>
            <span aria-hidden="true" className="text-ink-foreground/25">
              |
            </span>
            <p>
              {company.hours.weekdays} · {company.hours.closed}
            </p>
          </div>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "glass-panel border-x-0 border-t-0 border-b border-border/70"
            : "border-b border-transparent bg-background/85 backdrop-blur-sm",
        )}
      >
        <div className="container-page flex h-[4.25rem] items-center justify-between gap-3 md:h-20">
          <Logo className="shrink-0" />

          <nav aria-label="Main" className="hidden shrink-0 lg:block">
            <ul className="flex flex-nowrap items-center gap-0.5 whitespace-nowrap">
              {navItems.map((item) =>
                item.to === "/services" ? (
                  <li
                    key={item.to}
                    ref={servicesRef}
                    className="relative shrink-0"
                    onMouseEnter={() => setServicesOpen(true)}
                    onMouseLeave={() => setServicesOpen(false)}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                        setServicesOpen(false);
                      }
                    }}
                  >
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={servicesOpen}
                      onClick={() => setServicesOpen((v) => !v)}
                      onFocus={() => setServicesOpen(true)}
                      className={cn(
                        "relative flex flex-nowrap items-center gap-1 rounded-md px-2.5 py-2 text-[0.94rem] font-semibold whitespace-nowrap transition-colors",
                        isServicesActive ? "text-primary" : "text-ink/75 hover:text-primary",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("size-3.5 transition-transform duration-200", servicesOpen && "rotate-180")}
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-aqua transition-transform duration-300",
                          isServicesActive ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>

                    <div
                      role="menu"
                      aria-label="Our Services"
                      className={cn(
                        "absolute top-full left-0 z-10 mt-1 w-56 origin-top-left rounded-lg border border-border bg-card py-2 shadow-float transition-all duration-150",
                        servicesOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0",
                      )}
                    >
                      {servicesMenu.map((entry) => (
                        <Link
                          key={entry.to}
                          role="menuitem"
                          to={entry.to}
                          onClick={() => setServicesOpen(false)}
                          className={cn(
                            "block px-4 py-2 text-sm transition-colors",
                            pathname.startsWith(entry.to)
                              ? "text-primary"
                              : "text-ink/80 hover:bg-accent hover:text-primary",
                          )}
                        >
                          {entry.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                ) : (
                  <li key={item.to} className="shrink-0">
                    <Link
                      to={item.to}
                      className={cn(
                        "relative rounded-md px-2.5 py-2 text-[0.94rem] font-semibold whitespace-nowrap transition-colors",
                        isActive(item.to)
                          ? "text-primary"
                          : "text-ink/75 hover:text-primary",
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-aqua transition-transform duration-300",
                          isActive(item.to) ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </Link>
                  </li>
                ),
              )}

              <li
                ref={legalRef}
                className="relative shrink-0"
                onMouseEnter={() => setLegalOpen(true)}
                onMouseLeave={() => setLegalOpen(false)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                    setLegalOpen(false);
                  }
                }}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={legalOpen}
                  onClick={() => setLegalOpen((v) => !v)}
                  onFocus={() => setLegalOpen(true)}
                  className={cn(
                    "relative flex flex-nowrap items-center gap-1 rounded-md px-2.5 py-2 text-[0.94rem] font-semibold whitespace-nowrap transition-colors",
                    isLegalActive ? "text-primary" : "text-ink/75 hover:text-primary",
                  )}
                >
                  Legal
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("size-3.5 transition-transform duration-200", legalOpen && "rotate-180")}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-aqua transition-transform duration-300",
                      isLegalActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>

                <div
                  role="menu"
                  aria-label="Legal pages"
                  className={cn(
                    "absolute top-full right-0 z-10 mt-1 w-60 origin-top-right rounded-lg border border-border bg-card py-2 shadow-float transition-all duration-150",
                    legalOpen
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "pointer-events-none -translate-y-1 opacity-0",
                  )}
                >
                  {legalDocs.map((d) => (
                    <Link
                      key={d.slug}
                      role="menuitem"
                      to={legalPaths[d.slug]}
                      onClick={() => setLegalOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors",
                        pathname.startsWith(legalPaths[d.slug])
                          ? "text-primary"
                          : "text-ink/80 hover:bg-accent hover:text-primary",
                      )}
                    >
                      {d.navLabel}
                    </Link>
                  ))}
                </div>
              </li>

              <li className="shrink-0">
                <Link
                  to={contactItem.to}
                  className={cn(
                    "relative rounded-md px-2.5 py-2 text-[0.94rem] font-semibold whitespace-nowrap transition-colors",
                    isActive(contactItem.to) ? "text-primary" : "text-ink/75 hover:text-primary",
                  )}
                >
                  {contactItem.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-aqua transition-transform duration-300",
                      isActive(contactItem.to) ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden text-ink sm:inline-flex"
            >
              <a href={telHref} aria-label={`Call TiTAS on ${company.phone}`}>
                <Phone />
              </a>
            </Button>

            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              className="relative flex size-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingBag className="size-4" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 text-[0.6rem] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>

            <Link
              to={user ? "/account" : "/login"}
              aria-label={user ? "My account" : "Login"}
              className={cn(
                "flex size-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-accent hover:text-accent-foreground",
                authLoading && "opacity-0",
              )}
            >
              <User className="size-4" aria-hidden="true" />
            </Link>

            <Button asChild variant="brand" size="lg" className="hidden sm:inline-flex">
              <Link to="/products">Order Now</Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-accent lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden="true" />
              ) : (
                <Menu className="size-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </header>

      <BrandRibbon />

      {/* Mobile navigation */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-ink/45 transition-opacity duration-400",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
        />
        <nav
          aria-label="Mobile"
          className={cn(
            "absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-background pt-[6.5rem] pb-10 shadow-float transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            menuOpen ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="container-page">
            <ul className="divide-y divide-border">
              {navItems.map((item) =>
                item.to === "/services" ? (
                  <li key={item.to}>
                    <button
                      type="button"
                      aria-expanded={servicesMobileOpen}
                      onClick={() => setServicesMobileOpen((v) => !v)}
                      className={cn(
                        "flex w-full items-center justify-between py-4 text-lg font-medium",
                        isServicesActive ? "text-primary" : "text-ink",
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "size-4 transition-transform duration-200",
                          servicesMobileOpen && "rotate-180",
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300",
                        servicesMobileOpen ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]",
                      )}
                    >
                      <ul className="min-h-0">
                        {servicesMenu.map((entry) => (
                          <li key={entry.to}>
                            <Link
                              to={entry.to}
                              onClick={() => setMenuOpen(false)}
                              className={cn(
                                "block py-2.5 pl-4 text-base",
                                pathname.startsWith(entry.to) ? "text-primary" : "text-ink/70",
                              )}
                            >
                              {entry.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-4 text-lg font-medium",
                        isActive(item.to) ? "text-primary" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}

              <li>
                <button
                  type="button"
                  aria-expanded={legalMobileOpen}
                  onClick={() => setLegalMobileOpen((v) => !v)}
                  className={cn(
                    "flex w-full items-center justify-between py-4 text-lg font-medium",
                    isLegalActive ? "text-primary" : "text-ink",
                  )}
                >
                  Legal
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("size-4 transition-transform duration-200", legalMobileOpen && "rotate-180")}
                  />
                </button>
                <div
                  className={cn(
                    "grid overflow-hidden transition-all duration-300",
                    legalMobileOpen ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]",
                  )}
                >
                  <ul className="min-h-0">
                    {legalDocs.map((d) => (
                      <li key={d.slug}>
                        <Link
                          to={legalPaths[d.slug]}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "block py-2.5 pl-4 text-base",
                            pathname.startsWith(legalPaths[d.slug]) ? "text-primary" : "text-ink/70",
                          )}
                        >
                          {d.navLabel}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>

              <li>
                <Link
                  to={contactItem.to}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between py-4 text-lg font-medium",
                    isActive(contactItem.to) ? "text-primary" : "text-ink",
                  )}
                >
                  {contactItem.label}
                </Link>
              </li>
            </ul>
            <div className="mt-7 grid gap-3">
              <Button asChild variant="brand" size="xl">
                <Link to="/products" onClick={() => setMenuOpen(false)}>
                  Order Now
                </Link>
              </Button>
              <Button asChild variant="quiet" size="xl">
                <Link to={user ? "/account" : "/login"} onClick={() => setMenuOpen(false)}>
                  <User className="size-4" aria-hidden="true" />
                  {user ? "My Account" : "Login / Sign Up"}
                </Link>
              </Button>
              <Button asChild variant="quiet" size="xl">
                <Link to="/dealer-distributor" onClick={() => setMenuOpen(false)}>
                  Become a Distributor
                </Link>
              </Button>
            </div>
            <p className="mt-7 text-sm text-muted-foreground">
              {company.hours.weekdays} · {company.hours.closed}
            </p>
          </div>
        </nav>
      </div>
    </>
  );
}

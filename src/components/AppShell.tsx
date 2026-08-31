import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf, MapPin, CloudSun, Beef, FileText } from "lucide-react";
import type { ReactNode } from "react";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/lib/i18n";

const nav = {
  en: [
    { to: "/", label: "Check", icon: Leaf },
    { to: "/map", label: "Help map", icon: MapPin },
    { to: "/mausam", label: "Weather", icon: CloudSun },
    { to: "/pashudhan", label: "Livestock", icon: Beef },
    { to: "/bima", label: "Insurance", icon: FileText },
  ],
  hi: [
    { to: "/", label: "जाँच", icon: Leaf },
    { to: "/map", label: "सहायता नक्शा", icon: MapPin },
    { to: "/mausam", label: "मौसम", icon: CloudSun },
    { to: "/pashudhan", label: "पशुधन", icon: Beef },
    { to: "/bima", label: "बीमा", icon: FileText },
  ],
} as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { language, setLanguage } = useLanguage();
  const navItems = language === "en" ? nav.en : nav.hi;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-card/90 px-5 pb-3 pt-4 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">AgriConnect</span>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] font-medium text-muted-foreground">
              {language === "en" ? "EN" : "हिंदी"}
            </span>
            <Switch
              checked={language === "hi"}
              onCheckedChange={(checked) => setLanguage(checked ? "hi" : "en")}
              aria-label="Toggle language"
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>
        <h1 className="mt-3 text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </header>

      <main className="flex-1 space-y-4 px-5 py-5">
        {children}
      </main>

      <nav className="sticky bottom-0 z-20 grid grid-cols-5 border-t border-border bg-card/95 backdrop-blur">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = path === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] ${active ? "stroke-[2.4]" : ""}`} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

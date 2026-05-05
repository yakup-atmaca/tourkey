"use client";

import { type ReactNode } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Globe, Menu, LayoutDashboard, MapPin, PlusCircle, CreditCard,
  Handshake, FileText, Building2, LogOut
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "/marketplace", icon: MapPin, labelKey: "marketplace" },
  { href: "/tours/create", icon: PlusCircle, labelKey: "createTour" },
  { href: "/tickets/sell", icon: CreditCard, labelKey: "sellTicket" },
  { href: "/partnerships", icon: Handshake, labelKey: "partnerships" },
  { href: "/reports", icon: FileText, labelKey: "reports" },
  { href: "/admin/companies", icon: Building2, labelKey: "companies" },
];

export default function ShellLayout({ children, title, subtitle }: { children: ReactNode; title?: string; subtitle?: string }) {
  const router = useRouter();
  const tn = useTranslations("navigation");
  const handleLogout = () => { localStorage.clear(); router.push("/login"); };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-primary" />
                    TourKey
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-4 gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      {tn(item.labelKey)}
                    </Link>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    {tn("logout")}
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg tracking-tight">
              <div className="w-8 h-8 rounded-lg metallic-header flex items-center justify-center">
                <Globe className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:inline">TourKey</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {tn(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="hidden md:flex text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        {(title || subtitle) && (
          <div className="flex flex-col gap-1">
            {title && <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>}
            {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

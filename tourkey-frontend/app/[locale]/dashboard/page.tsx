"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { DollarSign, Ticket, Users, Handshake } from "lucide-react";
import ShellLayout from "@/components/ShellLayout";

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  ownTourSales: number;
  ownTourRevenue: number;
  partnerTourSales: number;
  partnerTourRevenue: number;
  pendingPartnerships: number;
  activePartnerships: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    api.get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">{t("loading")}</p>
        </div>
      </div>
    );
  }

  const statCards = [
    { title: t("totalSales"), value: stats?.totalSales ?? 0, icon: Ticket, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: t("totalRevenue"), value: stats?.totalRevenue ?? 0, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: t("activePartnerships"), value: stats?.activePartnerships ?? 0, icon: Handshake, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: t("pendingOffers"), value: stats?.pendingPartnerships ?? 0, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <ShellLayout title={t("title")} subtitle="TourKey B2B Platform">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="metallic-card border-0 hover:scale-[1.02] transition-transform duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="metallic-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t("ownOperations")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Ticket className="h-4 w-4" /></div>
                <span className="text-sm text-muted-foreground">{t("ownSalesCount")}</span>
              </div>
              <span className="text-xl font-bold">{stats?.ownTourSales ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><DollarSign className="h-4 w-4" /></div>
                <span className="text-sm text-muted-foreground">{t("ownRevenue")}</span>
              </div>
              <span className="text-xl font-bold">{stats?.ownTourRevenue ?? 0}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="metallic-card border-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">{t("partnerSales")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500"><Ticket className="h-4 w-4" /></div>
                <span className="text-sm text-muted-foreground">{t("partnerSalesCount")}</span>
              </div>
              <span className="text-xl font-bold">{stats?.partnerTourSales ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><DollarSign className="h-4 w-4" /></div>
                <span className="text-sm text-muted-foreground">{t("partnerRevenue")}</span>
              </div>
              <span className="text-xl font-bold">{stats?.partnerTourRevenue ?? 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ShellLayout>
  );
}

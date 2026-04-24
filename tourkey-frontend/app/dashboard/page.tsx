"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { DollarSign, Ticket, Users, Handshake } from "lucide-react";

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
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    api.get("/dashboard/stats")
      .then((res) => setStats(res.data))
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yukleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <a href="/marketplace" className="text-sm underline text-primary">Pazaryeri</a>
          <a href="/tours/create" className="text-sm underline text-primary">Tur Olustur</a>
          <a href="/tickets/sell" className="text-sm underline text-primary">Bilet Sat</a>
          <a href="/partnerships" className="text-sm underline text-primary">Anlasmalar</a>
          <a href="/reports" className="text-sm underline text-primary">Raporlar</a>
          <a href="/admin/companies" className="text-sm underline text-primary">Firmalar</a>
          <button
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="text-sm text-destructive underline"
          >
            Cikis
          </button>
        </div>
      </header>
      <main className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toplam Satis</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalSales ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalRevenue ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aktif Ortaklik</CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.activePartnerships ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen Teklif</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pendingPartnerships ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Kendi Operasyonlarim</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Satis Adedi</span>
                <span className="font-semibold">{stats?.ownTourSales ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gelir</span>
                <span className="font-semibold">{stats?.ownTourRevenue ?? 0}</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Partnerlikten Gelen Satislar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Satis Adedi</span>
                <span className="font-semibold">{stats?.partnerTourSales ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gelir</span>
                <span className="font-semibold">{stats?.partnerTourRevenue ?? 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

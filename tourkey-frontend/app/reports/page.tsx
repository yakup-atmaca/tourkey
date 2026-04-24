"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Download, FileText } from "lucide-react";

interface Ticket {
  id: number;
  ticketNumber: string;
  sellerCompanyName: string;
  organizerCompanyName: string;
  tourName: string;
  scheduleDate: string;
  saleDate: string;
  netTotal: number;
  commissionAmount: number;
  grossTotal: number;
  currency: string;
  status: string;
  pickupLocation: string;
  passengerCount: number;
}

interface FinancialTransaction {
  id: number;
  transactionType: string;
  amount: number;
  currency: string;
  description: string;
  transactionDate: string;
  counterpartyCompanyName: string | null;
}

export default function ReportsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get("/tickets/my-sales"),
      api.get("/tickets/my-tours"),
    ]).then(([salesRes, toursRes]) => {
      const allTickets = [...salesRes.data, ...toursRes.data];
      // Remove duplicates by id
      const unique = allTickets.filter((t: Ticket, i: number, arr: Ticket[]) => arr.findIndex(x => x.id === t.id) === i);
      setTickets(unique.map((t: any) => ({
        ...t,
        passengerCount: t.passengers?.length || 0
      })));
    }).catch(() => {});
    
    // Financial transactions endpoint doesn't exist yet, so we'll skip for now
    setLoading(false);
  };

  const filteredTickets = tickets.filter(t => {
    if (!startDate && !endDate) return true;
    const saleDate = new Date(t.saleDate);
    if (startDate && saleDate < new Date(startDate)) return false;
    if (endDate && saleDate > new Date(endDate + "T23:59:59")) return false;
    return true;
  });

  const totalSales = filteredTickets.filter(t => t.status === "CONFIRMED").reduce((sum, t) => sum + t.grossTotal, 0);
  const totalCommission = filteredTickets.filter(t => t.status === "CONFIRMED").reduce((sum, t) => sum + (t.commissionAmount || 0), 0);

  const downloadPdf = (ticketId: number) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/reports/ticket/${ticketId}/pdf`, "_blank");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <Badge className="bg-green-600">Onayli</Badge>;
      case "CANCELLED": return <Badge variant="destructive">Iptal</Badge>;
      case "REFUNDED": return <Badge variant="secondary">Iade</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Raporlar</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm underline text-primary">Dashboard</a>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-sm text-destructive underline">Cikis</button>
        </div>
      </header>
      <main className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtrele</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Baslangic Tarihi</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Bitis Tarihi</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => { setStartDate(""); setEndDate(""); }}>Filtreleri Temizle</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Toplam Satis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTickets.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSales.toFixed(2)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Toplam Komisyon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCommission.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tickets">
          <TabsList>
            <TabsTrigger value="tickets">Biletler</TabsTrigger>
            <TabsTrigger value="my-sales">Satislarim</TabsTrigger>
            <TabsTrigger value="my-tours">Tur Satislarim</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Bilet No</th>
                    <th className="px-4 py-3 text-left">Tur</th>
                    <th className="px-4 py-3 text-left">Tarih</th>
                    <th className="px-4 py-3 text-left">Satici</th>
                    <th className="px-4 py-3 text-left">Duzenleyen</th>
                    <th className="px-4 py-3 text-right">Tutar</th>
                    <th className="px-4 py-3 text-center">Durum</th>
                    <th className="px-4 py-3 text-center">Islem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{t.ticketNumber}</td>
                      <td className="px-4 py-3">{t.tourName}</td>
                      <td className="px-4 py-3">{new Date(t.scheduleDate).toLocaleDateString("tr-TR")}</td>
                      <td className="px-4 py-3">{t.sellerCompanyName}</td>
                      <td className="px-4 py-3">{t.organizerCompanyName}</td>
                      <td className="px-4 py-3 text-right">{t.grossTotal.toFixed(2)} {t.currency}</td>
                      <td className="px-4 py-3 text-center">{statusBadge(t.status)}</td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => downloadPdf(t.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        Kayit bulunamadi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="my-sales" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Bilet No</th>
                    <th className="px-4 py-3 text-left">Tur</th>
                    <th className="px-4 py-3 text-left">Duzenleyen</th>
                    <th className="px-4 py-3 text-right">Net</th>
                    <th className="px-4 py-3 text-right">Komisyon</th>
                    <th className="px-4 py-3 text-right">Brut</th>
                    <th className="px-4 py-3 text-center">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.filter(t => t.status === "CONFIRMED").map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{t.ticketNumber}</td>
                      <td className="px-4 py-3">{t.tourName}</td>
                      <td className="px-4 py-3">{t.organizerCompanyName}</td>
                      <td className="px-4 py-3 text-right">{t.netTotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">{t.commissionAmount?.toFixed(2) || "0.00"}</td>
                      <td className="px-4 py-3 text-right font-semibold">{t.grossTotal.toFixed(2)} {t.currency}</td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => downloadPdf(t.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="my-tours" className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Bilet No</th>
                    <th className="px-4 py-3 text-left">Tur</th>
                    <th className="px-4 py-3 text-left">Satici</th>
                    <th className="px-4 py-3 text-right">Net</th>
                    <th className="px-4 py-3 text-right">Komisyon</th>
                    <th className="px-4 py-3 text-right">Brut</th>
                    <th className="px-4 py-3 text-center">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.filter(t => t.status === "CONFIRMED").map((t) => (
                    <tr key={t.id} className="border-t">
                      <td className="px-4 py-3 font-medium">{t.ticketNumber}</td>
                      <td className="px-4 py-3">{t.tourName}</td>
                      <td className="px-4 py-3">{t.sellerCompanyName}</td>
                      <td className="px-4 py-3 text-right">{t.netTotal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">{t.commissionAmount?.toFixed(2) || "0.00"}</td>
                      <td className="px-4 py-3 text-right font-semibold">{t.grossTotal.toFixed(2)} {t.currency}</td>
                      <td className="px-4 py-3 text-center">
                        <Button size="sm" variant="ghost" onClick={() => downloadPdf(t.id)}>
                          <FileText className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

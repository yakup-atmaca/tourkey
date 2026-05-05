"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { Download, FileText } from "lucide-react";
import ShellLayout from "@/components/ShellLayout";

interface Ticket {
  id: number; ticketNumber: string; sellerCompanyName: string;
  organizerCompanyName: string; tourName: string; scheduleDate: string;
  saleDate: string; netTotal: number; commissionAmount: number;
  grossTotal: number; currency: string; status: string;
}

export default function ReportsPage() {
  const t = useTranslations("reports");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    setLoading(true);
    Promise.all([api.get("/tickets/my-sales"), api.get("/tickets/my-tours")])
      .then(([salesRes, toursRes]) => {
        const all = [...salesRes.data, ...toursRes.data];
        const unique = all.filter((t: Ticket, i: number, arr: Ticket[]) => arr.findIndex(x => x.id === t.id) === i);
        setTickets(unique);
      }).catch(() => {}).finally(() => setLoading(false));
  };

  const filtered = tickets.filter(t => {
    if (!startDate && !endDate) return true;
    const d = new Date(t.saleDate);
    if (startDate && d < new Date(startDate)) return false;
    if (endDate && d > new Date(endDate + "T23:59:59")) return false;
    return true;
  });

  const totalSales = filtered.filter(t => t.status === "CONFIRMED").reduce((s, t) => s + t.grossTotal, 0);
  const totalCommission = filtered.filter(t => t.status === "CONFIRMED").reduce((s, t) => s + (t.commissionAmount || 0), 0);

  const downloadPdf = (ticketId: number) => {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"}/reports/ticket/${ticketId}/pdf`, "_blank");
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED": return <Badge className="bg-emerald-500">{t("statusConfirmed")}</Badge>;
      case "CANCELLED": return <Badge variant="destructive">{t("statusCancelled")}</Badge>;
      case "REFUNDED": return <Badge variant="secondary">{t("statusRefunded")}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <ShellLayout title={t("title")}>
      <Card className="metallic-card border-0">
        <CardHeader><CardTitle className="text-base font-semibold">{t("filter")}</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2"><Label>{t("startDate")}</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>
          <div className="space-y-2"><Label>{t("endDate")}</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></div>
          <div className="flex items-end"><Button variant="outline" onClick={() => { setStartDate(""); setEndDate(""); }} className="w-full sm:w-auto">{t("clearFilters")}</Button></div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="metallic-card border-0"><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("totalSales")}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{filtered.length}</div></CardContent></Card>
        <Card className="metallic-card border-0"><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("totalRevenue")}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalSales.toFixed(2)}</div></CardContent></Card>
        <Card className="metallic-card border-0"><CardHeader className="pb-2"><CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("totalCommission")}</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{totalCommission.toFixed(2)}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="tickets">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="tickets" className="text-xs sm:text-sm">{t("tickets")}</TabsTrigger>
          <TabsTrigger value="my-sales" className="text-xs sm:text-sm">{t("mySales")}</TabsTrigger>
          <TabsTrigger value="my-tours" className="text-xs sm:text-sm">{t("myTours")}</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="mt-4">
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("ticketNo")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("tour")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("date")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap hidden lg:table-cell">{t("seller")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap hidden lg:table-cell">{t("organizer")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("amount")}</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">{t("status")}</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">{t("action")}</th>
              </tr></thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{t.ticketNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{t.tourName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{new Date(t.scheduleDate).toLocaleDateString("tr-TR")}</td>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">{t.sellerCompanyName}</td>
                    <td className="px-4 py-3 whitespace-nowrap hidden lg:table-cell">{t.organizerCompanyName}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t.grossTotal.toFixed(2)} {t.currency}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">{statusBadge(t.status)}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => downloadPdf(t.id)}><Download className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">{t("noRecords")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="my-sales" className="mt-4">
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("ticketNo")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("tour")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("organizer")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("net")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("commission")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("gross")}</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">{t("pdf")}</th>
              </tr></thead>
              <tbody>
                {filtered.filter(t => t.status === "CONFIRMED").map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{t.ticketNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{t.tourName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{t.organizerCompanyName}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t.netTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t.commissionAmount?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{t.grossTotal.toFixed(2)} {t.currency}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => downloadPdf(t.id)}><FileText className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="my-tours" className="mt-4">
          <div className="overflow-x-auto border rounded-xl">
            <table className="w-full text-sm">
              <thead className="bg-muted"><tr>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("ticketNo")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("tour")}</th>
                <th className="px-4 py-3 text-left whitespace-nowrap">{t("seller")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("net")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("commission")}</th>
                <th className="px-4 py-3 text-right whitespace-nowrap">{t("gross")}</th>
                <th className="px-4 py-3 text-center whitespace-nowrap">{t("pdf")}</th>
              </tr></thead>
              <tbody>
                {filtered.filter(t => t.status === "CONFIRMED").map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3 font-medium whitespace-nowrap">{t.ticketNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{t.tourName}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{t.sellerCompanyName}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t.netTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">{t.commissionAmount?.toFixed(2) || "0.00"}</td>
                    <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{t.grossTotal.toFixed(2)} {t.currency}</td>
                    <td className="px-4 py-3 text-center whitespace-nowrap">
                      <Button size="sm" variant="ghost" onClick={() => downloadPdf(t.id)}><FileText className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </ShellLayout>
  );
}

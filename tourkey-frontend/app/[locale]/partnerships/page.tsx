"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import ShellLayout from "@/components/ShellLayout";
import { PlusCircle } from "lucide-react";

interface Partnership {
  id: number;
  requesterCompanyName: string;
  recipientCompanyName: string;
  status: string;
  isBidirectional: boolean;
  pricingPolicy: any;
}

export default function PartnershipsPage() {
  const router = useRouter();
  const t = useTranslations("partnerships");
  const [active, setActive] = useState<Partnership[]>([]);
  const [pending, setPending] = useState<Partnership[]>([]);
  const [sent, setSent] = useState<Partnership[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [policyType, setPolicyType] = useState("COMMISSION_PERCENTAGE");
  const [commissionRate, setCommissionRate] = useState("");
  const [fixedMarkup, setFixedMarkup] = useState("");
  const [isBidirectional, setIsBidirectional] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = () => {
    api.get("/partnerships/active").then((res) => setActive(res.data));
    api.get("/partnerships/pending").then((res) => setPending(res.data));
    api.get("/partnerships/sent").then((res) => setSent(res.data));
    api.get("/companies/available").then((res) => setCompanies(res.data));
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const policy = { policyType, commissionRate: policyType === "COMMISSION_PERCENTAGE" ? parseFloat(commissionRate) : null, fixedMarkup: policyType === "FIXED_MARKUP" ? parseFloat(fixedMarkup) : null, currency: "TRY" };
    await api.post(`/partnerships/request?recipientCompanyId=${selectedCompany}&isBidirectional=${isBidirectional}`, policy);
    setOpen(false); setSelectedCompany(""); setCommissionRate(""); setFixedMarkup(""); fetchData();
  };

  const handleApprove = async (id: number) => { await api.post(`/partnerships/${id}/approve`); fetchData(); };

  const statusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-emerald-500 hover:bg-emerald-600">{t("statusActive")}</Badge>;
      case "PENDING": return <Badge variant="secondary">{t("statusPending")}</Badge>;
      case "REJECTED": return <Badge variant="destructive">{t("statusRejected")}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <ShellLayout title={t("title")} subtitle={t("partnershipsList")}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="metallic-header border-0 shadow-lg hover:opacity-90 w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />{t("newOffer")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{t("newOffer")}</DialogTitle></DialogHeader>
            <form onSubmit={handleRequest} className="space-y-4">
              <div className="space-y-2"><Label>{t("companySelect")}</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger><SelectValue placeholder={t("companySelect")} /></SelectTrigger>
                  <SelectContent>{companies.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>{t("policyType")}</Label>
                <Select value={policyType} onValueChange={setPolicyType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMMISSION_PERCENTAGE">{t("commissionRate")}</SelectItem>
                    <SelectItem value="FIXED_MARKUP">{t("fixedAmount")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {policyType === "COMMISSION_PERCENTAGE" ? (
                <div className="space-y-2"><Label>{t("commissionRate")}</Label><Input type="number" step="0.01" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} required /></div>
              ) : (
                <div className="space-y-2"><Label>{t("fixedAmount")}</Label><Input type="number" step="0.01" value={fixedMarkup} onChange={(e) => setFixedMarkup(e.target.value)} required /></div>
              )}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="bidirectional" checked={isBidirectional} onChange={(e) => setIsBidirectional(e.target.checked)} className="rounded border-input" />
                <Label htmlFor="bidirectional" className="font-normal text-sm">{t("bidirectional")}</Label>
              </div>
              <DialogFooter><Button type="submit" className="metallic-header border-0">{t("sendOffer")}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="active" className="text-xs sm:text-sm">{t("active")} <span className="hidden sm:inline ml-1">({active.length})</span></TabsTrigger>
          <TabsTrigger value="pending" className="text-xs sm:text-sm">{t("pending")} <span className="hidden sm:inline ml-1">({pending.length})</span></TabsTrigger>
          <TabsTrigger value="sent" className="text-xs sm:text-sm">{t("sent")} <span className="hidden sm:inline ml-1">({sent.length})</span></TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-3 mt-4">
          {active.map((p) => (
            <Card key={p.id} className="metallic-card border-0">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-sm font-semibold">{p.requesterCompanyName} <span className="text-muted-foreground font-normal">-</span> {p.recipientCompanyName}</CardTitle>
                  {statusBadge(p.status)}
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>{t("policyType")}: {p.pricingPolicy?.policyType === "COMMISSION_PERCENTAGE" ? t("policyCommission", { rate: p.pricingPolicy.commissionRate }) : t("policyFixed", { amount: p.pricingPolicy?.fixedMarkup ?? 0 })}</p>
                <p className="text-muted-foreground">{t("bidirectional")}: {p.isBidirectional ? t("yes") : t("no")}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="pending" className="space-y-3 mt-4">
          {pending.map((p) => (
            <Card key={p.id} className="metallic-card border-0">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-sm font-semibold">{p.requesterCompanyName}</CardTitle>
                  {statusBadge(p.status)}
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <p>{t("policyType")}: {p.pricingPolicy?.policyType === "COMMISSION_PERCENTAGE" ? t("policyCommission", { rate: p.pricingPolicy.commissionRate }) : t("policyFixed", { amount: p.pricingPolicy?.fixedMarkup ?? 0 })}</p>
                <Button size="sm" className="metallic-header border-0" onClick={() => handleApprove(p.id)}>{t("approve")}</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="sent" className="space-y-3 mt-4">
          {sent.map((p) => (
            <Card key={p.id} className="metallic-card border-0">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-sm font-semibold">{p.recipientCompanyName}</CardTitle>
                  {statusBadge(p.status)}
                </div>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>{t("policyType")}: {p.pricingPolicy?.policyType === "COMMISSION_PERCENTAGE" ? t("policyCommission", { rate: p.pricingPolicy.commissionRate }) : t("policyFixed", { amount: p.pricingPolicy?.fixedMarkup ?? 0 })}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </ShellLayout>
  );
}

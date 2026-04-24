"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

interface Company {
  id: number;
  name: string;
}

interface PricingPolicy {
  id: number;
  policyType: string;
  commissionRate: number;
  fixedMarkup: number;
  currency: string;
}

interface Partnership {
  id: number;
  requesterCompanyId: number;
  requesterCompanyName: string;
  recipientCompanyId: number;
  recipientCompanyName: string;
  status: string;
  isBidirectional: boolean;
  pricingPolicy: PricingPolicy | null;
}

export default function PartnershipsPage() {
  const router = useRouter();
  const [active, setActive] = useState<Partnership[]>([]);
  const [pending, setPending] = useState<Partnership[]>([]);
  const [sent, setSent] = useState<Partnership[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [policyType, setPolicyType] = useState("COMMISSION_PERCENTAGE");
  const [commissionRate, setCommissionRate] = useState("");
  const [fixedMarkup, setFixedMarkup] = useState("");
  const [isBidirectional, setIsBidirectional] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    api.get("/partnerships/active").then((res) => setActive(res.data));
    api.get("/partnerships/pending").then((res) => setPending(res.data));
    api.get("/partnerships/sent").then((res) => setSent(res.data));
    api.get("/companies/available").then((res) => setCompanies(res.data));
  };

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const policy = {
      policyType,
      commissionRate: policyType === "COMMISSION_PERCENTAGE" ? parseFloat(commissionRate) : null,
      fixedMarkup: policyType === "FIXED_MARKUP" ? parseFloat(fixedMarkup) : null,
      currency: "TRY",
    };
    await api.post(`/partnerships/request?recipientCompanyId=${selectedCompany}&isBidirectional=${isBidirectional}`, policy);
    setOpen(false);
    setSelectedCompany("");
    setCommissionRate("");
    setFixedMarkup("");
    fetchData();
  };

  const handleApprove = async (id: number) => {
    await api.post(`/partnerships/${id}/approve`);
    fetchData();
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-green-600">Aktif</Badge>;
      case "PENDING": return <Badge variant="secondary">Beklemede</Badge>;
      case "REJECTED": return <Badge variant="destructive">Reddedildi</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Anlasma Yonetimi</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm underline text-primary">Dashboard</a>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-sm text-destructive underline">Cikis</button>
        </div>
      </header>
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Is Ortakliklari</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Yeni Anlasma Teklifi Gonder</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Yeni Anlasma Teklifi</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleRequest} className="space-y-4">
                <div className="space-y-2">
                  <Label>Firma Secin</Label>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Firma secin" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Fiyat Politikasi</Label>
                  <Select value={policyType} onValueChange={setPolicyType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COMMISSION_PERCENTAGE">Komisyon Yuzdesi (%)</SelectItem>
                      <SelectItem value="FIXED_MARKUP">Sabit Tutar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {policyType === "COMMISSION_PERCENTAGE" ? (
                  <div className="space-y-2">
                    <Label>Komisyon Orani (%)</Label>
                    <Input type="number" step="0.01" value={commissionRate} onChange={(e) => setCommissionRate(e.target.value)} required />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Sabit Tutar</Label>
                    <Input type="number" step="0.01" value={fixedMarkup} onChange={(e) => setFixedMarkup(e.target.value)} required />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="bidirectional" checked={isBidirectional} onChange={(e) => setIsBidirectional(e.target.checked)} />
                  <Label htmlFor="bidirectional" className="font-normal">Karsilikli anlasma</Label>
                </div>
                <DialogFooter>
                  <Button type="submit">Teklif Gonder</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Aktif ({active.length})</TabsTrigger>
            <TabsTrigger value="pending">Bekleyen Talepler ({pending.length})</TabsTrigger>
            <TabsTrigger value="sent">Gonderilen Teklifler ({sent.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            {active.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{p.requesterCompanyName} - {p.recipientCompanyName}</CardTitle>
                    {statusBadge(p.status)}
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>Politika: {p.pricingPolicy?.policyType === "COMMISSION_PERCENTAGE" ? `Komisyon %${p.pricingPolicy.commissionRate}` : `Sabit +${p.pricingPolicy?.fixedMarkup}`}</p>
                  <p>Karsilikli: {p.isBidirectional ? "Evet" : "Hayir"}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            {pending.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{p.requesterCompanyName}</CardTitle>
                    {statusBadge(p.status)}
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>Politika: {p.pricingPolicy?.policyType === "COMMISSION_PERCENTAGE" ? `Komisyon %${p.pricingPolicy.commissionRate}` : `Sabit +${p.pricingPolicy?.fixedMarkup}`}</p>
                  <Button size="sm" onClick={() => handleApprove(p.id)}>Onayla</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="sent" className="space-y-4">
            {sent.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{p.recipientCompanyName}</CardTitle>
                    {statusBadge(p.status)}
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                  <p>Politika: {p.pricingPolicy?.policyType === "COMMISSION_PERCENTAGE" ? `Komisyon %${p.pricingPolicy.commissionRate}` : `Sabit +${p.pricingPolicy?.fixedMarkup}`}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

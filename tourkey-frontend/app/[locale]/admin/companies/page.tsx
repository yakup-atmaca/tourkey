"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import api from "@/lib/api";
import ShellLayout from "@/components/ShellLayout";
import { PlusCircle } from "lucide-react";

interface Company { id: number; name: string; email: string; phone: string; subscriptionStatus: string; isActive: boolean; }

export default function AdminCompaniesPage() {
  const router = useRouter();
  const t = useTranslations("admin");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", taxOffice: "", taxNumber: "", subscriptionStatus: "ACTIVE" });

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (!roles.includes("SUPER_ADMIN")) { router.push("/dashboard"); return; }
    fetchCompanies();
  }, [router]);

  const fetchCompanies = () => { api.get("/companies").then((res) => setCompanies(res.data)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/companies", form);
    setOpen(false); setForm({ name: "", email: "", phone: "", address: "", taxOffice: "", taxNumber: "", subscriptionStatus: "ACTIVE" });
    fetchCompanies();
  };

  return (
    <ShellLayout title={t("adminCompaniesTitle")} subtitle={t("companiesTitle")}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="metallic-header border-0 shadow-lg hover:opacity-90 w-full sm:w-auto">
              <PlusCircle className="h-4 w-4 mr-2" />{t("addCompany")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>{t("newCompany")}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t("name")}</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
                <div className="space-y-2"><Label>{t("email")}</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t("phone")}</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t("taxOffice")}</Label><Input value={form.taxOffice} onChange={(e) => setForm({ ...form, taxOffice: e.target.value })} /></div>
                <div className="space-y-2"><Label>{t("taxNumber")}</Label><Input value={form.taxNumber} onChange={(e) => setForm({ ...form, taxNumber: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>{t("subscriptionStatus")}</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.subscriptionStatus} onChange={(e) => setForm({ ...form, subscriptionStatus: e.target.value })}>
                    <option value="ACTIVE">{t("statusActive")}</option>
                    <option value="TRIAL">{t("statusTrial")}</option>
                    <option value="SUSPENDED">{t("statusSuspended")}</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2"><Label>{t("address")}</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
              <DialogFooter><Button type="submit" className="metallic-header border-0">{t("save")}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <Card key={company.id} className="metallic-card border-0 hover:scale-[1.01] transition-transform">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">{company.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">{t("email")}</span><span>{company.email || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("phone")}</span><span>{company.phone || "-"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("subscriptionStatus")}</span><span className="font-medium">{company.subscriptionStatus}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("active")}</span><span className={company.isActive ? "text-emerald-500" : "text-destructive"}>{company.isActive ? t("statusActive") : t("statusSuspended")}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ShellLayout>
  );
}

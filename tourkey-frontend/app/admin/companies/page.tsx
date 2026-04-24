"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "@/lib/api";

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  subscriptionStatus: string;
  isActive: boolean;
}

export default function AdminCompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    taxOffice: "",
    taxNumber: "",
    subscriptionStatus: "ACTIVE",
  });

  useEffect(() => {
    const roles = JSON.parse(localStorage.getItem("roles") || "[]");
    if (!roles.includes("SUPER_ADMIN")) {
      router.push("/dashboard");
      return;
    }
    fetchCompanies();
  }, [router]);

  const fetchCompanies = () => {
    api.get("/companies").then((res) => setCompanies(res.data));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post("/companies", form);
    setOpen(false);
    setForm({ name: "", email: "", phone: "", address: "", taxOffice: "", taxNumber: "", subscriptionStatus: "ACTIVE" });
    fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin - Firma Yonetimi</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm underline text-primary">Dashboard</a>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-sm text-destructive underline">Cikis</button>
        </div>
      </header>
      <main className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Firmalar</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Yeni Firma Ekle</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Yeni Firma Ekle</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Firma Adi</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>E-posta</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vergi Dairesi</Label>
                    <Input value={form.taxOffice} onChange={(e) => setForm({ ...form, taxOffice: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vergi No</Label>
                    <Input value={form.taxNumber} onChange={(e) => setForm({ ...form, taxNumber: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Abonelik Durumu</Label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      value={form.subscriptionStatus}
                      onChange={(e) => setForm({ ...form, subscriptionStatus: e.target.value })}
                    >
                      <option value="ACTIVE">Aktif</option>
                      <option value="TRIAL">Deneme</option>
                      <option value="SUSPENDED">Durduruldu</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Adres</Label>
                  <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
                </div>
                <DialogFooter>
                  <Button type="submit">Kaydet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {companies.map((company) => (
            <Card key={company.id}>
              <CardHeader>
                <CardTitle>{company.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">E-posta:</span> {company.email || "-"}</p>
                <p><span className="text-muted-foreground">Telefon:</span> {company.phone || "-"}</p>
                <p><span className="text-muted-foreground">Durum:</span> {company.subscriptionStatus}</p>
                <p><span className="text-muted-foreground">Aktif:</span> {company.isActive ? "Evet" : "Hayir"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

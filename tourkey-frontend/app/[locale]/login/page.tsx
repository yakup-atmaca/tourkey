"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Lock, User } from "lucide-react";
import api from "@/lib/api";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const t = useTranslations("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { username, password });
      const data = res.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("companyId", String(data.companyId));
      localStorage.setItem("roles", JSON.stringify(data.roles));
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md metallic-card border-0">
        <CardHeader className="space-y-3 pb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl metallic-header flex items-center justify-center shadow-lg">
            <Globe className="h-7 w-7 text-white" />
          </div>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight">{t("title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">{t("username")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10 bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="admin"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">{t("password")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-secondary/50 border-0 focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••"
                />
              </div>
            </div>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>
            )}
            <Button type="submit" className="w-full metallic-header hover:opacity-90 transition-opacity font-semibold shadow-lg" disabled={loading}>
              {loading ? t("loading") : t("submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

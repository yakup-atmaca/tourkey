"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import "leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";
import ShellLayout from "@/components/ShellLayout";
import { Navigation } from "lucide-react";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface Tour {
  id: number;
  name: string;
  description: string;
  organizerCompanyName: string;
  basePrice: number;
  adultPrice: number | null;
  childPrice: number | null;
  babyPrice: number | null;
  guestPrice: number | null;
  currency: string;
  startLat: number | null;
  startLng: number | null;
  endLat: number | null;
  endLng: number | null;
  routeStops: any[];
  schedules: any[];
}

export default function MarketplacePage() {
  const router = useRouter();
  const t = useTranslations("marketplace");
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tours/marketplace")
      .then((res) => setTours(res.data))
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

  const mapTours = tours.filter((t) => t.startLat && t.startLng);

  return (
    <ShellLayout title={t("title")} subtitle={`${tours.length} ${t("availableTours")?.toLowerCase()}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border shadow-sm h-[400px] lg:h-[calc(100vh-220px)] min-h-[400px] relative bg-secondary/30">
          <MapContainer center={[36.8841, 30.7056]} zoom={7} className="h-full w-full z-0">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {mapTours.map((tour) => (
              <Marker key={tour.id} position={[tour.startLat!, tour.startLng!]} eventHandlers={{ click: () => setSelectedTour(tour) }}>
                <Popup>
                  <div className="space-y-2 min-w-[200px]">
                    <p className="font-semibold text-sm">{tour.name}</p>
                    <p className="text-xs text-muted-foreground">{tour.organizerCompanyName}</p>
                    <p className="text-sm font-bold text-primary">{tour.basePrice} {tour.currency}</p>
                    <Button size="sm" className="w-full metallic-header border-0" onClick={() => router.push(`/tickets/sell?tourId=${tour.id}`)}>{t("sellTicketNow")}</Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-220px)]">
          <div className="flex items-center gap-2 pb-2">
            <Navigation className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{t("availableTours")}</h2>
          </div>
          {tours.map((tour) => (
            <Card key={tour.id} className={`metallic-card border-0 cursor-pointer transition-all hover:scale-[1.01] ${selectedTour?.id === tour.id ? "ring-2 ring-primary" : ""}`} onClick={() => setSelectedTour(tour)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-sm font-semibold leading-tight">{tour.name}</CardTitle>
                  <Badge variant="outline" className="shrink-0 text-xs">{tour.currency}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{tour.organizerCompanyName}</p>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("basePrice")}</span>
                  <span className="font-semibold">{tour.basePrice} {tour.currency}</span>
                </div>
                {tour.adultPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t("adult")}</span>
                    <span>{tour.adultPrice}</span>
                  </div>
                )}
                {tour.startLat && tour.startLng && (
                  <p className="text-xs text-muted-foreground">{t("location")}: {tour.startLat.toFixed(4)}, {tour.startLng.toFixed(4)}</p>
                )}
                {tour.schedules.length > 0 && (
                  <p className="text-xs text-muted-foreground">{t("nextDate")}: {tour.schedules[0].scheduleDate}</p>
                )}
                <Button size="sm" className="w-full metallic-header border-0" onClick={(e) => { e.stopPropagation(); router.push(`/tickets/sell?tourId=${tour.id}`); }}>{t("sellTicketNow")}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ShellLayout>
  );
}

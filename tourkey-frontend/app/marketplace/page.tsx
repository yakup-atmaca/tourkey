"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

interface TourSchedule {
  id: number;
  scheduleDate: string;
  departureTime: string | null;
  status: string;
  capacity: number;
  soldSeats: number;
}

interface RouteStop {
  id: number;
  name: string;
  sequence: number;
  lat: number | null;
  lng: number | null;
  stopType: string;
}

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
  routeStops: RouteStop[];
  schedules: TourSchedule[];
}

export default function MarketplacePage() {
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center">
        <p>Yukleniyor...</p>
      </div>
    );
  }

  const mapTours = tours.filter(t => t.startLat && t.startLng);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">B2B Pazaryeri</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm underline text-primary">Dashboard</a>
          <a href="/tickets/sell" className="text-sm underline text-primary">Bilet Sat</a>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-sm text-destructive underline">Cikis</button>
        </div>
      </header>
      <main className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-80px)]">
        {/* Map */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border relative">
          <MapContainer center={[36.8841, 30.7056]} zoom={7} className="h-full w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {mapTours.map((tour) => (
              <Marker
                key={tour.id}
                position={[tour.startLat!, tour.startLng!]}
                eventHandlers={{
                  click: () => setSelectedTour(tour),
                }}
              >
                <Popup>
                  <div className="space-y-1 min-w-[200px]">
                    <p className="font-semibold">{tour.name}</p>
                    <p className="text-xs text-muted-foreground">{tour.organizerCompanyName}</p>
                    <p className="text-sm font-medium">{tour.basePrice} {tour.currency}</p>
                    <Button size="sm" className="w-full mt-2" onClick={() => router.push(`/tickets/sell?tourId=${tour.id}`)}>
                      Bilet Sat
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Tour List */}
        <div className="space-y-4 overflow-y-auto">
          <h2 className="font-semibold text-lg">Mevcut Turlar</h2>
          {tours.map((tour) => (
            <Card key={tour.id} className={`cursor-pointer transition-all ${selectedTour?.id === tour.id ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedTour(tour)}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{tour.name}</CardTitle>
                  <Badge variant="outline">{tour.currency}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{tour.organizerCompanyName}</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taban Fiyat</span>
                  <span className="font-medium">{tour.basePrice} {tour.currency}</span>
                </div>
                {tour.adultPrice && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Yetişkin</span>
                    <span>{tour.adultPrice}</span>
                  </div>
                )}
                {tour.startLat && tour.startLng && (
                  <p className="text-xs text-muted-foreground">
                    Konum: {tour.startLat.toFixed(4)}, {tour.startLng.toFixed(4)}
                  </p>
                )}
                {tour.schedules.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Sonraki tarih: {tour.schedules[0].scheduleDate}
                  </p>
                )}
                <Button size="sm" className="w-full" onClick={(e) => { e.stopPropagation(); router.push(`/tickets/sell?tourId=${tour.id}`); }}>
                  Hemen Bilet Sat
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

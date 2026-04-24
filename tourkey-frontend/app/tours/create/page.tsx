"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";

interface RouteStopForm {
  name: string;
  sequence: number;
  lat: string;
  lng: string;
  arrivalTime: string;
  departureTime: string;
  stopType: string;
}

interface ScheduleForm {
  scheduleDate: string;
  departureTime: string;
  capacity: number;
}

export default function CreateTourPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [adultPrice, setAdultPrice] = useState("");
  const [childPrice, setChildPrice] = useState("");
  const [babyPrice, setBabyPrice] = useState("");
  const [guestPrice, setGuestPrice] = useState("");
  const [currency, setCurrency] = useState("TRY");
  const [startLat, setStartLat] = useState("");
  const [startLng, setStartLng] = useState("");
  const [endLat, setEndLat] = useState("");
  const [endLng, setEndLng] = useState("");
  const [routeStops, setRouteStops] = useState<RouteStopForm[]>([]);
  const [schedules, setSchedules] = useState<ScheduleForm[]>([]);
  const [loading, setLoading] = useState(false);

  const addRouteStop = () => {
    setRouteStops([...routeStops, { name: "", sequence: routeStops.length + 1, lat: "", lng: "", arrivalTime: "", departureTime: "", stopType: "PICKUP" }]);
  };

  const updateRouteStop = (index: number, field: keyof RouteStopForm, value: string | number) => {
    const updated = [...routeStops];
    updated[index] = { ...updated[index], [field]: value };
    setRouteStops(updated);
  };

  const removeRouteStop = (index: number) => {
    setRouteStops(routeStops.filter((_, i) => i !== index));
  };

  const addSchedule = () => {
    setSchedules([...schedules, { scheduleDate: "", departureTime: "", capacity: 0 }]);
  };

  const updateSchedule = (index: number, field: keyof ScheduleForm, value: string | number) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const removeSchedule = (index: number) => {
    setSchedules(schedules.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/tours", {
        name,
        description,
        basePrice: parseFloat(basePrice) || 0,
        adultPrice: adultPrice ? parseFloat(adultPrice) : null,
        childPrice: childPrice ? parseFloat(childPrice) : null,
        babyPrice: babyPrice ? parseFloat(babyPrice) : null,
        guestPrice: guestPrice ? parseFloat(guestPrice) : null,
        currency,
        startLat: startLat ? parseFloat(startLat) : null,
        startLng: startLng ? parseFloat(startLng) : null,
        endLat: endLat ? parseFloat(endLat) : null,
        endLng: endLng ? parseFloat(endLng) : null,
        routeStops: routeStops.map(rs => ({
          name: rs.name,
          sequence: rs.sequence,
          lat: rs.lat ? parseFloat(rs.lat) : null,
          lng: rs.lng ? parseFloat(rs.lng) : null,
          arrivalTime: rs.arrivalTime || null,
          departureTime: rs.departureTime || null,
          stopType: rs.stopType
        })),
        schedules: schedules.map(s => ({
          scheduleDate: s.scheduleDate,
          departureTime: s.departureTime || null,
          capacity: s.capacity
        }))
      });
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Tur olusturulurken hata olustu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Yeni Tur Olustur</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm underline text-primary">Dashboard</a>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-sm text-destructive underline">Cikis</button>
        </div>
      </header>
      <main className="p-6 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Tur Adi</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Aciklama</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Taban Fiyat</Label>
                <Input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Para Birimi</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Yetişkin Fiyati</Label>
                <Input type="number" step="0.01" value={adultPrice} onChange={(e) => setAdultPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Çocuk Fiyati</Label>
                <Input type="number" step="0.01" value={childPrice} onChange={(e) => setChildPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Bebek Fiyati</Label>
                <Input type="number" step="0.01" value={babyPrice} onChange={(e) => setBabyPrice(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Misafir Fiyati</Label>
                <Input type="number" step="0.01" value={guestPrice} onChange={(e) => setGuestPrice(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Konumlar (PostGIS)</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kalkis Enlem</Label>
                <Input type="number" step="any" value={startLat} onChange={(e) => setStartLat(e.target.value)} placeholder="36.8841" />
              </div>
              <div className="space-y-2">
                <Label>Kalkis Boylam</Label>
                <Input type="number" step="any" value={startLng} onChange={(e) => setStartLng(e.target.value)} placeholder="30.7056" />
              </div>
              <div className="space-y-2">
                <Label>Varis Enlem</Label>
                <Input type="number" step="any" value={endLat} onChange={(e) => setEndLat(e.target.value)} placeholder="38.6431" />
              </div>
              <div className="space-y-2">
                <Label>Varis Boylam</Label>
                <Input type="number" step="any" value={endLng} onChange={(e) => setEndLng(e.target.value)} placeholder="34.8303" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Rota Duraklari</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addRouteStop}>Durak Ekle</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {routeStops.map((rs, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-7 gap-2 items-end border p-3 rounded-md">
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs">Durak Adi</Label>
                    <Input value={rs.name} onChange={(e) => updateRouteStop(index, "name", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Sira</Label>
                    <Input type="number" value={rs.sequence} onChange={(e) => updateRouteStop(index, "sequence", parseInt(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Enlem</Label>
                    <Input type="number" step="any" value={rs.lat} onChange={(e) => updateRouteStop(index, "lat", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Boylam</Label>
                    <Input type="number" step="any" value={rs.lng} onChange={(e) => updateRouteStop(index, "lng", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tip</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm" value={rs.stopType} onChange={(e) => updateRouteStop(index, "stopType", e.target.value)}>
                      <option value="PICKUP">Alis</option>
                      <option value="DROPOFF">Birakma</option>
                      <option value="VISIT">Ziyaret</option>
                    </select>
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeRouteStop(index)}>Sil</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tur Tarihleri</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addSchedule}>Tarih Ekle</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {schedules.map((s, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end border p-3 rounded-md">
                  <div className="space-y-1">
                    <Label className="text-xs">Tarih</Label>
                    <Input type="date" value={s.scheduleDate} onChange={(e) => updateSchedule(index, "scheduleDate", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kalkis Saati</Label>
                    <Input type="time" value={s.departureTime} onChange={(e) => updateSchedule(index, "departureTime", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Kontenjan</Label>
                    <Input type="number" value={s.capacity} onChange={(e) => updateSchedule(index, "capacity", parseInt(e.target.value))} />
                  </div>
                  <Button type="button" variant="destructive" size="sm" onClick={() => removeSchedule(index)}>Sil</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>Iptal</Button>
            <Button type="submit" disabled={loading}>{loading ? "Kaydediliyor..." : "Tur Olustur"}</Button>
          </div>
        </form>
      </main>
    </div>
  );
}

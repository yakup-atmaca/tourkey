"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import ShellLayout from "@/components/ShellLayout";

interface RouteStopForm { name: string; sequence: number; lat: string; lng: string; arrivalTime: string; departureTime: string; stopType: string; }
interface ScheduleForm { scheduleDate: string; departureTime: string; capacity: number; }

export default function CreateTourPage() {
  const router = useRouter();
  const t = useTranslations("tours");
  const tc = useTranslations("common");
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

  const addRouteStop = () => { setRouteStops([...routeStops, { name: "", sequence: routeStops.length + 1, lat: "", lng: "", arrivalTime: "", departureTime: "", stopType: "PICKUP" }]); };
  const updateRouteStop = (index: number, field: keyof RouteStopForm, value: string | number) => { const u = [...routeStops]; u[index] = { ...u[index], [field]: value }; setRouteStops(u); };
  const removeRouteStop = (index: number) => { setRouteStops(routeStops.filter((_, i) => i !== index)); };

  const addSchedule = () => { setSchedules([...schedules, { scheduleDate: "", departureTime: "", capacity: 0 }]); };
  const updateSchedule = (index: number, field: keyof ScheduleForm, value: string | number) => { const u = [...schedules]; u[index] = { ...u[index], [field]: value }; setSchedules(u); };
  const removeSchedule = (index: number) => { setSchedules(schedules.filter((_, i) => i !== index)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      await api.post("/tours", {
        name, description,
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
        routeStops: routeStops.map(rs => ({ name: rs.name, sequence: rs.sequence, lat: rs.lat ? parseFloat(rs.lat) : null, lng: rs.lng ? parseFloat(rs.lng) : null, arrivalTime: rs.arrivalTime || null, departureTime: rs.departureTime || null, stopType: rs.stopType })),
        schedules: schedules.map(s => ({ scheduleDate: s.scheduleDate, departureTime: s.departureTime || null, capacity: s.capacity }))
      });
      router.push("/dashboard");
    } catch (err: any) { alert(err.response?.data?.message || t("errorCreate")); } finally { setLoading(false); }
  };

  return (
    <ShellLayout title={t("createTitle")}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
        <Card className="metallic-card border-0">
          <CardHeader><CardTitle className="text-base font-semibold">{t("basicInfo")}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2"><Label>{t("tourName")}</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
            <div className="space-y-2 sm:col-span-2"><Label>{t("description")}</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t("basePrice")}</Label><Input type="number" step="0.01" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required /></div>
            <div className="space-y-2">
              <Label>{t("currency")}</Label>
              <select className="flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="TRY">TRY</option><option value="USD">USD</option><option value="EUR">EUR</option>
              </select>
            </div>
            <div className="space-y-2"><Label>{t("adultPrice")}</Label><Input type="number" step="0.01" value={adultPrice} onChange={(e) => setAdultPrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t("childPrice")}</Label><Input type="number" step="0.01" value={childPrice} onChange={(e) => setChildPrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t("babyPrice")}</Label><Input type="number" step="0.01" value={babyPrice} onChange={(e) => setBabyPrice(e.target.value)} /></div>
            <div className="space-y-2"><Label>{t("guestPrice")}</Label><Input type="number" step="0.01" value={guestPrice} onChange={(e) => setGuestPrice(e.target.value)} /></div>
          </CardContent>
        </Card>

        <Card className="metallic-card border-0">
          <CardHeader><CardTitle className="text-base font-semibold">{t("locations")}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>{t("startLat")}</Label><Input type="number" step="any" value={startLat} onChange={(e) => setStartLat(e.target.value)} placeholder="36.8841" /></div>
            <div className="space-y-2"><Label>{t("startLng")}</Label><Input type="number" step="any" value={startLng} onChange={(e) => setStartLng(e.target.value)} placeholder="30.7056" /></div>
            <div className="space-y-2"><Label>{t("endLat")}</Label><Input type="number" step="any" value={endLat} onChange={(e) => setEndLat(e.target.value)} placeholder="38.6431" /></div>
            <div className="space-y-2"><Label>{t("endLng")}</Label><Input type="number" step="any" value={endLng} onChange={(e) => setEndLng(e.target.value)} placeholder="34.8303" /></div>
          </CardContent>
        </Card>

        <Card className="metallic-card border-0">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base font-semibold">{t("routeStops")}</CardTitle><Button type="button" variant="outline" size="sm" onClick={addRouteStop}>{t("addStop")}</Button></CardHeader>
          <CardContent className="space-y-4">
            {routeStops.map((rs, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2 items-end border p-3 rounded-xl bg-secondary/30">
                <div className="space-y-1 md:col-span-2"><Label className="text-xs">{t("stopName")}</Label><Input value={rs.name} onChange={(e) => updateRouteStop(index, "name", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("sequence")}</Label><Input type="number" value={rs.sequence} onChange={(e) => updateRouteStop(index, "sequence", parseInt(e.target.value))} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("lat")}</Label><Input type="number" step="any" value={rs.lat} onChange={(e) => updateRouteStop(index, "lat", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("lng")}</Label><Input type="number" step="any" value={rs.lng} onChange={(e) => updateRouteStop(index, "lng", e.target.value)} /></div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("type")}</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-transparent px-2 py-2 text-sm" value={rs.stopType} onChange={(e) => updateRouteStop(index, "stopType", e.target.value)}>
                    <option value="PICKUP">{t("pickup")}</option><option value="DROPOFF">{t("dropoff")}</option><option value="VISIT">{t("visit")}</option>
                  </select>
                </div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeRouteStop(index)}>{tc("delete")}</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="metallic-card border-0">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base font-semibold">{t("tourDates")}</CardTitle><Button type="button" variant="outline" size="sm" onClick={addSchedule}>{t("addDate")}</Button></CardHeader>
          <CardContent className="space-y-4">
            {schedules.map((s, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 items-end border p-3 rounded-xl bg-secondary/30">
                <div className="space-y-1"><Label className="text-xs">{t("date")}</Label><Input type="date" value={s.scheduleDate} onChange={(e) => updateSchedule(index, "scheduleDate", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("departureTime")}</Label><Input type="time" value={s.departureTime} onChange={(e) => updateSchedule(index, "departureTime", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("capacity")}</Label><Input type="number" value={s.capacity} onChange={(e) => updateSchedule(index, "capacity", parseInt(e.target.value))} /></div>
                <Button type="button" variant="destructive" size="sm" onClick={() => removeSchedule(index)}>{tc("delete")}</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>{tc("cancel")}</Button>
          <Button type="submit" disabled={loading} className="metallic-header border-0">{loading ? t("creating") : t("create")}</Button>
        </div>
      </form>
    </ShellLayout>
  );
}

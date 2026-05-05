"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from "@/lib/api";
import ShellLayout from "@/components/ShellLayout";

interface Tour {
  id: number; name: string; organizerCompanyName: string; basePrice: number;
  adultPrice: number | null; childPrice: number | null; babyPrice: number | null;
  guestPrice: number | null; currency: string; schedules: any[];
}

interface PassengerForm {
  fullName: string; passportNo: string; phone: string;
  passengerType: string; gender: string; countryCode: string; seatNumber: string;
}

export default function SellTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTourId = searchParams.get("tourId");
  const t = useTranslations("tickets");
  const tc = useTranslations("common");

  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<string>(initialTourId || "");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [passengers, setPassengers] = useState<PassengerForm[]>([{ fullName: "", passportNo: "", phone: "", passengerType: "ADULT", gender: "MALE", countryCode: "TR", seatNumber: "" }]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/tours/marketplace").then((res) => {
      setTours(res.data);
      if (initialTourId) {
        const tour = res.data.find((t: Tour) => t.id === parseInt(initialTourId));
        if (tour) setSelectedTour(tour);
      }
    });
  }, [initialTourId]);

  const handleTourChange = (tourId: string) => {
    setSelectedTourId(tourId);
    const tour = tours.find(t => t.id === parseInt(tourId));
    setSelectedTour(tour || null); setSelectedScheduleId("");
  };

  const addPassenger = () => { setPassengers([...passengers, { fullName: "", passportNo: "", phone: "", passengerType: "ADULT", gender: "MALE", countryCode: "TR", seatNumber: "" }]); };
  const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => { const u = [...passengers]; u[index] = { ...u[index], [field]: value }; setPassengers(u); };
  const removePassenger = (index: number) => { if (passengers.length > 1) setPassengers(passengers.filter((_, i) => i !== index)); };

  const calculateTotal = () => {
    if (!selectedTour) return 0;
    return passengers.reduce((total, p) => {
      let price = selectedTour.basePrice;
      switch (p.passengerType) {
        case "ADULT": price = selectedTour.adultPrice ?? selectedTour.basePrice; break;
        case "CHILD": price = selectedTour.childPrice ?? selectedTour.basePrice; break;
        case "BABY": price = selectedTour.babyPrice ?? 0; break;
        case "GUEST": price = selectedTour.guestPrice ?? selectedTour.basePrice; break;
      }
      return total + price;
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleId) { alert(t("selectDateAlert")); return; }
    setLoading(true);
    try {
      const res = await api.post("/tickets", {
        tourScheduleId: parseInt(selectedScheduleId), pickupLocation, notes,
        passengers: passengers.map(p => ({ fullName: p.fullName, passportNo: p.passportNo, phone: p.phone, passengerType: p.passengerType, gender: p.gender, countryCode: p.countryCode, seatNumber: p.seatNumber }))
      });
      alert(t("successMessage", { number: res.data.ticketNumber }));
      router.push("/dashboard");
    } catch (err: any) { alert(err.response?.data?.message || t("errorCreate")); } finally { setLoading(false); }
  };

  return (
    <ShellLayout title={t("sellTitle")}>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl mx-auto">
        <Card className="metallic-card border-0">
          <CardHeader><CardTitle className="text-base font-semibold">{t("selectTourAndDate")}</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("tour")}</Label>
              <Select value={selectedTourId} onValueChange={handleTourChange}>
                <SelectTrigger><SelectValue placeholder={t("selectTour")} /></SelectTrigger>
                <SelectContent>{tours.map(t => (<SelectItem key={t.id} value={String(t.id)}>{t.name} ({t.organizerCompanyName})</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("date")}</Label>
              <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId} disabled={!selectedTour}>
                <SelectTrigger><SelectValue placeholder={t("selectDate")} /></SelectTrigger>
                <SelectContent>
                  {selectedTour?.schedules.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.scheduleDate} {s.departureTime ? `- ${s.departureTime}` : ""} ({t("remaining")}: {s.capacity - s.soldSeats})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedTour && (
              <div className="sm:col-span-2 text-sm text-muted-foreground p-3 rounded-xl bg-secondary/50">
                {t("prices")}: {t("adult")} {selectedTour.adultPrice ?? selectedTour.basePrice} {selectedTour.currency} | {t("child")} {selectedTour.childPrice ?? selectedTour.basePrice} {selectedTour.currency} | {t("baby")} {selectedTour.babyPrice ?? 0} {selectedTour.currency} | {t("guest")} {selectedTour.guestPrice ?? selectedTour.basePrice} {selectedTour.currency}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="metallic-card border-0">
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base font-semibold">{t("passengerInfo")}</CardTitle><Button type="button" variant="outline" size="sm" onClick={addPassenger}>{t("addPassenger")}</Button></CardHeader>
          <CardContent className="space-y-4">
            {passengers.map((p, index) => (
              <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 border p-3 rounded-xl bg-secondary/30">
                <div className="space-y-1 md:col-span-2"><Label className="text-xs">{t("fullName")}</Label><Input value={p.fullName} onChange={(e) => updatePassenger(index, "fullName", e.target.value)} required /></div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("type")}</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-transparent px-2 py-2 text-sm" value={p.passengerType} onChange={(e) => updatePassenger(index, "passengerType", e.target.value)}>
                    <option value="ADULT">{t("adult")}</option><option value="CHILD">{t("child")}</option><option value="BABY">{t("baby")}</option><option value="GUEST">{t("guest")}</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">{t("gender")}</Label>
                  <select className="flex h-10 w-full rounded-lg border border-input bg-transparent px-2 py-2 text-sm" value={p.gender} onChange={(e) => updatePassenger(index, "gender", e.target.value)}>
                    <option value="MALE">{t("male")}</option><option value="FEMALE">{t("female")}</option><option value="OTHER">{t("other")}</option>
                  </select>
                </div>
                <div className="space-y-1"><Label className="text-xs">{t("passportNo")}</Label><Input value={p.passportNo} onChange={(e) => updatePassenger(index, "passportNo", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("phone")}</Label><Input value={p.phone} onChange={(e) => updatePassenger(index, "phone", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("country")}</Label><Input value={p.countryCode} onChange={(e) => updatePassenger(index, "countryCode", e.target.value)} /></div>
                <div className="space-y-1"><Label className="text-xs">{t("seat")}</Label><Input value={p.seatNumber} onChange={(e) => updatePassenger(index, "seatNumber", e.target.value)} /></div>
                <div className="flex items-end">
                  <Button type="button" variant="destructive" size="sm" onClick={() => removePassenger(index)} disabled={passengers.length <= 1}>{tc("delete")}</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="metallic-card border-0">
          <CardHeader><CardTitle className="text-base font-semibold">{t("saleDetails")}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>{t("pickupLocation")}</Label><Input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder={t("pickupPlaceholder")} /></div>
            <div className="space-y-2"><Label>{t("notes")}</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-4">
              <div>
                <p className="text-sm text-muted-foreground">{t("totalPassengers")}: {passengers.length}</p>
                <p className="text-lg font-bold">{t("totalAmount")}: {calculateTotal().toFixed(2)} {selectedTour?.currency || "TRY"}</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button type="button" variant="outline" className="flex-1 sm:flex-none" onClick={() => router.push("/dashboard")}>{tc("cancel")}</Button>
                <Button type="submit" disabled={loading || !selectedTourId || !selectedScheduleId} className="metallic-header border-0 flex-1 sm:flex-none">
                  {loading ? t("processing") : t("sell")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </ShellLayout>
  );
}

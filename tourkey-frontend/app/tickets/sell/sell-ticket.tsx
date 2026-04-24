"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";

interface TourSchedule {
  id: number;
  scheduleDate: string;
  departureTime: string | null;
  capacity: number;
  soldSeats: number;
}

interface Tour {
  id: number;
  name: string;
  organizerCompanyName: string;
  basePrice: number;
  adultPrice: number | null;
  childPrice: number | null;
  babyPrice: number | null;
  guestPrice: number | null;
  currency: string;
  schedules: TourSchedule[];
}

interface PassengerForm {
  fullName: string;
  passportNo: string;
  phone: string;
  passengerType: string;
  gender: string;
  countryCode: string;
  seatNumber: string;
}

export default function SellTicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTourId = searchParams.get("tourId");

  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<string>(initialTourId || "");
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("");
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [passengers, setPassengers] = useState<PassengerForm[]>([
    { fullName: "", passportNo: "", phone: "", passengerType: "ADULT", gender: "MALE", countryCode: "TR", seatNumber: "" }
  ]);
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
    setSelectedTour(tour || null);
    setSelectedScheduleId("");
  };

  const addPassenger = () => {
    setPassengers([...passengers, { fullName: "", passportNo: "", phone: "", passengerType: "ADULT", gender: "MALE", countryCode: "TR", seatNumber: "" }]);
  };

  const updatePassenger = (index: number, field: keyof PassengerForm, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

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
    if (!selectedScheduleId) {
      alert("Lutfen bir tarih secin");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/tickets", {
        tourScheduleId: parseInt(selectedScheduleId),
        pickupLocation,
        notes,
        passengers: passengers.map(p => ({
          fullName: p.fullName,
          passportNo: p.passportNo,
          phone: p.phone,
          passengerType: p.passengerType,
          gender: p.gender,
          countryCode: p.countryCode,
          seatNumber: p.seatNumber
        }))
      });
      alert(`Bilet basariyla olusturuldu! Bilet No: ${res.data.ticketNumber}`);
      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Bilet olusturulurken hata olustu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Bilet Satis</h1>
        <div className="flex gap-4">
          <a href="/dashboard" className="text-sm underline text-primary">Dashboard</a>
          <a href="/marketplace" className="text-sm underline text-primary">Pazaryeri</a>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-sm text-destructive underline">Cikis</button>
        </div>
      </header>
      <main className="p-6 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tur ve Tarih Secimi</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tur</Label>
                <Select value={selectedTourId} onValueChange={handleTourChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tur secin" />
                  </SelectTrigger>
                  <SelectContent>
                    {tours.map(t => (
                      <SelectItem key={t.id} value={String(t.id)}>{t.name} ({t.organizerCompanyName})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tarih</Label>
                <Select value={selectedScheduleId} onValueChange={setSelectedScheduleId} disabled={!selectedTour}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tarih secin" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedTour?.schedules.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.scheduleDate} {s.departureTime ? `- ${s.departureTime}` : ""} (Kalan: {s.capacity - s.soldSeats})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {selectedTour && (
                <div className="md:col-span-2 text-sm text-muted-foreground">
                  <p>Fiyatlar: Yetiskin {selectedTour.adultPrice ?? selectedTour.basePrice} {selectedTour.currency} | 
                  Cocuk {selectedTour.childPrice ?? selectedTour.basePrice} {selectedTour.currency} | 
                  Bebek {selectedTour.babyPrice ?? 0} {selectedTour.currency} | 
                  Misafir {selectedTour.guestPrice ?? selectedTour.basePrice} {selectedTour.currency}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Yolcu Bilgileri</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addPassenger}>Yolcu Ekle</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {passengers.map((p, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 border p-3 rounded-md">
                  <div className="space-y-1 md:col-span-2">
                    <Label className="text-xs">Ad Soyad</Label>
                    <Input value={p.fullName} onChange={(e) => updatePassenger(index, "fullName", e.target.value)} required />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Tip</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm" value={p.passengerType} onChange={(e) => updatePassenger(index, "passengerType", e.target.value)}>
                      <option value="ADULT">Yetiskin</option>
                      <option value="CHILD">Cocuk</option>
                      <option value="BABY">Bebek</option>
                      <option value="GUEST">Misafir</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Cinsiyet</Label>
                    <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-sm" value={p.gender} onChange={(e) => updatePassenger(index, "gender", e.target.value)}>
                      <option value="MALE">Erkek</option>
                      <option value="FEMALE">Kadin</option>
                      <option value="OTHER">Diger</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Pasaport No</Label>
                    <Input value={p.passportNo} onChange={(e) => updatePassenger(index, "passportNo", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Telefon</Label>
                    <Input value={p.phone} onChange={(e) => updatePassenger(index, "phone", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ulke</Label>
                    <Input value={p.countryCode} onChange={(e) => updatePassenger(index, "countryCode", e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Koltuk</Label>
                    <Input value={p.seatNumber} onChange={(e) => updatePassenger(index, "seatNumber", e.target.value)} />
                  </div>
                  <div className="flex items-end">
                    <Button type="button" variant="destructive" size="sm" onClick={() => removePassenger(index)} disabled={passengers.length <= 1}>Sil</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Satis Detaylari</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Alis Yeri</Label>
                <Input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Otel adi veya adres" />
              </div>
              <div className="space-y-2">
                <Label>Notlar</Label>
                <Input value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="flex justify-between items-center border-t pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Toplam Yolcu: {passengers.length}</p>
                  <p className="text-lg font-bold">Toplam: {calculateTotal().toFixed(2)} {selectedTour?.currency || "TRY"}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>Iptal</Button>
                  <Button type="submit" disabled={loading || !selectedTourId || !selectedScheduleId}>
                    {loading ? "Isleniyor..." : "Bilet Kes"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}

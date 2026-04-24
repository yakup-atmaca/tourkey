import { Suspense } from "react";
import SellTicketPage from "./sell-ticket";

export default function SellTicketWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>Yukleniyor...</p></div>}>
      <SellTicketPage />
    </Suspense>
  );
}

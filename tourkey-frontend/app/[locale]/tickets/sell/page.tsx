import { Suspense } from "react";
import { useTranslations } from "next-intl";
import SellTicketPage from "./sell-ticket";

export default function SellTicketWrapper() {
  const t = useTranslations("tickets");
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p>{t("loading")}</p></div>}>
      <SellTicketPage />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Radio } from "lucide-react";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { formatDateTime } from "@/lib/format";

export function RealtimeRefresh({ lastUpdate }: { lastUpdate: string | null }) {
  const router = useRouter();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const client = createPublicSupabaseClient();
    const refresh = () => router.refresh();
    const interval = window.setInterval(refresh, 45_000);
    window.addEventListener("focus", refresh);
    window.addEventListener("online", refresh);
    if (!client) {
      return () => {
        window.clearInterval(interval);
        window.removeEventListener("focus", refresh);
        window.removeEventListener("online", refresh);
      };
    }
    const channel = client.channel("torneo-pubblico");
    for (const table of ["teams", "matches", "tournament_settings", "historical_ranking"]) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, refresh);
    }
    channel.subscribe((status) => setLive(status === "SUBSCRIBED"));
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("online", refresh);
      void client.removeChannel(channel);
    };
  }, [router]);

  return (
    <div className={`live-indicator ${live ? "is-live" : ""}`} aria-live="polite">
      <Radio size={16} aria-hidden="true" />
      {live ? "Aggiornamento live" : `Ultimo aggiornamento: ${formatDateTime(lastUpdate)}`}
    </div>
  );
}

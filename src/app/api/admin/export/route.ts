import { NextRequest, NextResponse } from "next/server";
import { requireAdminRequest } from "@/lib/admin";
import { getActiveTournament } from "@/lib/active-tournament";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { determineFinalRanking } from "@/lib/tournament/bracket";
import { calculateAllStandings } from "@/lib/tournament/groups";
import type { HistoricalRanking, Match, RankingOverride, Team } from "@/types/tournament";

function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  const client = createServerSupabaseClient();
  const tournament = await getActiveTournament(client);
  const [teamsResult, matchesResult, rankingResult, overridesResult, settingsResult] = await Promise.all([
    client.from("teams").select("*").eq("tournament_id", tournament.id).order("display_order"),
    client.from("matches").select("*").eq("tournament_id", tournament.id).order("scheduled_at", { ascending: true, nullsFirst: false }),
    client.from("historical_ranking").select("*").order("display_order"),
    client.from("ranking_overrides").select("*").eq("tournament_id", tournament.id),
    client.from("tournament_settings").select("*").eq("tournament_id", tournament.id).single(),
  ]);
  if (teamsResult.error || matchesResult.error || rankingResult.error || overridesResult.error || settingsResult.error) {
    return NextResponse.json({ error: "Esportazione non disponibile." }, { status: 500 });
  }
  const teams = (teamsResult.data ?? []) as Team[];
  const matches = (matchesResult.data ?? []) as Match[];
  const ranking = (rankingResult.data ?? []) as HistoricalRanking[];
  const overrides = (overridesResult.data ?? []) as RankingOverride[];
  const payload = {
    esportato_il: new Date().toISOString(),
    torneo: tournament,
    impostazioni: settingsResult.data,
    partecipanti: teams,
    partite: matches,
    classifiche: calculateAllStandings(teams, matches, overrides),
    classifica_finale: determineFinalRanking(matches, teams),
    ranking_storico: ranking.map((entry) => ({
      periodo: entry.ranking_period,
      posizione_ufficiale: entry.rank_position,
      partecipante: entry.participant_name,
      punti: entry.points,
      ordine_visualizzazione: entry.display_order,
    })),
  };
  const format = new URL(request.url).searchParams.get("format");
  if (format === "csv") {
    const rows = [
      ["sezione", "periodo/fase", "posizione/girone", "partecipante1", "punti/punteggio1", "partecipante2", "punteggio2", "stato", "ordine"],
      ...ranking.map((entry) => [
        "ranking_storico",
        entry.ranking_period,
        entry.rank_position,
        entry.participant_name,
        entry.points,
        "",
        "",
        "",
        entry.display_order,
      ]),
      ...teams.map((team) => ["partecipante", "girone", team.group_code, team.name, "", "", "", "", team.display_order]),
      ...matches.map((match) => [
        "partita",
        match.stage,
        match.group_code ?? match.bracket_slot,
        match.team_one_id,
        match.score_one,
        match.team_two_id,
        match.score_two,
        match.status,
        match.match_day ?? "",
      ]),
    ];
    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="torneo-bocce-singolo-cogoleto-2k26.csv"',
      },
    });
  }
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="torneo-bocce-singolo-cogoleto-2k26.json"',
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { apiError, auditAndTouch, requireAdminRequest } from "@/lib/admin";
import { getActiveTournament } from "@/lib/active-tournament";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { propagateBracketResults } from "@/lib/tournament/bracket";
import { validateMatchScore } from "@/lib/tournament/score";
import { matchUpdateSchema } from "@/lib/validation";
import type { Match } from "@/types/tournament";

export async function PUT(request: NextRequest) {
  const unauthorized = await requireAdminRequest(request);
  if (unauthorized) return unauthorized;
  try {
    const input = matchUpdateSchema.parse(await request.json());
    const client = createServerSupabaseClient();
    const tournament = await getActiveTournament(client);
    const { data: existing, error: existingError } = await client
      .from("matches")
      .select("*")
      .eq("id", input.id)
      .eq("tournament_id", tournament.id)
      .single();
    if (existingError || !existing) throw new Error("Partita non trovata.");
    const current = existing as Match;
    if ((input.status === "live" || input.status === "completed") && (!current.team_one_id || !current.team_two_id)) {
      throw new Error("La partita non può iniziare finché entrambi i partecipanti non sono definiti.");
    }
    const scoreValidation = validateMatchScore(
      current.stage,
      input.status,
      input.score_one,
      input.score_two,
    );
    if (!scoreValidation.valid) throw new Error(scoreValidation.message);

    const update = {
      score_one: input.score_one,
      score_two: input.score_two,
      status: input.status,
      scheduled_at: input.scheduled_at === undefined ? current.scheduled_at : input.scheduled_at,
      court: input.court === undefined ? current.court : input.court,
      note: input.note === undefined ? current.note : input.note,
    };

    let downstream: Match[] = [];
    if (current.stage !== "group") {
      const { data: bracketRows, error: bracketError } = await client
        .from("matches")
        .select("*")
        .eq("tournament_id", tournament.id)
        .neq("stage", "group");
      if (bracketError) throw new Error("Impossibile verificare il tabellone.");
      const bracket = (bracketRows ?? []) as Match[];
      const proposed = bracket.map((match) =>
        match.id === current.id ? ({ ...match, ...update } as Match) : match,
      );
      downstream = propagateBracketResults(proposed).filter(
        (match) => match.id !== current.id && match.participantChanged,
      );
      const protectedMatches = downstream.filter((match) => {
        const old = bracket.find((entry) => entry.id === match.id);
        return old?.status === "live" || old?.status === "completed";
      });
      if (protectedMatches.length > 0 && !input.confirmCascade) {
        return NextResponse.json(
          {
            confirmationRequired: true,
            affected: protectedMatches.map((match) => match.bracket_slot),
            error: `La correzione rende incoerenti: ${protectedMatches.map((match) => match.bracket_slot).join(", ")}. Conferma per azzerarle.`,
          },
          { status: 409 },
        );
      }
    }

    const { data, error } = await client
      .from("matches")
      .update(update)
      .eq("id", current.id)
      .eq("tournament_id", tournament.id)
      .select()
      .single();
    if (error) throw new Error("Non è stato possibile salvare il risultato.");

    for (const match of downstream) {
      const { error: cascadeError } = await client
        .from("matches")
        .update({
          team_one_id: match.team_one_id,
          team_two_id: match.team_two_id,
          score_one: null,
          score_two: null,
          status: "scheduled",
        })
        .eq("id", match.id)
        .eq("tournament_id", tournament.id);
      if (cascadeError) throw new Error("Il risultato è salvato, ma il tabellone richiede una verifica.");
    }
    await auditAndTouch(
      "modifica_risultato",
      "match",
      input.status === "live" ? "Aggiornato punteggio parziale" : "Aggiornato risultato e stato",
      input.id,
    );
    return NextResponse.json({
      data,
      message:
        input.status === "live"
          ? "Punteggio aggiornato"
          : "Risultato salvato e classifica aggiornata",
    });
  } catch (error) {
    return apiError(error);
  }
}

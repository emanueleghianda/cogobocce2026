import { z } from "zod";
import { GROUP_CODES, MATCH_STATUSES } from "@/types/tournament";
import { TOURNAMENT_STATUS_LABELS } from "@/lib/constants";

const optionalText = z.string().nullable().optional();

export const teamUpdateSchema = z.object({
  id: z.uuid(),
  name: z.string().trim().min(1, "Il nome della coppia è obbligatorio."),
  player_one: optionalText,
  player_two: optionalText,
  group_code: z.enum(GROUP_CODES),
  display_order: z.number().int().positive(),
});

export const matchUpdateSchema = z.object({
  id: z.uuid(),
  score_one: z.number().int().min(0).nullable(),
  score_two: z.number().int().min(0).nullable(),
  status: z.enum(MATCH_STATUSES),
  scheduled_at: z.iso.datetime({ offset: true }).nullable().optional(),
  court: optionalText,
  note: optionalText,
  confirmCascade: z.boolean().optional().default(false),
});

export const settingsUpdateSchema = z.object({
  tournament_status: z.enum(Object.keys(TOURNAMENT_STATUS_LABELS) as [
    keyof typeof TOURNAMENT_STATUS_LABELS,
    ...(keyof typeof TOURNAMENT_STATUS_LABELS)[],
  ]),
  public_announcement: z.string().nullable(),
});

export const rankingEntrySchema = z.object({
  id: z.uuid().optional(),
  ranking_period: z.string().trim().min(1),
  rank_position: z.number().int().positive(),
  participant_name: z.string().trim().min(1, "Il nome del partecipante è obbligatorio."),
  points: z.number().int().min(0),
  display_order: z.number().int().positive(),
});

export const rankingActionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("update"), entry: rankingEntrySchema.extend({ id: z.uuid() }) }),
  z.object({ action: z.literal("add"), entry: rankingEntrySchema.omit({ id: true }) }),
  z.object({ action: z.literal("delete"), id: z.uuid(), confirmed: z.literal(true) }),
  z.object({ action: z.literal("reset"), confirmed: z.literal(true) }),
]);

export const overridesSchema = z.object({
  group_code: z.enum(GROUP_CODES),
  reason: z.string().nullable(),
  entries: z
    .array(z.object({ team_id: z.uuid(), manual_rank: z.number().int().positive() }))
    .min(3),
  confirmed: z.literal(true),
});

import { CalendarClock, MapPin } from "lucide-react";
import { MATCH_STATUS_LABELS, STAGE_LABELS } from "@/lib/constants";
import { formatDate, formatTime } from "@/lib/format";
import { TeamName } from "@/components/tournament/TeamName";
import type { Match, Team } from "@/types/tournament";

export function MatchCard({ match, teams }: { match: Match; teams: Team[] }) {
  const teamOne = teams.find((team) => team.id === match.team_one_id);
  const teamTwo = teams.find((team) => team.id === match.team_two_id);
  const oneWins = match.status === "completed" && (match.score_one ?? -1) > (match.score_two ?? -1);
  const twoWins = match.status === "completed" && (match.score_two ?? -1) > (match.score_one ?? -1);
  return (
    <article className={`match-card match-card--${match.status}`}>
      <header className="match-card__header">
        <span>{STAGE_LABELS[match.stage]}{match.group_code ? ` · Girone ${match.group_code}` : match.bracket_slot ? ` · ${match.bracket_slot}` : ""}</span>
        <span className={`match-status match-status--${match.status}`}>{MATCH_STATUS_LABELS[match.status]}</span>
      </header>
      <div className={`match-team ${oneWins ? "is-winner" : ""}`}>
        <TeamName team={teamOne} />
        <strong className="match-score">{match.score_one ?? "–"}</strong>
      </div>
      <div className={`match-team ${twoWins ? "is-winner" : ""}`}>
        <TeamName team={teamTwo} />
        <strong className="match-score">{match.score_two ?? "–"}</strong>
      </div>
      {(match.scheduled_at || match.court) && (
        <footer className="match-card__footer">
          {match.scheduled_at && <span><CalendarClock size={15} aria-hidden="true" /> {formatDate(match.scheduled_at)} · {formatTime(match.scheduled_at)}</span>}
          {match.court && <span><MapPin size={15} aria-hidden="true" /> {match.court}</span>}
        </footer>
      )}
      {match.note && <p className="match-note">{match.note}</p>}
    </article>
  );
}

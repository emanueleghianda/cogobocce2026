import type { Team } from "@/types/tournament";

export function TeamName({ team, showPlayers = false }: { team: Team | undefined; showPlayers?: boolean }) {
  if (!team) return <span className="team-name team-name--pending">Da definire</span>;
  const players = [team.player_one, team.player_two].filter(Boolean).join(" · ");
  return (
    <span className="team-name">
      <strong>{team.name}</strong>
      {showPlayers && players && <small>{players}</small>}
    </span>
  );
}

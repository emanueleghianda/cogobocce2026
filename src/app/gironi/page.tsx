import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { MatchCard } from "@/components/tournament/MatchCard";
import { StandingsTable } from "@/components/tournament/StandingsTable";
import { TeamName } from "@/components/tournament/TeamName";
import { loadPublicTournamentData } from "@/lib/data";
import { calculateAllStandings } from "@/lib/tournament/groups";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gironi e classifiche" };

export default async function GroupsPage() {
  const data = await loadPublicTournamentData();
  const allStandings = calculateAllStandings(data.teams, data.matches, data.overrides);
  return (
    <>
      <PageHero eyebrow="Fase a gironi" title="Gironi e classifiche" description="Quattro gironi. Le prime due coppie di ogni girone accedono ai quarti." />
      <section className="section container">
        {allStandings.map((standings) => {
          const teams = data.teams.filter((team) => team.group_code === standings.groupCode).sort((a,b) => a.display_order - b.display_order);
          const matches = data.matches
            .filter((match) => match.stage === "group" && match.group_code === standings.groupCode)
            .sort((a, b) => (a.match_day ?? 0) - (b.match_day ?? 0));
          return (
            <article className="group-card" key={standings.groupCode}>
              <h2 className="group-card__title">Girone {standings.groupCode}</h2>
              <div className="group-card__body">
                <div className="team-list">{teams.map((team) => <div className="team-tile" key={team.id}><TeamName team={team} showPlayers /></div>)}</div>
                <StandingsTable standings={standings} />
                <h3 className="round-title">Partite del girone</h3>
                {matches.length ? <div className="grid grid--2">{matches.map((match) => <MatchCard key={match.id} match={match} teams={data.teams} />)}</div> : <div className="empty-state">Incontri non ancora generati.</div>}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}

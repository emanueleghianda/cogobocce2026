-- Torneo di Bocce Doppio Cogoleto 2K26
-- Migrazione iniziale completa, eseguibile nel SQL Editor di Supabase.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  player_one text,
  player_two text,
  group_code text not null check (group_code in ('A', 'B', 'C', 'D')),
  display_order integer not null check (display_order > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  stage text not null check (stage in ('group', 'quarterfinal', 'semifinal', 'third_place_final', 'championship_final')),
  group_code text check (group_code in ('A', 'B', 'C', 'D')),
  match_day integer,
  bracket_slot text check (bracket_slot in ('QF1', 'QF2', 'QF3', 'QF4', 'SF1', 'SF2', 'F3', 'F1')),
  team_one_id uuid references public.teams(id) on delete restrict,
  team_two_id uuid references public.teams(id) on delete restrict,
  score_one integer check (score_one is null or score_one >= 0),
  score_two integer check (score_two is null or score_two >= 0),
  status text not null default 'scheduled' check (status in ('scheduled', 'live', 'completed', 'postponed', 'cancelled')),
  scheduled_at timestamptz,
  court text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint matches_distinct_teams check (team_one_id is null or team_two_id is null or team_one_id <> team_two_id),
  constraint matches_group_shape check (
    (stage = 'group' and group_code is not null and match_day between 1 and 3 and bracket_slot is null)
    or
    (stage <> 'group' and group_code is null and match_day is null and bracket_slot is not null)
  ),
  constraint matches_partial_score_limit check (
    (stage = 'group' and (score_one is null or score_one between 0 and 10) and (score_two is null or score_two between 0 and 10)) or
    (stage <> 'group' and (score_one is null or score_one between 0 and 12) and (score_two is null or score_two between 0 and 12))
  ),
  constraint matches_completed_score check (
    status <> 'completed' or (
      team_one_id is not null and team_two_id is not null and score_one is not null and score_two is not null and (
        (stage = 'group' and ((score_one = 10 and score_two between 0 and 9) or (score_two = 10 and score_one between 0 and 9))) or
        (stage <> 'group' and ((score_one = 12 and score_two between 0 and 11) or (score_two = 12 and score_one between 0 and 11)))
      )
    )
  )
);

create unique index matches_bracket_slot_unique on public.matches(bracket_slot) where bracket_slot is not null;

create table public.tournament_settings (
  id integer primary key check (id = 1),
  tournament_status text not null check (tournament_status in ('registrations', 'groups_pending', 'groups_live', 'quarterfinals', 'semifinals', 'finals', 'completed', 'suspended')),
  public_announcement text,
  group_matches_generated boolean not null default false,
  finals_generated boolean not null default false,
  last_public_update timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ranking_overrides (
  id uuid primary key default gen_random_uuid(),
  group_code text not null check (group_code in ('A', 'B', 'C', 'D')),
  team_id uuid not null references public.teams(id) on delete cascade,
  manual_rank integer not null check (manual_rank > 0),
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_code, team_id),
  unique (group_code, manual_rank)
);

create table public.historical_ranking (
  id uuid primary key default gen_random_uuid(),
  ranking_period text not null,
  rank_position integer not null check (rank_position > 0),
  participant_name text not null,
  points integer not null check (points >= 0),
  display_order integer not null check (display_order > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text,
  entity_id text,
  summary text,
  created_at timestamptz not null default now()
);

create table public.admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  success boolean not null,
  attempted_at timestamptz not null default now()
);

create index teams_group_code_idx on public.teams(group_code);
create index teams_display_order_idx on public.teams(display_order);
create index matches_group_code_idx on public.matches(group_code);
create index matches_status_idx on public.matches(status);
create index matches_stage_idx on public.matches(stage);
create index matches_scheduled_at_idx on public.matches(scheduled_at);
create index matches_bracket_slot_idx on public.matches(bracket_slot);
create index historical_ranking_display_order_idx on public.historical_ranking(display_order);
create index ranking_overrides_group_code_idx on public.ranking_overrides(group_code);
create index admin_login_attempts_ip_hash_idx on public.admin_login_attempts(ip_hash);
create index admin_login_attempts_attempted_at_idx on public.admin_login_attempts(attempted_at);
create index admin_audit_log_created_at_idx on public.admin_audit_log(created_at desc);

create trigger teams_set_updated_at before update on public.teams
for each row execute function public.set_updated_at();
create trigger matches_set_updated_at before update on public.matches
for each row execute function public.set_updated_at();
create trigger tournament_settings_set_updated_at before update on public.tournament_settings
for each row execute function public.set_updated_at();
create trigger ranking_overrides_set_updated_at before update on public.ranking_overrides
for each row execute function public.set_updated_at();
create trigger historical_ranking_set_updated_at before update on public.historical_ranking
for each row execute function public.set_updated_at();

create or replace function public.cleanup_admin_login_attempts()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  removed integer;
begin
  delete from public.admin_login_attempts where attempted_at < now() - interval '24 hours';
  get diagnostics removed = row_count;
  return removed;
end;
$$;
revoke all on function public.cleanup_admin_login_attempts() from public, anon, authenticated;

insert into public.tournament_settings (
  id, tournament_status, public_announcement, group_matches_generated, finals_generated, last_public_update
) values (
  1,
  'registrations',
  'Le iscrizioni e la composizione dei gironi saranno aggiornate dall’organizzazione.',
  false,
  false,
  now()
);

insert into public.teams (id, name, player_one, player_two, group_code, display_order) values
('00000000-0000-4000-8000-000000000001', 'Coppia 1', '', '', 'A', 1),
('00000000-0000-4000-8000-000000000002', 'Coppia 2', '', '', 'A', 2),
('00000000-0000-4000-8000-000000000003', 'Coppia 3', '', '', 'A', 3),
('00000000-0000-4000-8000-000000000004', 'Coppia 4', '', '', 'A', 4),
('00000000-0000-4000-8000-000000000005', 'Coppia 5', '', '', 'B', 5),
('00000000-0000-4000-8000-000000000006', 'Coppia 6', '', '', 'B', 6),
('00000000-0000-4000-8000-000000000007', 'Coppia 7', '', '', 'B', 7),
('00000000-0000-4000-8000-000000000008', 'Coppia 8', '', '', 'B', 8),
('00000000-0000-4000-8000-000000000009', 'Coppia 9', '', '', 'C', 9),
('00000000-0000-4000-8000-000000000010', 'Coppia 10', '', '', 'C', 10),
('00000000-0000-4000-8000-000000000011', 'Coppia 11', '', '', 'C', 11),
('00000000-0000-4000-8000-000000000012', 'Coppia 12', '', '', 'C', 12),
('00000000-0000-4000-8000-000000000013', 'Coppia 13', '', '', 'D', 13),
('00000000-0000-4000-8000-000000000014', 'Coppia 14', '', '', 'D', 14),
('00000000-0000-4000-8000-000000000015', 'Coppia 15', '', '', 'D', 15),
('00000000-0000-4000-8000-000000000016', 'Coppia 16', '', '', 'D', 16);

insert into public.historical_ranking
(id, ranking_period, rank_position, participant_name, points, display_order) values
('10000000-0000-4000-8000-000000000001', '2020-2025', 1, 'Cesare Ghianda', 48, 1),
('10000000-0000-4000-8000-000000000002', '2020-2025', 2, 'Matteo Binda', 46, 2),
('10000000-0000-4000-8000-000000000003', '2020-2025', 3, 'Luigi Ghianda', 36, 3),
('10000000-0000-4000-8000-000000000004', '2020-2025', 4, 'Emanuele Ghianda', 34, 4),
('10000000-0000-4000-8000-000000000005', '2020-2025', 5, 'Enzo Carena', 32, 5),
('10000000-0000-4000-8000-000000000006', '2020-2025', 6, 'Marco', 16, 6),
('10000000-0000-4000-8000-000000000007', '2020-2025', 6, 'Piera Ciccarelli', 16, 7),
('10000000-0000-4000-8000-000000000008', '2020-2025', 6, 'Cristina', 16, 8),
('10000000-0000-4000-8000-000000000009', '2020-2025', 6, 'Ilaria', 16, 9),
('10000000-0000-4000-8000-000000000010', '2020-2025', 10, 'Alessio', 14, 10),
('10000000-0000-4000-8000-000000000011', '2020-2025', 11, 'Stefano Giannelli', 10, 11),
('10000000-0000-4000-8000-000000000012', '2020-2025', 11, 'Simone Imberti', 10, 12),
('10000000-0000-4000-8000-000000000013', '2020-2025', 11, 'Luisa', 10, 13),
('10000000-0000-4000-8000-000000000014', '2020-2025', 11, 'Teresa', 10, 14),
('10000000-0000-4000-8000-000000000015', '2020-2025', 11, 'Barbara', 10, 15),
('10000000-0000-4000-8000-000000000016', '2020-2025', 16, 'Andrea Binda', 8, 16),
('10000000-0000-4000-8000-000000000017', '2020-2025', 16, 'Luigi Ciccarelli', 8, 17),
('10000000-0000-4000-8000-000000000018', '2020-2025', 18, 'Pierpaolo Scoccimarro', 6, 18),
('10000000-0000-4000-8000-000000000019', '2020-2025', 18, 'Stefano Cracco', 6, 19),
('10000000-0000-4000-8000-000000000020', '2020-2025', 18, 'Walter', 6, 20),
('10000000-0000-4000-8000-000000000021', '2020-2025', 18, 'Davide Gaggino', 6, 21),
('10000000-0000-4000-8000-000000000022', '2020-2025', 18, 'De Battistis', 6, 22),
('10000000-0000-4000-8000-000000000023', '2020-2025', 18, 'Ketty', 6, 23),
('10000000-0000-4000-8000-000000000024', '2020-2025', 24, 'Susanna', 4, 24),
('10000000-0000-4000-8000-000000000025', '2020-2025', 24, 'Luca Pulice', 4, 25),
('10000000-0000-4000-8000-000000000026', '2020-2025', 24, 'Enzo', 4, 26),
('10000000-0000-4000-8000-000000000027', '2020-2025', 27, 'Edoardo Capurro', 2, 27),
('10000000-0000-4000-8000-000000000028', '2020-2025', 27, 'Francesco Novarini', 2, 28),
('10000000-0000-4000-8000-000000000029', '2020-2025', 27, 'Davide Novarini', 2, 29),
('10000000-0000-4000-8000-000000000030', '2020-2025', 27, 'Elena', 2, 30);

alter table public.teams enable row level security;
alter table public.matches enable row level security;
alter table public.tournament_settings enable row level security;
alter table public.ranking_overrides enable row level security;
alter table public.historical_ranking enable row level security;
alter table public.admin_audit_log enable row level security;
alter table public.admin_login_attempts enable row level security;

create policy "Lettura pubblica coppie" on public.teams for select to anon, authenticated using (true);
create policy "Lettura pubblica partite" on public.matches for select to anon, authenticated using (true);
create policy "Lettura pubblica impostazioni" on public.tournament_settings for select to anon, authenticated using (true);
create policy "Lettura pubblica ranking storico" on public.historical_ranking for select to anon, authenticated using (true);

grant usage on schema public to anon, authenticated;
grant select on public.teams, public.matches, public.tournament_settings, public.historical_ranking to anon, authenticated;
revoke all on public.ranking_overrides, public.admin_audit_log, public.admin_login_attempts from anon, authenticated;

alter publication supabase_realtime add table public.teams;
alter publication supabase_realtime add table public.matches;
alter publication supabase_realtime add table public.tournament_settings;
alter publication supabase_realtime add table public.historical_ranking;

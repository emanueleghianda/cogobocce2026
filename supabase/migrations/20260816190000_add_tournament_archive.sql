-- Archivio multi-torneo: assegna tutti i dati esistenti al Doppio 2K26.
-- Questa migrazione non cancella né modifica risultati, punteggi o partecipanti.

create table public.tournaments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_title text not null,
  format text not null check (format in ('double', 'single')),
  season_label text not null,
  logo_path text not null,
  is_active boolean not null default false,
  is_archived boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index tournaments_one_active_idx
on public.tournaments (is_active)
where is_active;

create trigger tournaments_set_updated_at before update on public.tournaments
for each row execute function public.set_updated_at();

insert into public.tournaments (
  id,
  slug,
  title,
  short_title,
  format,
  season_label,
  logo_path,
  is_active,
  is_archived,
  archived_at
) values (
  'd0000000-0000-4000-8000-000000002026',
  'doppio-2k26',
  'Torneo di Bocce Doppio Cogoleto 2K26',
  'Doppio 2K26',
  'double',
  'Cogoleto · Estate 2026',
  '/logo-doppio-2k26.png',
  true,
  true,
  now()
);

alter table public.teams add column tournament_id uuid;
alter table public.matches add column tournament_id uuid;
alter table public.tournament_settings add column tournament_id uuid;
alter table public.ranking_overrides add column tournament_id uuid;
alter table public.admin_audit_log add column tournament_id uuid;

update public.teams
set tournament_id = 'd0000000-0000-4000-8000-000000002026';

update public.matches
set tournament_id = 'd0000000-0000-4000-8000-000000002026';

update public.tournament_settings
set tournament_id = 'd0000000-0000-4000-8000-000000002026';

update public.ranking_overrides
set tournament_id = 'd0000000-0000-4000-8000-000000002026';

update public.admin_audit_log
set tournament_id = 'd0000000-0000-4000-8000-000000002026';

alter table public.teams alter column tournament_id set not null;
alter table public.matches alter column tournament_id set not null;
alter table public.tournament_settings alter column tournament_id set not null;
alter table public.ranking_overrides alter column tournament_id set not null;

alter table public.teams
add constraint teams_tournament_id_fkey foreign key (tournament_id)
references public.tournaments(id) on delete restrict;

alter table public.matches
add constraint matches_tournament_id_fkey foreign key (tournament_id)
references public.tournaments(id) on delete restrict;

alter table public.tournament_settings
add constraint tournament_settings_tournament_id_fkey foreign key (tournament_id)
references public.tournaments(id) on delete restrict;

alter table public.ranking_overrides
add constraint ranking_overrides_tournament_id_fkey foreign key (tournament_id)
references public.tournaments(id) on delete restrict;

alter table public.ranking_overrides
drop constraint if exists ranking_overrides_group_code_team_id_key;

alter table public.ranking_overrides
drop constraint if exists ranking_overrides_group_code_manual_rank_key;

alter table public.ranking_overrides
add constraint ranking_overrides_tournament_group_team_unique
unique (tournament_id, group_code, team_id);

alter table public.ranking_overrides
add constraint ranking_overrides_tournament_group_rank_unique
unique (tournament_id, group_code, manual_rank);

alter table public.admin_audit_log
add constraint admin_audit_log_tournament_id_fkey foreign key (tournament_id)
references public.tournaments(id) on delete set null;

alter table public.tournament_settings
drop constraint if exists tournament_settings_id_check;

create unique index tournament_settings_tournament_id_unique
on public.tournament_settings(tournament_id);

drop index if exists public.matches_bracket_slot_unique;
create unique index matches_tournament_bracket_slot_unique
on public.matches(tournament_id, bracket_slot)
where bracket_slot is not null;

create index teams_tournament_id_idx on public.teams(tournament_id);
create index matches_tournament_id_idx on public.matches(tournament_id);
create index ranking_overrides_tournament_id_idx on public.ranking_overrides(tournament_id);
create index admin_audit_log_tournament_id_idx on public.admin_audit_log(tournament_id);

alter table public.tournaments enable row level security;
create policy "Lettura pubblica tornei" on public.tournaments
for select to anon, authenticated using (true);

grant select on public.tournaments to anon, authenticated;
alter publication supabase_realtime add table public.tournaments;

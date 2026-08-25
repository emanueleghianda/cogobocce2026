-- Passaggio alla stagione di attesa 2K27.
-- Il Singolo 2K26 viene archiviato senza eliminare o riscrivere partecipanti,
-- gironi, partite, punteggi, override o fase finale.

begin;

alter table public.historical_ranking
add column if not exists ranking_type text;

update public.historical_ranking
set ranking_type = 'global'
where ranking_type is null;

alter table public.historical_ranking
alter column ranking_type set default 'global';

alter table public.historical_ranking
alter column ranking_type set not null;

alter table public.historical_ranking
drop constraint if exists historical_ranking_ranking_type_check;

alter table public.historical_ranking
add constraint historical_ranking_ranking_type_check
check (ranking_type in ('global', 'triennial'));

create index if not exists historical_ranking_type_order_idx
on public.historical_ranking(ranking_type, display_order);

delete from public.historical_ranking;

insert into public.historical_ranking
(ranking_period, ranking_type, rank_position, participant_name, points, display_order) values
('2020-2026', 'global', 1, 'Cesare Ghianda', 58, 1),
('2020-2026', 'global', 2, 'Emanuele Ghianda', 50, 2),
('2020-2026', 'global', 3, 'Matteo Binda', 46, 3),
('2020-2026', 'global', 4, 'Luigi Ghianda', 40, 4),
('2020-2026', 'global', 5, 'Enzo Carena', 32, 5),
('2020-2026', 'global', 6, 'Marco Cantamessa', 26, 6),
('2020-2026', 'global', 7, 'Teresa Cantamessa', 20, 7),
('2020-2026', 'global', 8, 'Piera Ciccarelli', 16, 8),
('2020-2026', 'global', 8, 'Cristina', 16, 9),
('2020-2026', 'global', 8, 'Ilaria Bocelli', 16, 10),
('2020-2026', 'global', 11, 'Alessio Accetta', 14, 11),
('2020-2026', 'global', 12, 'Stefano Giannelli', 12, 12),
('2020-2026', 'global', 13, 'Katty Bussa', 10, 13),
('2020-2026', 'global', 13, 'Simone Imberti', 10, 14),
('2020-2026', 'global', 13, 'Luisa Cantamessa', 10, 15),
('2020-2026', 'global', 13, 'Barbara', 10, 16),
('2020-2026', 'global', 17, 'Andrea Binda', 8, 17),
('2020-2026', 'global', 17, 'Luigi Ciccarelli', 8, 18),
('2020-2026', 'global', 19, 'Marcello Sala', 6, 19),
('2020-2026', 'global', 19, 'Pierpaolo Scoccimarro', 6, 20),
('2020-2026', 'global', 19, 'Stefano Cracco', 6, 21),
('2020-2026', 'global', 19, 'Walter Cantamessa', 6, 22),
('2020-2026', 'global', 19, 'Davide Gaggino', 6, 23),
('2020-2026', 'global', 19, 'De Battistis', 6, 24),
('2020-2026', 'global', 25, 'Mary Gemme', 4, 25),
('2020-2026', 'global', 25, 'Susanna Grimaldi', 4, 26),
('2020-2026', 'global', 25, 'Luca Pulice', 4, 27),
('2020-2026', 'global', 25, 'Enzo Grimaldi', 4, 28),
('2020-2026', 'global', 29, 'Paolo Riva', 2, 29),
('2020-2026', 'global', 29, 'Edoardo Capurro', 2, 30),
('2020-2026', 'global', 29, 'Francesco Novarini', 2, 31),
('2020-2026', 'global', 29, 'Davide Novarini', 2, 32),
('2020-2026', 'global', 29, 'Elena Poretta', 2, 33),
('2024-2026', 'triennial', 1, 'Emanuele Ghianda', 28, 1),
('2024-2026', 'triennial', 2, 'Cesare Ghianda', 24, 2),
('2024-2026', 'triennial', 2, 'Luigi Ghianda', 24, 3),
('2024-2026', 'triennial', 4, 'Marco Cantamessa', 16, 4),
('2024-2026', 'triennial', 5, 'Matteo Binda', 14, 5),
('2024-2026', 'triennial', 5, 'Ilaria Bocelli', 14, 6),
('2024-2026', 'triennial', 7, 'Stefano Giannelli', 12, 7),
('2024-2026', 'triennial', 8, 'Teresa Cantamessa', 10, 8),
('2024-2026', 'triennial', 8, 'Simone Imberti', 10, 9),
('2024-2026', 'triennial', 10, 'Marcello Sala', 6, 10),
('2024-2026', 'triennial', 10, 'Pierpaolo Scoccimarro', 6, 11),
('2024-2026', 'triennial', 10, 'Luisa Cantamessa', 6, 12),
('2024-2026', 'triennial', 13, 'Stefano Cracco', 4, 13),
('2024-2026', 'triennial', 13, 'Mary Gemme', 4, 14),
('2024-2026', 'triennial', 15, 'Paolo Riva', 2, 15),
('2024-2026', 'triennial', 15, 'Edoardo Capurro', 2, 16),
('2024-2026', 'triennial', 15, 'Alessio Accetta', 2, 17),
('2024-2026', 'triennial', 15, 'Elena Poretta', 2, 18);

update public.tournament_settings
set tournament_status = 'completed', last_public_update = now()
where tournament_id = '50000000-0000-4000-8000-000000002026';

update public.tournaments
set is_active = false,
    is_archived = true,
    archived_at = coalesce(archived_at, now())
where id = '50000000-0000-4000-8000-000000002026';

insert into public.tournaments (
  id, slug, title, short_title, format, season_label, logo_path,
  is_active, is_archived, archived_at
) values (
  '27000000-0000-4000-8000-000000002027',
  'aspettando-2k27',
  'ASPETTANDO IL TORNEO DI BOCCE 2K27',
  'Bocce Cogoleto 2K27',
  'double',
  'Prossimo appuntamento · Agosto 2027',
  '/logo-attesa-2k27.png',
  true,
  false,
  null
)
on conflict (id) do update set
  slug = excluded.slug,
  title = excluded.title,
  short_title = excluded.short_title,
  season_label = excluded.season_label,
  logo_path = excluded.logo_path,
  is_active = true,
  is_archived = false,
  archived_at = null;

insert into public.tournament_settings (
  id, tournament_id, tournament_status, public_announcement,
  group_matches_generated, finals_generated, last_public_update
) values (
  3,
  '27000000-0000-4000-8000-000000002027',
  'suspended',
  'Il Doppio e il Singolo torneranno ad agosto 2027.',
  false,
  false,
  now()
)
on conflict (tournament_id) do update set
  tournament_status = excluded.tournament_status,
  public_announcement = excluded.public_announcement,
  group_matches_generated = false,
  finals_generated = false,
  last_public_update = excluded.last_public_update;

commit;

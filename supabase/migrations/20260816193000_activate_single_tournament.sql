-- Attiva il Singolo 2K26 dopo il deployment del codice multi-torneo.
-- Il Doppio resta archiviato e tutte le sue righe rimangono nel database.

update public.tournaments
set is_active = false
where slug = 'doppio-2k26';

insert into public.tournaments (
  id,
  slug,
  title,
  short_title,
  format,
  season_label,
  logo_path,
  is_active,
  is_archived
) values (
  '50000000-0000-4000-8000-000000002026',
  'singolo-2k26',
  'Torneo di Bocce Singolo Cogoleto 2K26',
  'Singolo 2K26',
  'single',
  'Cogoleto · Estate 2026',
  '/logo-singolo-2k26.png',
  true,
  false
);

insert into public.tournament_settings (
  id,
  tournament_id,
  tournament_status,
  public_announcement,
  group_matches_generated,
  finals_generated,
  last_public_update
) values (
  2,
  '50000000-0000-4000-8000-000000002026',
  'registrations',
  'I partecipanti e la composizione dei gironi saranno aggiornati dall’organizzazione.',
  false,
  false,
  now()
);

insert into public.teams (
  id,
  tournament_id,
  name,
  player_one,
  player_two,
  group_code,
  display_order
) values
('20000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000002026', 'Giocatore 1', null, null, 'A', 1),
('20000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000002026', 'Giocatore 2', null, null, 'A', 2),
('20000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-000000002026', 'Giocatore 3', null, null, 'A', 3),
('20000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-000000002026', 'Giocatore 4', null, null, 'A', 4),
('20000000-0000-4000-8000-000000000005', '50000000-0000-4000-8000-000000002026', 'Giocatore 5', null, null, 'B', 5),
('20000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000002026', 'Giocatore 6', null, null, 'B', 6),
('20000000-0000-4000-8000-000000000007', '50000000-0000-4000-8000-000000002026', 'Giocatore 7', null, null, 'B', 7),
('20000000-0000-4000-8000-000000000008', '50000000-0000-4000-8000-000000002026', 'Giocatore 8', null, null, 'B', 8),
('20000000-0000-4000-8000-000000000009', '50000000-0000-4000-8000-000000002026', 'Giocatore 9', null, null, 'C', 9),
('20000000-0000-4000-8000-000000000010', '50000000-0000-4000-8000-000000002026', 'Giocatore 10', null, null, 'C', 10),
('20000000-0000-4000-8000-000000000011', '50000000-0000-4000-8000-000000002026', 'Giocatore 11', null, null, 'C', 11),
('20000000-0000-4000-8000-000000000012', '50000000-0000-4000-8000-000000002026', 'Giocatore 12', null, null, 'C', 12),
('20000000-0000-4000-8000-000000000013', '50000000-0000-4000-8000-000000002026', 'Giocatore 13', null, null, 'D', 13),
('20000000-0000-4000-8000-000000000014', '50000000-0000-4000-8000-000000002026', 'Giocatore 14', null, null, 'D', 14),
('20000000-0000-4000-8000-000000000015', '50000000-0000-4000-8000-000000002026', 'Giocatore 15', null, null, 'D', 15),
('20000000-0000-4000-8000-000000000016', '50000000-0000-4000-8000-000000002026', 'Giocatore 16', null, null, 'D', 16);

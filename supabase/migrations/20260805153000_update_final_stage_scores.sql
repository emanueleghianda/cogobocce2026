-- Quarti e semifinali si concludono a 10 punti; le due finali a 12.

alter table public.matches
drop constraint if exists matches_partial_score_limit;

alter table public.matches
add constraint matches_partial_score_limit check (
  (
    stage in ('group', 'quarterfinal', 'semifinal')
    and (score_one is null or score_one between 0 and 10)
    and (score_two is null or score_two between 0 and 10)
  )
  or
  (
    stage in ('third_place_final', 'championship_final')
    and (score_one is null or score_one between 0 and 12)
    and (score_two is null or score_two between 0 and 12)
  )
);

alter table public.matches
drop constraint if exists matches_completed_score;

alter table public.matches
add constraint matches_completed_score check (
  status <> 'completed'
  or (
    team_one_id is not null
    and team_two_id is not null
    and score_one is not null
    and score_two is not null
    and (
      (
        stage in ('group', 'quarterfinal', 'semifinal')
        and (
          (score_one = 10 and score_two between 0 and 9)
          or (score_two = 10 and score_one between 0 and 9)
        )
      )
      or
      (
        stage in ('third_place_final', 'championship_final')
        and (
          (score_one = 12 and score_two between 0 and 11)
          or (score_two = 12 and score_one between 0 and 11)
        )
      )
    )
  )
);

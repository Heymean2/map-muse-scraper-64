
-- create a function to increment the total_rows counter
create or replace function increment_rows(row_increment int)
returns int
language sql
security definer
as $$
  update profiles
  set total_rows = coalesce(total_rows, 0) + row_increment
  where id = auth.uid()
  returning total_rows;
$$;

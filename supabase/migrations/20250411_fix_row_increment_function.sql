
-- Create a function that calculates the new row count value
-- This avoids typing issues with the RPC call
create or replace function public.increment_rows_calculation(current_rows int)
returns int
language sql
as $$
  select coalesce(total_rows, 0) + current_rows
  from profiles
  where id = auth.uid()
$$;

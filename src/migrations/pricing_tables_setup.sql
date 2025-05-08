
-- This is a SQL migration script that you can run in your Supabase SQL editor
-- to set up the necessary tables for the pricing plans

-- Create the pricing_plans table
create table if not exists public.pricing_plans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  plan_type text not null default 'subscription',
  features jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add row level security to pricing_plans
alter table public.pricing_plans enable row level security;

-- Create policy for anonymous users to read pricing plans
create policy "Pricing plans are viewable by everyone" 
  on pricing_plans for select 
  using (true);

-- Create user_subscriptions table
create table if not exists public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null references public.pricing_plans(id) on delete restrict,
  status text not null default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add row level security to user_subscriptions
alter table public.user_subscriptions enable row level security;

-- Create policy for users to read their own subscriptions
create policy "Users can view their own subscriptions" 
  on user_subscriptions for select 
  using (auth.uid() = user_id);

-- Create policy for service role to manage subscriptions
create policy "Service role can manage subscriptions" 
  on user_subscriptions for all 
  using (auth.jwt() -> 'role' = 'service_role');

-- Insert initial pricing plans
insert into public.pricing_plans (name, description, price, plan_type, features)
values
  ('Basic Plan', 'Unlimited data scraping with basic features', 19.99, 'subscription', '{"unlimited_rows": true, "reviews_data": false}'),
  ('Pro Plan', 'Unlimited data scraping with all premium features', 49.99, 'subscription', '{"unlimited_rows": true, "reviews_data": true, "priority_support": true}');

-- Create a function to get current user plan
create or replace function get_user_plan(user_id uuid)
returns table (
  plan_id uuid,
  plan_name text,
  plan_price numeric,
  features jsonb
) as $$
begin
  return query
  select
    pp.id as plan_id,
    pp.name as plan_name,
    pp.price as plan_price,
    pp.features as features
  from
    user_subscriptions us
    join pricing_plans pp on us.plan_id = pp.id
  where
    us.user_id = $1
    and us.status = 'active'
    and (us.end_date is null or us.end_date > now());
end;
$$ language plpgsql security definer;

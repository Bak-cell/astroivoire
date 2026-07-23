ALTER TABLE public.memberships REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.memberships;

-- Lock down SECURITY DEFINER functions: revoke EXECUTE from public/anon.
-- has_role must remain callable by 'authenticated' because RLS policies
-- applied to authenticated users invoke it. update_updated_at_column is a
-- trigger function and needs no direct EXECUTE grants.

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM authenticated;

-- event_registrations: explicitly forbid updates for anon and authenticated
-- non-admins. Without any UPDATE policy, updates are already denied, but we
-- add explicit restrictive policies so the intent is documented.
CREATE POLICY "Only admins can update registrations"
ON public.event_registrations
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Public catalogue only: no customer details, audit records or write access.
BEGIN;
CREATE OR REPLACE FUNCTION public.get_tyre_availability(p_width integer, p_ratio integer, p_diameter integer)
RETURNS TABLE (season text, brand text, model text, tyre_year integer, pairs integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT s.season, s.brand, s.model, s.tyre_year, s.pairs
  FROM public.tyre_stock s
  WHERE s.width = p_width AND s.aspect_ratio = p_ratio AND s.diameter = p_diameter
    AND s.archived_at IS NULL AND s.pairs > 0
    AND p_width BETWEEN 125 AND 355 AND p_width % 5 = 0
    AND p_ratio BETWEEN 20 AND 85 AND p_ratio % 5 = 0
    AND p_diameter BETWEEN 13 AND 23
  ORDER BY s.season, s.brand, s.model, s.tyre_year DESC;
$$;
REVOKE ALL ON FUNCTION public.get_tyre_availability(integer,integer,integer) FROM public;
GRANT EXECUTE ON FUNCTION public.get_tyre_availability(integer,integer,integer) TO anon, authenticated;
COMMIT;

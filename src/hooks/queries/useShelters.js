/**
 * React Query hooks for shelters.
 *
 * useShelters(filters)  — fetches shelter list, ordered by name
 *   filters: { search } — optional case-insensitive name search
 *
 * useShelter(id)        — fetches a single shelter (disabled when id is falsy)
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useShelters(filters = {}) {
  const { search } = filters;

  return useQuery({
    queryKey: ["shelters", filters],
    queryFn: async () => {
      let query = supabase.from("shelters").select("*").order("name");

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useShelter(id) {
  return useQuery({
    queryKey: ["shelters", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shelters")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

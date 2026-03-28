/**
 * React Query hooks for animals.
 *
 * useAnimals(filters)  — fetches animal list, newest first
 *   filters: { shelterId, species, status = "available" }
 *
 * useAnimal(id)        — fetches a single animal (disabled when id is falsy)
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useAnimals(filters = {}) {
  const { shelterId, species, status = "available" } = filters;

  return useQuery({
    queryKey: ["animals", filters],
    queryFn: async () => {
      let query = supabase
        .from("animals")
        .select("*")
        .order("created_at", { ascending: false });

      if (shelterId) {
        query = query.eq("shelter_id", shelterId);
      }
      if (species) {
        query = query.eq("species", species);
      }
      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useAnimal(id) {
  return useQuery({
    queryKey: ["animals", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

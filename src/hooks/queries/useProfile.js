/**
 * React Query hooks for user profiles.
 *
 * useProfile(userId)    — fetches a single profile by ID (disabled when userId is falsy)
 * useUpdateProfile()    — mutation that upserts arbitrary profile fields
 *                         and writes the response directly into the cache
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useProfile(userId) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const payload = Object.fromEntries(
        Object.entries({ id, ...updates }).filter(([, value]) => value !== undefined),
      );

      const { data, error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["profile", data.id], data);
    },
  });
}

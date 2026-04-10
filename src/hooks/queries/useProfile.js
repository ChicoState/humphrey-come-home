/**
 * React Query hooks for user profiles.
 *
 * useProfile(userId)    — fetches a single profile by ID (disabled when userId is falsy)
 * useUpdateProfile()    — mutation that updates { id, name, home_location }
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
    mutationFn: async ({ id, name, home_location }) => {
      const { data, error } = await supabase
        .from("profiles")
        .upsert({ id, name, home_location }, { onConflict: "id" })
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

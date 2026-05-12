/**
 * React Query hooks for notification preferences.
 *
 * useNotificationPreferences(userId)    — fetches notification preferences for a user (disabled when userId is falsy)
 * useUpdateNotificationPreferences()    — mutation that updates notification preferences
 *                                         and writes the response directly into the cache
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useNotificationPreferences(userId) {
  return useQuery({
    queryKey: ["notificationPreferences", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, nearby_posts_enabled, matches_enabled, replies_enabled, ...updates }) => {
      const payload = {
        user_id: userId,
        lost_pet_notifications: nearby_posts_enabled,
        found_pet_notifications: matches_enabled,
        post_replies: replies_enabled,
        ...updates,
      };

      const { data, error } = await supabase
        .from("notification_preferences")
        .upsert(payload, { onConflict: "user_id" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["notificationPreferences", data.user_id], data);
    },
  });
}

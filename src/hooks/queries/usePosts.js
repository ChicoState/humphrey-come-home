/**
 * React Query hooks for lost/found posts.
 *
 * usePosts(filters)     — fetches posts list, newest first
 *   filters: { status, userId }
 *
 * usePost(id)           — fetches a single post (disabled when id is falsy)
 * useCreatePost()       — mutation: creates a new post
 * useUpdatePost()       — mutation: updates { id, ...fields } on an existing post
 *
 * Both mutations invalidate the posts cache on success.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function usePosts(filters = {}) {
  const { status, userId } = filters ?? {};

  return useQuery({
    queryKey: ["posts", filters],
    queryFn: async () => {
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (status) {
        query = Array.isArray(status)
          ? query.in("status", status)
          : query.eq("status", status);
      }
      if (userId) {
        query = query.eq("user_id", userId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: filters !== null,
  });
}

export function usePost(id) {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newPost) => {
      const { data, error } = await supabase
        .from("posts")
        .insert(newPost)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", data.id] });
    },
  });
}

import { useEffect } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

/**
 * Custom hook that ensures all Supabase operations include the Firebase user ID
 * This provides data isolation at the application level since we disabled RLS
 */
export function useFirebaseSupabase() {
  const { user } = useAuthContext();

  const createUserProgress = async (data: {
    date: string;
    action_id: string;
    completed: boolean;
  }) => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_progress")
      .upsert({
        ...data,
        user_id: user.uid,
      });
  };

  const getUserProgress = async (startDate: string, endDate: string) => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.uid)
      .gte("date", startDate)
      .lte("date", endDate);
  };

  const deleteUserProgress = async (progressId: string) => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_progress")
      .delete()
      .eq("id", progressId)
      .eq("user_id", user.uid); // Ensure user can only delete their own data
  };

  const createUserGoal = async (data: {
    category: string;
    struggle: string;
    time_per_day: number;
    budget: number;
  }) => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_goals")
      .insert({
        ...data,
        user_id: user.uid,
      });
  };

  const getUserGoals = async () => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_goals")
      .select("*")
      .eq("user_id", user.uid);
  };

  const createUserCommitment = async (data: {
    goal_id: string;
    protocol_id: string;
    commitment_text: string;
    selected_actions: any;
    target_date?: string;
  }) => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_commitments")
      .insert({
        ...data,
        user_id: user.uid,
      });
  };

  const getUserCommitments = async () => {
    if (!user) throw new Error("User not authenticated");
    
    return supabase
      .from("user_commitments")
      .select("*")
      .eq("user_id", user.uid);
  };

  return {
    createUserProgress,
    getUserProgress,
    deleteUserProgress,
    createUserGoal,
    getUserGoals,
    createUserCommitment,
    getUserCommitments,
    isAuthenticated: !!user,
    userId: user?.uid,
  };
}
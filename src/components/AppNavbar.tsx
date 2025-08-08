import { useState, useEffect } from "react";
import { useAuthContext } from "@/components/AuthProvider";
import { useFirebaseSupabase } from "@/hooks/use-firebase-supabase";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Target, Flame } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export function AppNavbar() {
  const { user } = useAuthContext();
  const { getUserGoals, getUserProgress, getUserCommitments } = useFirebaseSupabase();
  const [goals, setGoals] = useState<any[]>([]);
  const [todayProgress, setTodayProgress] = useState<any[]>([]);
  const [commitments, setCommitments] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Load goals
        const { data: goalsData } = await getUserGoals();
        setGoals(goalsData || []);

        // Load commitments
        const { data: commitmentsData } = await getUserCommitments();
        setCommitments(commitmentsData || []);

        // Load today's progress
        const today = new Date().toISOString().split('T')[0];
        const { data: progressData } = await getUserProgress(today, today);
        setTodayProgress(progressData || []);

        // Calculate streak (simplified - just count consecutive days with any progress)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(date.getDate() - i);
          return date.toISOString().split('T')[0];
        });

        const { data: weekProgress } = await getUserProgress(last7Days[6], last7Days[0]);
        const progressByDay = (weekProgress || []).reduce((acc: any, p: any) => {
          acc[p.date] = (acc[p.date] || 0) + (p.completed ? 1 : 0);
          return acc;
        }, {});

        let currentStreak = 0;
        for (const date of last7Days) {
          if (progressByDay[date] > 0) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);
      } catch (error) {
        console.error("Error loading navbar data:", error);
      }
    };

    loadData();
  }, [user, getUserGoals, getUserProgress, getUserCommitments]);

  if (!user) return null;

  const completedToday = todayProgress.filter(p => p.completed).length;
  const totalToday = todayProgress.length;
  const progressPercentage = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="font-bold text-xl text-primary">
            LifeProtocol
          </div>

          {/* Progress Overview */}
          <div className="flex items-center space-x-6">
            {/* Active Goals */}
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <Badge variant="secondary">
                {goals.length} Goals
              </Badge>
            </div>

            {/* Today's Progress */}
            <div className="flex items-center space-x-2 min-w-[120px]">
              <Trophy className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <Progress value={progressPercentage} className="h-2" />
              </div>
              <span className="text-sm text-muted-foreground">
                {completedToday}/{totalToday}
              </span>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <Badge variant="outline" className="text-orange-500 border-orange-500">
                {streak} day streak
              </Badge>
            </div>

            {/* User Actions */}
            <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
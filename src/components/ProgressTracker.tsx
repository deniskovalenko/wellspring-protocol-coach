import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, CheckCircle2, Circle, Flame, Target, TrendingUp, Sparkles } from 'lucide-react';
import { Protocol, Commitment } from '../pages/Index';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface ProgressTrackerProps {
  protocol: Protocol;
  commitments: Commitment[];
  onBack: () => void;
}

interface DayProgress {
  date: string;
  completed: { [actionId: string]: boolean };
}

interface UserProgressData {
  id?: string;
  user_id: string;
  date: string;
  action_id: string;
  completed: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ protocol, commitments, onBack }) => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [progress, setProgress] = useState<DayProgress[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initialize progress data and load from Supabase
  useEffect(() => {
    const initializeProgress = async () => {
      if (!user) return;

      const weekProgress: DayProgress[] = [];
      const today = new Date();
      
      // Create week structure
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        weekProgress.push({
          date: date.toISOString().split('T')[0],
          completed: commitments.reduce((acc, commitment) => ({
            ...acc,
            [commitment.actionId]: false
          }), {})
        });
      }

      try {
        // Load existing progress from Supabase
        const { data: existingProgress, error } = await (supabase as any)
          .from('user_progress')
          .select('*')
          .eq('user_id', user.uid)
          .gte('date', weekProgress[0].date)
          .lte('date', weekProgress[weekProgress.length - 1].date);

        if (error) {
          console.error('Error loading progress:', error);
          toast({
            title: "Error loading progress",
            description: "Could not load your progress data.",
            variant: "destructive",
          });
        } else if (existingProgress) {
          // Merge existing progress into week structure
          existingProgress.forEach((progressItem: any) => {
            const dayIndex = weekProgress.findIndex(day => day.date === progressItem.date);
            if (dayIndex !== -1) {
              weekProgress[dayIndex].completed[progressItem.action_id] = progressItem.completed;
            }
          });
        }
      } catch (error) {
        console.error('Error initializing progress:', error);
      }

      setProgress(weekProgress);
      setLoading(false);
    };

    initializeProgress();
  }, [commitments, user, toast]);

  const toggleCompletion = async (date: string, actionId: string) => {
    if (!user) return;

    const currentState = progress.find(day => day.date === date)?.completed[actionId] || false;
    const newState = !currentState;

    // Optimistically update UI
    setProgress(prev => 
      prev.map(day => 
        day.date === date 
          ? {
              ...day,
              completed: {
                ...day.completed,
                [actionId]: newState
              }
            }
          : day
      )
    );

    try {
      if (newState) {
        // Insert or update completion
        const { error } = await (supabase as any)
          .from('user_progress')
          .upsert({
            user_id: user.uid,
            date: date,
            action_id: actionId,
            completed: true
          }, {
            onConflict: 'user_id,date,action_id'
          });

        if (error) {
          console.error('Error saving progress:', error);
          toast({
            title: "Error saving progress",
            description: "Could not save your progress.",
            variant: "destructive",
          });
          // Revert optimistic update
          setProgress(prev => 
            prev.map(day => 
              day.date === date 
                ? {
                    ...day,
                    completed: {
                      ...day.completed,
                      [actionId]: currentState
                    }
                  }
                : day
            )
          );
          return;
        }
      } else {
        // Delete completion
        const { error } = await (supabase as any)
          .from('user_progress')
          .delete()
          .eq('user_id', user.uid)
          .eq('date', date)
          .eq('action_id', actionId);

        if (error) {
          console.error('Error removing progress:', error);
          toast({
            title: "Error updating progress",
            description: "Could not update your progress.",
            variant: "destructive",
          });
          // Revert optimistic update
          setProgress(prev => 
            prev.map(day => 
              day.date === date 
                ? {
                    ...day,
                    completed: {
                      ...day.completed,
                      [actionId]: currentState
                    }
                  }
                : day
            )
          );
          return;
        }
      }

      // Show celebration if this completes all tasks for the day
      const dayProgress = progress.find(day => day.date === date);
      if (dayProgress && newState) {
        const completedCount = Object.values({
          ...dayProgress.completed,
          [actionId]: newState
        }).filter(Boolean).length;
        
        if (completedCount === commitments.length) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  const getStreakCount = () => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (const day of progress) {
      if (day.date > today) continue;
      
      const dayCompleted = commitments.every(commitment => 
        day.completed[commitment.actionId]
      );
      
      if (dayCompleted) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getTotalCompletionRate = () => {
    const totalPossible = progress.length * commitments.length;
    const totalCompleted = progress.reduce((sum, day) => 
      sum + Object.values(day.completed).filter(Boolean).length, 0
    );
    
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  };

  const getCommittedActions = () => {
    return protocol.actions.filter(action => 
      commitments.some(commitment => commitment.actionId === action.id)
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) return 'Today';
    if (dateString === tomorrow.toISOString().split('T')[0]) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const committedActions = getCommittedActions();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 text-center animate-scale-in shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Amazing!</h3>
            <p className="text-gray-600">You completed all your actions today!</p>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
          <div className="text-sm text-gray-500">Step 4 of 4</div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Track Your Progress</h2>
          <p className="text-lg text-gray-600">Check off your actions each day and build momentum!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Flame className="w-8 h-8 text-orange-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{getStreakCount()}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <Target className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{getTotalCompletionRate()}%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-800 mb-1">{committedActions.length}</div>
            <div className="text-sm text-gray-600">Active Habits</div>
          </div>
        </div>

        {/* Progress Calendar */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <Calendar className="w-6 h-6 mr-3" />
            Weekly Progress
          </h3>
          
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header with dates */}
              <div className="grid grid-cols-8 gap-4 mb-4">
                <div className="font-medium text-gray-700"></div>
                {progress.map((day) => (
                  <div key={day.date} className="text-center">
                    <div className="text-sm font-medium text-gray-700">
                      {formatDate(day.date)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(day.date).getDate()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action rows */}
              {committedActions.map((action) => (
                <div key={action.id} className="grid grid-cols-8 gap-4 py-3 border-b border-gray-200 last:border-b-0">
                  <div className="font-medium text-gray-800 text-sm">
                    {action.title}
                  </div>
                  {progress.map((day) => (
                    <div key={`${action.id}-${day.date}`} className="flex justify-center">
                      <button
                        onClick={() => toggleCompletion(day.date, action.id)}
                        className="w-8 h-8 rounded-full transition-all hover:scale-110"
                      >
                        {day.completed[action.id] ? (
                          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        ) : (
                          <Circle className="w-8 h-8 text-gray-300 hover:text-emerald-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commitment Reminder */}
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Your Commitment</h3>
          </div>
          <div className="bg-white/20 rounded-xl p-4">
            <p>{commitments[0]?.description}</p>
            <p className="text-sm opacity-90 mt-2">
              Target date: {new Date(commitments[0]?.targetDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Motivation Messages */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">💪 Keep Going!</h4>
          {getStreakCount() === 0 ? (
            <p className="text-gray-600">Start your first day today! Every journey begins with a single step.</p>
          ) : getStreakCount() < 3 ? (
            <p className="text-gray-600">Great start! The first few days are the hardest. You've got this! 🌟</p>
          ) : getStreakCount() < 7 ? (
            <p className="text-gray-600">You're building momentum! Research shows it takes about 21 days to form a habit. 🚀</p>
          ) : (
            <p className="text-gray-600">Incredible! You're building lasting change. This is how transformation happens! ✨</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
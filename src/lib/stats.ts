export interface StatsResponse {
  summary: {
    totalHabits: number;
    habitCompletionRate: number;
    activeObjectives: number;
    avgOkrProgress: number;
    contentCompleted: number;
    contentTotal: number;
    tasksCompleted: number;
    tasksTotal: number;
    totalIdeas: number;
  };
  habits: {
    completionOverTime: { date: string; rate: number }[];
    streaks: {
      habitId: string;
      title: string;
      icon: string;
      current: number;
      longest: number;
    }[];
    habitPerformance: { habitId: string; title: string; rate: number }[];
    weeklyPattern: { day: string; avgCompletions: number }[];
  };
  okr: {
    objectives: {
      id: string;
      title: string;
      progress: number;
      status: string;
      deadline: string;
    }[];
    statusBreakdown: { status: string; count: number }[];
  };
  content: {
    byStatus: { status: string; count: number }[];
    byType: { type: string; count: number }[];
    completedOverTime: { month: string; count: number }[];
  };
  projects: {
    tasksByStatus: { status: string; count: number }[];
    projectsByStatus: { status: string; count: number }[];
    taskVelocity: { week: string; completed: number }[];
  };
  activity: {
    dailyActivity: { date: string; count: number }[];
  };
}

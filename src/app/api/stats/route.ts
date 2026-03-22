import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { calcOkrProgress } from "@/lib/utils";
import { format, subDays, startOfWeek, getDay } from "date-fns";
import type { StatsResponse } from "@/lib/stats";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function computeStreaks(logs: { date: string; completed: boolean }[]) {
  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );
  if (completedDates.size === 0) return { current: 0, longest: 0 };

  const sorted = [...completedDates].sort().reverse();
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

  // Current streak: consecutive days ending at today or yesterday
  let current = 0;
  let checkDate = sorted[0] === todayStr || sorted[0] === yesterdayStr ? new Date(sorted[0]) : null;
  if (checkDate) {
    for (const dateStr of sorted) {
      const expected = format(checkDate, "yyyy-MM-dd");
      if (dateStr === expected) {
        current++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
  }

  // Longest streak
  const ascending = [...completedDates].sort();
  let longest = 0;
  let streak = 1;
  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1]);
    const curr = new Date(ascending[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      longest = Math.max(longest, streak);
      streak = 1;
    }
  }
  longest = Math.max(longest, streak);

  return { current, longest };
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const days = Math.min(
    Math.max(parseInt(req.nextUrl.searchParams.get("days") ?? "30"), 7),
    90
  );
  const startDate = subDays(new Date(), days - 1);
  const startDateStr = format(startDate, "yyyy-MM-dd");
  const todayStr = format(new Date(), "yyyy-MM-dd");

  try {
    const [habits, objectives, contentItems, projects, ideas, allHabitLogs] =
      await Promise.all([
        prisma.habit.findMany({
          where: { userId: user.id, isActive: true },
          include: {
            logs: { where: { date: { gte: startDateStr } } },
          },
        }),
        prisma.objective.findMany({
          where: { userId: user.id },
          include: {
            keyResults: { include: { checkIns: true } },
          },
        }),
        prisma.contentItem.findMany({ where: { userId: user.id } }),
        prisma.project.findMany({
          where: { userId: user.id },
          include: {
            milestones: { include: { tasks: true } },
          },
        }),
        prisma.idea.findMany({ where: { userId: user.id } }),
        // All habit logs (no date filter) for accurate streak calculation
        prisma.habitLog.findMany({
          where: { habit: { userId: user.id, isActive: true } },
          select: { habitId: true, date: true, completed: true },
        }),
      ]);

    // --- HABITS ---
    const allTasks = projects.flatMap((p) =>
      p.milestones.flatMap((m) => m.tasks)
    );

    // Completion over time
    const completionOverTime: StatsResponse["habits"]["completionOverTime"] =
      [];
    for (let i = days - 1; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      const totalHabits = habits.length;
      if (totalHabits === 0) {
        completionOverTime.push({ date: dateStr, rate: 0 });
        continue;
      }
      const completedCount = habits.filter((h) =>
        h.logs.some((l) => l.date === dateStr && l.completed)
      ).length;
      completionOverTime.push({
        date: dateStr,
        rate: Math.round((completedCount / totalHabits) * 100),
      });
    }

    // Streaks — use allHabitLogs (no date filter) for accurate calculation
    const logsByHabitId = new Map<
      string,
      { date: string; completed: boolean }[]
    >();
    for (const log of allHabitLogs) {
      const arr = logsByHabitId.get(log.habitId) ?? [];
      arr.push({ date: log.date, completed: log.completed });
      logsByHabitId.set(log.habitId, arr);
    }

    const streaks = habits.map((h) => {
      const { current, longest } = computeStreaks(
        logsByHabitId.get(h.id) ?? []
      );
      return {
        habitId: h.id,
        title: h.title,
        icon: h.icon ?? "✓",
        current,
        longest,
      };
    });

    // Habit performance
    const habitPerformance = habits.map((h) => {
      const completed = h.logs.filter((l) => l.completed).length;
      return {
        habitId: h.id,
        title: h.title,
        rate: days > 0 ? Math.round((completed / days) * 100) : 0,
      };
    });
    habitPerformance.sort((a, b) => b.rate - a.rate);

    // Weekly pattern
    const dayCounts: Record<number, number[]> = {};
    for (let d = 0; d < 7; d++) dayCounts[d] = [];

    const weeksInRange = Math.ceil(days / 7);
    for (let d = 0; d < 7; d++) {
      dayCounts[d] = new Array(weeksInRange).fill(0);
    }

    for (const h of habits) {
      for (const log of h.logs) {
        if (log.completed) {
          const dow = getDay(new Date(log.date));
          const daysSinceStart = Math.floor(
            (new Date(log.date).getTime() - startDate.getTime()) /
              (1000 * 60 * 60 * 24)
          );
          const weekIdx = Math.floor(daysSinceStart / 7);
          if (weekIdx >= 0 && weekIdx < weeksInRange) {
            dayCounts[dow][weekIdx]++;
          }
        }
      }
    }

    const weeklyPattern = DAY_NAMES.map((day, i) => {
      const counts = dayCounts[i];
      const avg =
        counts.length > 0
          ? Math.round(
              (counts.reduce((s, c) => s + c, 0) / counts.length) * 10
            ) / 10
          : 0;
      return { day, avgCompletions: avg };
    });

    // --- OKR ---
    const activeObjectives = objectives.filter((o) => o.status === "active");
    const okrObjectives = objectives.map((o) => ({
      id: o.id,
      title: o.title,
      progress: calcOkrProgress(
        o.keyResults.map((kr) => ({
          currentValue: kr.currentValue,
          targetValue: kr.targetValue,
          weight: kr.weight,
        }))
      ),
      status: o.status,
      deadline: format(o.deadline, "yyyy-MM-dd"),
    }));

    const statusBreakdownMap: Record<string, number> = {};
    for (const o of objectives) {
      statusBreakdownMap[o.status] = (statusBreakdownMap[o.status] ?? 0) + 1;
    }
    const statusBreakdown = Object.entries(statusBreakdownMap).map(
      ([status, count]) => ({ status, count })
    );

    const avgOkrProgress =
      activeObjectives.length > 0
        ? Math.round(
            okrObjectives
              .filter((o) => o.status === "active")
              .reduce((s, o) => s + o.progress, 0) / activeObjectives.length
          )
        : 0;

    // --- CONTENT ---
    const contentByStatus: Record<string, number> = {};
    const contentByType: Record<string, number> = {};
    for (const c of contentItems) {
      contentByStatus[c.status] = (contentByStatus[c.status] ?? 0) + 1;
      contentByType[c.type] = (contentByType[c.type] ?? 0) + 1;
    }

    const completedContent = contentItems.filter(
      (c) => c.completedAt && c.completedAt >= startDate
    );
    const completedByMonth: Record<string, number> = {};
    for (const c of completedContent) {
      const month = format(c.completedAt!, "yyyy-MM");
      completedByMonth[month] = (completedByMonth[month] ?? 0) + 1;
    }

    // --- PROJECTS ---
    const tasksByStatusMap: Record<string, number> = {};
    for (const t of allTasks) {
      tasksByStatusMap[t.status] = (tasksByStatusMap[t.status] ?? 0) + 1;
    }

    const projectsByStatusMap: Record<string, number> = {};
    for (const p of projects) {
      projectsByStatusMap[p.status] =
        (projectsByStatusMap[p.status] ?? 0) + 1;
    }

    // Task velocity: tasks completed per week
    const completedTasks = allTasks.filter(
      (t) => t.completedAt && t.completedAt >= startDate
    );
    const velocityMap: Record<string, number> = {};
    for (const t of completedTasks) {
      const weekStart = format(
        startOfWeek(t.completedAt!, { weekStartsOn: 1 }),
        "MM/dd"
      );
      velocityMap[weekStart] = (velocityMap[weekStart] ?? 0) + 1;
    }
    const taskVelocity = Object.entries(velocityMap)
      .map(([week, completed]) => ({ week, completed }))
      .sort((a, b) => a.week.localeCompare(b.week));

    // --- ACTIVITY (overview) ---
    const activityMap: Record<string, number> = {};
    // Habit logs
    for (const h of habits) {
      for (const l of h.logs) {
        if (l.completed) {
          activityMap[l.date] = (activityMap[l.date] ?? 0) + 1;
        }
      }
    }
    // Check-ins
    for (const o of objectives) {
      for (const kr of o.keyResults) {
        for (const ci of kr.checkIns) {
          const d = format(ci.date, "yyyy-MM-dd");
          if (d >= startDateStr) {
            activityMap[d] = (activityMap[d] ?? 0) + 1;
          }
        }
      }
    }
    // Task completions
    for (const t of allTasks) {
      if (t.completedAt && t.completedAt >= startDate) {
        const d = format(t.completedAt, "yyyy-MM-dd");
        activityMap[d] = (activityMap[d] ?? 0) + 1;
      }
    }

    const dailyActivity: StatsResponse["activity"]["dailyActivity"] = [];
    for (let i = days - 1; i >= 0; i--) {
      const dateStr = format(subDays(new Date(), i), "yyyy-MM-dd");
      dailyActivity.push({ date: dateStr, count: activityMap[dateStr] ?? 0 });
    }

    // --- SUMMARY ---
    const todayCompletedHabits = habits.filter((h) =>
      h.logs.some((l) => l.date === todayStr && l.completed)
    ).length;

    const response: StatsResponse = {
      summary: {
        totalHabits: habits.length,
        habitCompletionRate:
          habits.length > 0
            ? Math.round((todayCompletedHabits / habits.length) * 100)
            : 0,
        activeObjectives: activeObjectives.length,
        avgOkrProgress,
        contentCompleted: contentItems.filter((c) => c.status === "completed")
          .length,
        contentTotal: contentItems.length,
        tasksCompleted: allTasks.filter((t) => t.status === "done").length,
        tasksTotal: allTasks.length,
        totalIdeas: ideas.length,
      },
      habits: {
        completionOverTime,
        streaks,
        habitPerformance,
        weeklyPattern,
      },
      okr: {
        objectives: okrObjectives,
        statusBreakdown,
      },
      content: {
        byStatus: Object.entries(contentByStatus).map(([status, count]) => ({
          status,
          count,
        })),
        byType: Object.entries(contentByType).map(([type, count]) => ({
          type,
          count,
        })),
        completedOverTime: Object.entries(completedByMonth)
          .map(([month, count]) => ({ month, count }))
          .sort((a, b) => a.month.localeCompare(b.month)),
      },
      projects: {
        tasksByStatus: Object.entries(tasksByStatusMap).map(
          ([status, count]) => ({ status, count })
        ),
        projectsByStatus: Object.entries(projectsByStatusMap).map(
          ([status, count]) => ({ status, count })
        ),
        taskVelocity,
      },
      activity: {
        dailyActivity,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

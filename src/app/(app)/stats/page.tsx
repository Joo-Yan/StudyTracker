"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsSummaryCards } from "@/components/stats/stats-summary-cards";
import { StatsDateRangeSelect } from "@/components/stats/stats-date-range-select";
import { HabitsStats } from "@/components/stats/habits-stats";
import { OkrStats } from "@/components/stats/okr-stats";
import { ContentStats } from "@/components/stats/content-stats";
import { ProjectsStats } from "@/components/stats/projects-stats";
import { OverviewStats } from "@/components/stats/overview-stats";
import type { StatsResponse } from "@/lib/stats";

export default function StatsPage() {
  const [days, setDays] = useState(30);
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/stats?days=${days}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch stats");
        return r.json();
      })
      .then((d) => setData(d))
      .catch((err) => {
        console.error(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stats & Analytics</h1>
        <StatsDateRangeSelect value={days} onChange={setDays} />
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      ) : data ? (
        <>
          <StatsSummaryCards summary={data.summary} />

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="okr">OKR</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewStats data={data.activity} />
            </TabsContent>

            <TabsContent value="habits">
              <HabitsStats data={data.habits} />
            </TabsContent>

            <TabsContent value="okr">
              <OkrStats data={data.okr} />
            </TabsContent>

            <TabsContent value="content">
              <ContentStats data={data.content} />
            </TabsContent>

            <TabsContent value="projects">
              <ProjectsStats data={data.projects} />
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <p className="text-muted-foreground">Failed to load stats.</p>
      )}
    </div>
  );
}

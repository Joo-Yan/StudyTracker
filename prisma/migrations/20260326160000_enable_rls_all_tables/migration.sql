-- ============================================================
-- Section A: User-owned tables — ENABLE RLS + CRUD policies
-- ============================================================

-- Habit
ALTER TABLE public."Habit" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Habit" FORCE ROW LEVEL SECURITY;

CREATE POLICY "habit_select_own" ON public."Habit"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "habit_insert_own" ON public."Habit"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "habit_update_own" ON public."Habit"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "habit_delete_own" ON public."Habit"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- Objective
ALTER TABLE public."Objective" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Objective" FORCE ROW LEVEL SECURITY;

CREATE POLICY "objective_select_own" ON public."Objective"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "objective_insert_own" ON public."Objective"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "objective_update_own" ON public."Objective"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "objective_delete_own" ON public."Objective"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- OKRTask
ALTER TABLE public."OKRTask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OKRTask" FORCE ROW LEVEL SECURITY;

CREATE POLICY "okrtask_select_own" ON public."OKRTask"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "okrtask_insert_own" ON public."OKRTask"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "okrtask_update_own" ON public."OKRTask"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "okrtask_delete_own" ON public."OKRTask"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- Project
ALTER TABLE public."Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Project" FORCE ROW LEVEL SECURITY;

CREATE POLICY "project_select_own" ON public."Project"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "project_insert_own" ON public."Project"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "project_update_own" ON public."Project"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "project_delete_own" ON public."Project"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- ContentItem
ALTER TABLE public."ContentItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ContentItem" FORCE ROW LEVEL SECURITY;

CREATE POLICY "contentitem_select_own" ON public."ContentItem"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "contentitem_insert_own" ON public."ContentItem"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "contentitem_update_own" ON public."ContentItem"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "contentitem_delete_own" ON public."ContentItem"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- Idea
ALTER TABLE public."Idea" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Idea" FORCE ROW LEVEL SECURITY;

CREATE POLICY "idea_select_own" ON public."Idea"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "idea_insert_own" ON public."Idea"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "idea_update_own" ON public."Idea"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "idea_delete_own" ON public."Idea"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- LifeCompass
ALTER TABLE public."LifeCompass" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LifeCompass" FORCE ROW LEVEL SECURITY;

CREATE POLICY "lifecompass_select_own" ON public."LifeCompass"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "lifecompass_insert_own" ON public."LifeCompass"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "lifecompass_update_own" ON public."LifeCompass"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "lifecompass_delete_own" ON public."LifeCompass"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- Todo
ALTER TABLE public."Todo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Todo" FORCE ROW LEVEL SECURITY;

CREATE POLICY "todo_select_own" ON public."Todo"
  FOR SELECT TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "todo_insert_own" ON public."Todo"
  FOR INSERT TO authenticated
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "todo_update_own" ON public."Todo"
  FOR UPDATE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text))
  WITH CHECK ("userId" = (SELECT auth.uid()::text));

CREATE POLICY "todo_delete_own" ON public."Todo"
  FOR DELETE TO authenticated
  USING ("userId" = (SELECT auth.uid()::text));

-- ============================================================
-- Section B: Child tables — ENABLE RLS with no policies
--            (blocks all PostgREST access; Prisma unaffected)
-- ============================================================

ALTER TABLE public."HabitLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."HabitLog" FORCE ROW LEVEL SECURITY;

ALTER TABLE public."KeyResult" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."KeyResult" FORCE ROW LEVEL SECURITY;

ALTER TABLE public."CheckIn" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."CheckIn" FORCE ROW LEVEL SECURITY;

ALTER TABLE public."Milestone" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Milestone" FORCE ROW LEVEL SECURITY;

ALTER TABLE public."Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Task" FORCE ROW LEVEL SECURITY;

ALTER TABLE public."ProjectLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ProjectLog" FORCE ROW LEVEL SECURITY;

-- ============================================================
-- Section C: OKRTask userId index (matches schema.prisma)
-- ============================================================

CREATE INDEX IF NOT EXISTS "OKRTask_userId_idx" ON public."OKRTask"("userId");

-- ============================================================
-- Section D: Lock down _prisma_migrations from client roles
-- ============================================================

REVOKE ALL ON TABLE public."_prisma_migrations" FROM anon;
REVOKE ALL ON TABLE public."_prisma_migrations" FROM authenticated;

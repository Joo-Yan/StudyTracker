-- CreateTable
CREATE TABLE "OKRTask" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "objectiveId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'todo',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OKRTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OKRTask" ADD CONSTRAINT "OKRTask_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "Objective"("id") ON DELETE CASCADE ON UPDATE CASCADE;

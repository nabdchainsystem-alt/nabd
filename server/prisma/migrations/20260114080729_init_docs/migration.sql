/*
  Warnings:

  - You are about to drop the `Thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Thread";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DocPage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "icon" TEXT,
    "coverImage" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "roomId" TEXT,
    "boardId" TEXT,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DocPage_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DocPage" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "boardId" TEXT,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Activity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Activity_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Activity" ("content", "createdAt", "id", "metadata", "type", "userId") SELECT "content", "createdAt", "id", "metadata", "type", "userId" FROM "Activity";
DROP TABLE "Activity";
ALTER TABLE "new_Activity" RENAME TO "Activity";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

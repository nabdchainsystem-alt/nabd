/*
  Warnings:

  - You are about to drop the column `data` on the `Row` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Board` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `EmailAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ProcurementRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RFQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Board" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "availableViews" TEXT,
    "pinnedViews" TEXT,
    "columns" TEXT,
    "defaultView" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Board_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Board" ("availableViews", "columns", "createdAt", "defaultView", "description", "id", "name", "pinnedViews", "updatedAt") SELECT "availableViews", "columns", "createdAt", "defaultView", "description", "id", "name", "pinnedViews", "updatedAt" FROM "Board";
DROP TABLE "Board";
ALTER TABLE "new_Board" RENAME TO "Board";
CREATE TABLE "new_EmailAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "tokenExpiry" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "EmailAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_EmailAccount" ("accessToken", "createdAt", "email", "id", "provider", "refreshToken", "tokenExpiry", "updatedAt") SELECT "accessToken", "createdAt", "email", "id", "provider", "refreshToken", "tokenExpiry", "updatedAt" FROM "EmailAccount";
DROP TABLE "EmailAccount";
ALTER TABLE "new_EmailAccount" RENAME TO "EmailAccount";
CREATE TABLE "new_Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rfqId" TEXT,
    "requestId" TEXT,
    "supplier" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "warehouse" TEXT,
    "date" TEXT NOT NULL,
    "dueDate" TEXT,
    "totalValue" REAL NOT NULL,
    "priority" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "approvals" TEXT,
    "relatedTo" TEXT,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Order_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "RFQ" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("approvals", "date", "department", "dueDate", "id", "priority", "relatedTo", "requestId", "rfqId", "status", "supplier", "totalValue", "warehouse") SELECT "approvals", "date", "department", "dueDate", "id", "priority", "relatedTo", "requestId", "rfqId", "status", "supplier", "totalValue", "warehouse" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_ProcurementRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "warehouse" TEXT,
    "relatedTo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "priority" TEXT NOT NULL DEFAULT 'Normal',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "approvalStatus" TEXT NOT NULL DEFAULT 'Pending',
    "rfqSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcurementRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ProcurementRequest" ("approvalStatus", "createdAt", "date", "department", "id", "isUrgent", "name", "priority", "relatedTo", "rfqSent", "status", "updatedAt", "warehouse") SELECT "approvalStatus", "createdAt", "date", "department", "id", "isUrgent", "name", "priority", "relatedTo", "rfqSent", "status", "updatedAt", "warehouse" FROM "ProcurementRequest";
DROP TABLE "ProcurementRequest";
ALTER TABLE "new_ProcurementRequest" RENAME TO "ProcurementRequest";
CREATE TABLE "new_RFQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "requestId" TEXT,
    "date" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "warehouse" TEXT,
    "supplier" TEXT NOT NULL,
    "value" REAL NOT NULL DEFAULT 0,
    "dueDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Open',
    "createdDate" TEXT NOT NULL,
    "relatedTo" TEXT,
    "sentToOrder" BOOLEAN NOT NULL DEFAULT false,
    "orderId" TEXT,
    "unitPrice" REAL,
    "quantity" REAL,
    "vatAmount" REAL,
    "totalExVat" REAL,
    CONSTRAINT "RFQ_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RFQ_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ProcurementRequest" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_RFQ" ("createdDate", "date", "department", "dueDate", "id", "orderId", "quantity", "relatedTo", "requestId", "sentToOrder", "status", "supplier", "totalExVat", "unitPrice", "value", "vatAmount", "warehouse") SELECT "createdDate", "date", "department", "dueDate", "id", "orderId", "quantity", "relatedTo", "requestId", "sentToOrder", "status", "supplier", "totalExVat", "unitPrice", "value", "vatAmount", "warehouse" FROM "RFQ";
DROP TABLE "RFQ";
ALTER TABLE "new_RFQ" RENAME TO "RFQ";
CREATE TABLE "new_Room" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'table',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Room" ("createdAt", "id", "name", "type", "updatedAt") SELECT "createdAt", "id", "name", "type", "updatedAt" FROM "Room";
DROP TABLE "Room";
ALTER TABLE "new_Room" RENAME TO "Room";
CREATE TABLE "new_Row" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roomId" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT "Row_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Row" ("content", "id", "roomId") SELECT "content", "id", "roomId" FROM "Row";
DROP TABLE "Row";
ALTER TABLE "new_Row" RENAME TO "Row";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

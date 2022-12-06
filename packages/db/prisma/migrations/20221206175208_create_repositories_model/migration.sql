-- CreateTable
CREATE TABLE "Repositories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Repositories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RepositoriesToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Repositories_id_key" ON "Repositories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_RepositoriesToUser_AB_unique" ON "_RepositoriesToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RepositoriesToUser_B_index" ON "_RepositoriesToUser"("B");

-- AddForeignKey
ALTER TABLE "_RepositoriesToUser" ADD CONSTRAINT "_RepositoriesToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Repositories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RepositoriesToUser" ADD CONSTRAINT "_RepositoriesToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

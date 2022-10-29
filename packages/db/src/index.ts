import { PrismaClient } from "@prisma/client";

export function getClient({ dev }: { dev?: boolean }) {
  return new PrismaClient({
    errorFormat: "pretty",
    log: dev === true ? ["error", "info", "query", "warn"] : ["error", "info"],
  });
}

export * from "@prisma/client";

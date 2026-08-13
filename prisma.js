// This file makes sure we only ever create ONE database connection,
// even though Next.js reloads code a lot during development.
//
// - On your laptop (no TURSO_DATABASE_URL set): uses the local dev.db file.
// - When deployed (TURSO_DATABASE_URL set in Vercel): uses your cloud Turso
//   database instead, so your phone and PC share the same data.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

function createPrismaClient() {
  if (process.env.TURSO_DATABASE_URL) {
    // Lazily require these so local dev (which doesn't have them installed
    // as "used") still works fine without extra setup.
    const { PrismaLibSQL } = require("@prisma/adapter-libsql");
    const { createClient } = require("@libsql/client");

    const libsql = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({ adapter, log: ["error", "warn"] });
  }

  return new PrismaClient({ log: ["error", "warn"] });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

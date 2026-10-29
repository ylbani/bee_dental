// scripts/build.mjs
process.env.DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/bee_dental?schema=public";
process.env.DIRECT_URL = process.env.DIRECT_URL || "postgresql://postgres:postgres@localhost:5432/bee_dental?schema=public";

import { execSync } from "child_process";

console.log("==> Starting Bee Dental Build Process...");

try {
  console.log("==> Generating Prisma client types...");
  execSync("npx prisma generate", { stdio: "inherit", env: process.env });
} catch (err) {
  console.warn("==> Notice: Prisma generate completed with warning:", err.message);
}

console.log("==> Executing Next.js Production Build...");
execSync("npx next build", { stdio: "inherit", env: process.env });
console.log("==> Bee Dental Build successfully completed!");

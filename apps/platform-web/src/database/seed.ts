/* eslint-disable @typescript-eslint/no-explicit-any */
import { hashPassword } from "@/lib/auth/password";
import { users } from "./schema";
// mport dotenv
import dotenv from "dotenv";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
dotenv.config();

type SeedUser = {
  email: string;
  name: string;
  role: "ADMIN" | "MENTOR" | "ENTREPRENEUR";
  rawPassword: string;
};

const seedUsers: SeedUser[] = [
  {
    email: "admin@mentor.inc",
    name: "Admin User",
    role: "ADMIN",
    rawPassword: "admin123",
  },
  {
    email: "mentor1@mentor.inc",
    name: "Jane Mentor",
    role: "MENTOR",
    rawPassword: "mentor123",
  },
  {
    email: "mentor2@mentor.inc",
    name: "John Mentor",
    role: "MENTOR",
    rawPassword: "mentor123",
  },
  {
    email: "entrepreneur1@mentor.inc",
    name: "Alice Entrepreneur",
    role: "ENTREPRENEUR",
    rawPassword: "entrepreneur123",
  },
  {
    email: "entrepreneur2@mentor.inc",
    name: "Bob Entrepreneur",
    role: "ENTREPRENEUR",
    rawPassword: "entrepreneur123",
  },
];

/**
 * Upsert a single user record. On conflict of email, updates name+password+role.
 */
async function upsertUser(
  tx: any,
  user: Omit<SeedUser, "rawPassword"> & { password: string }
) {
  await tx
    .insert(users)
    .values(user)
    .onConflictDoUpdate({
      target: users.email,
      set: {
        name: user.name,
        password: user.password,
        role: user.role,
      },
    });
}

async function main() {
  console.log("🌱 Starting database seed...");

  console.log(process.env.DATABASE_URL);
  const client = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const db = drizzle(client);

  // Hash all passwords in parallel
  const usersWithHashed = await Promise.all(
    seedUsers.map(async ({ rawPassword, ...u }) => ({
      ...u,
      password: await hashPassword(rawPassword),
    }))
  );

  console.log("🔐 Passwords hashed successfully!");

  // Wrap all upserts in one transaction
  await db.transaction(async (tx) => {
    console.log("🔄 Upserting users...");
    for (const user of usersWithHashed) {
      await upsertUser(tx, user);
      console.log(`✅ Upserted ${user.role.toLowerCase()} ${user.email}`);
    }
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((err) => {
    console.error("❌ Error during seed:", err);
    process.exit(1);
  })
  .finally(async () => {
    console.log("🔚 Closing database connection...");
  });

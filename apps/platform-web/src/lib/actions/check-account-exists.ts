"use server";

import { db } from "@/database/db";
import z from "../zod";
import { emailSchema } from "../zod/schemas/auth";
import { throwIfAuthenticated } from "./auth/throw-if-authenticated";
import { actionClient } from "./safe-action";

const schema = z.object({
  email: emailSchema,
});

// Check if account exists
export const checkAccountExistsAction = actionClient
  .schema(schema)
  .use(throwIfAuthenticated)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;


    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });

    return {
      accountExists: !!user,
      hasPassword: !!user?.password,
    };
  });

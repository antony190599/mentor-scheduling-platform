/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/database/db";
import { eq } from "drizzle-orm";
import { accounts, sessions, users, verificationTokens } from "@/database/schema";
import { validatePassword } from "./password";

const VERCEL_DEPLOYMENT = !!process.env.VERCEL_URL;


export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            allowDangerousEmailAccountLinking: true,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Mentor.inc",
            type: "credentials",
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    throw new Error("no-credentials");
                }


                const { email, password } = credentials;

                if (!email || !password) {
                    throw new Error("no-credentials");
                }

                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                if (!user || !user.password) {
                    throw new Error("invalid-credentials");
                }

                const passwordMatch = await validatePassword({
                    password,
                    passwordHash: user.password,
                });

                if (!passwordMatch) {
                    throw new Error("invalid-credentials");
                }

                await db.update(users)
                    .set({
                        invalidLoginAttempts: 0,
                    })
                    .where(eq(users.id, user.id));

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            },

        })
    ],
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts as any,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    },
    cookies: {
        sessionToken: {
          name: `${VERCEL_DEPLOYMENT ? "__Secure-" : ""}next-auth.session-token`,
          options: {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            // When working on localhost, the cookie domain must be omitted entirely (https://stackoverflow.com/a/1188145)
            domain: VERCEL_DEPLOYMENT
              ? `.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
              : undefined,
            secure: VERCEL_DEPLOYMENT,
          },
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        signIn: async ({ user, account, profile }) => {
            console.log("signIn callback", { user, account, profile });

            if (user?.lockedAt) {
                return false;
            }

            if (account?.provider === "google") {
                // If the user is signing in with Google, we can check if they already exist
                const userExists = await db.query.users.findFirst({
                    where: eq(users.email, user.email as string),
                });

                if (!userExists || !profile) {
                    return true;
                }

                if (userExists && profile) {
                    const profilePic =
                        (profile as Record<string, unknown>)[account.provider === "google" ? "picture" : "avatar_url"];
                    let newAvatar: string | null = null;

                    newAvatar = typeof profilePic === "string" ? profilePic : null;


                    await db.update(users)
                        .set({
                            name: user.name || userExists.name,
                            image: newAvatar || userExists.image || null,
                        })
                        .where(eq(users.id, userExists.id));


                    return true;
                }
            }
            return true;
        },
        async jwt({ token, user, trigger }) {
            if (user) {
                token.user = user;
            }

            if (trigger === "update") {

                const refreshedUser = await db.query.users.findFirst({
                where: eq(users.id, token.sub as string),
                columns: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                }});
        
                if (refreshedUser) {
                  token.user = refreshedUser;
                } else {
                  return {};
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.sub,
                // @ts-expect-error - TypeScript doesn't know about the user object on the token
                ...(token || session).user,
              };
              return session;
        },    
    },
    events: {
        async signIn(message) {
            const eamil = message.user?.email || "";
            //   });

            const user = await db.query.users.findFirst({
                where: eq(users.email, eamil),
                columns: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                    createdAt: true,
                }
            });

            if (!user) {
                console.log(
                  `User ${message.user.email} not found, skipping welcome workflow...`,
                );
                return;
              }
        }
    }


}
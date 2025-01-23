import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import Credentials from "next-auth/providers/credentials";

const neon = new Pool({
  connectionString: process.env.AUTH_POSTGRES_URL,
});
const adapter = new PrismaNeon(neon);
const prisma = new PrismaClient({ adapter });
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: "support@sahaaai.com",
    }),
    Google,
    Github,
    Credentials({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials, req) {
        const userCredentials = {
          email: credentials.email,
          password: credentials.password,
        };

        const res = await fetch(`${process.env.AUTH_URL}/api/user/signin`, {
          method: "POST",
          body: JSON.stringify(userCredentials),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const user = await res.json();

        if (res.ok && user) {
          console.log("the user is :", user);
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      console.log("A new user has been created:", user);
      if (!user.id) {
        throw new Error("User ID is undefined.");
      }
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
      // Add default credit
      await prisma.credit.create({
        data: {
          userId: user.id as string,
          amount: 2000,
          expiresAt: oneMonthFromNow, //1 month expiry
        },
      });

      // Add default subscription
      await prisma.subscription.create({
        data: {
          userId: user.id as string,
          tier: "basic",
          active: true,
          expiresAt: oneMonthFromNow, //1 month expiry
        },
      });
    },
  },
});

import NextAuth from "next-auth"
import Resend from "next-auth/providers/resend"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaNeon } from "@prisma/adapter-neon"
import { Pool } from "@neondatabase/serverless"
import Credentials from "next-auth/providers/credentials"

const neon = new Pool({
    connectionString: process.env.AUTH_POSTGRES_PRISMA_URL,
})
const adapter = new PrismaNeon(neon)
const prisma = new PrismaClient({ adapter })
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Resend, Google, Github, Credentials({
        id: "credentials",
        name: "Credentials",
        async authorize(credentials, req) {
            const userCredentials = {
                email: credentials.email,
                password: credentials.password,
            };

            const res = await fetch(
                `${process.env.AUTH_URL}/api/user/signin`,
                {
                    method: "POST",
                    body: JSON.stringify(userCredentials),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const user = await res.json();

            if (res.ok && user) {
                return user;
            } else {
                return null;
            }
        },
    })],
})
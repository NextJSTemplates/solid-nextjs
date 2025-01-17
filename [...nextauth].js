/*import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";
import GoogleProvider from "next-auth/providers/google";

const options = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      async authorize(credentials, req) {
        const userCredentials = {
          email: credentials.email,
          password: credentials.password,
        };

        const res = await fetch(
          `/api/user/signin`,
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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],

  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },


  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
    encryption: true,
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
    error: '/auth/signin',
  },

  callbacks: {
    async session(session, user, token) {
      if (user !== null) {

        session.user = user;
      }
      return await session;
    },

    async jwt({ token, user }) {
      return await token;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
*/
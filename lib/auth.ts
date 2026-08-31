import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./db";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
    CredentialsProvider({
      name: "Demo",
      credentials: { email: { label: "Email", type: "email" } },
      async authorize(creds) {
        const user = await prisma.user.findUnique({ where: { email: creds?.email } });
        return user? { id: user.id, email: user.email, role: user.role } : null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if(token) (session.user as any).role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if(user) (token as any).role = (user as any).role;
      return token;
    }
  }
}
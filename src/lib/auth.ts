import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verify } from "jsonwebtoken";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        impersonationToken: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (credentials?.impersonationToken) {
          try {
            const decoded = verify(
              credentials.impersonationToken,
              process.env.NEXTAUTH_SECRET!,
            ) as { email: string; isImpersonation: boolean };

            if (decoded.email && decoded.isImpersonation) {
              const user = await prisma.user.findUnique({
                where: { email: decoded.email },
                include: { profile: true },
              });

              if (user) {
                return {
                  id: user.id,
                  email: user.email,
                  name:
                    user.profile?.businessName ||
                    user.profile?.firstName ||
                    null,
                  planType: user.planType,
                  accountType: user.accountType,
                  role: user.role,
                  currency: user.currency,
                  hasProfile: !!user.profile,
                  createdAt: user.createdAt,
                };
              }
            }
          } catch (error) {
            console.error("Impersonation failed:", error);
          }
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
          include: {
            profile: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const settings = await prisma.systemSettings.findFirst();

        if (settings?.maintenanceMode && user.role !== "ADMIN") {
          throw new Error(
            "System is under maintenance. Please try again later.",
          );
        }

        if (user.isBanned) {
          throw new Error(
            "Your account has been suspended. Please contact support.",
          );
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.profile?.businessName || user.profile?.firstName || null,
          planType: user.planType,
          accountType: user.accountType,
          role: user.role,
          currency: user.currency,
          hasProfile: !!user.profile,
          createdAt: user.createdAt,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.planType = user.planType;
        token.accountType = user.accountType;
        token.role = user.role;
        token.currency = user.currency;
        token.createdAt = user.createdAt;

        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { profile: true },
        });

        token.hasProfile = !!dbUser?.profile;
      }

      if (trigger === "update" && session?.currency) {
        token.currency = session.currency;
      }

      if (trigger === "update") {
        if (session?.currency) {
          token.currency = session.currency;
        }

        const freshUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          include: { profile: true },
        });

        if (freshUser) {
          token.planType = freshUser.planType;
          token.hasProfile = !!freshUser.profile;
        }
      }

      return token;
    },
    async session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.planType = token.planType as string;
        session.user.accountType = token.accountType as string;
        session.user.role = token.role as string;
        session.user.currency = user?.currency || token?.currency || "NGN";
        session.user.hasProfile = token.hasProfile as boolean;
      }
      return session;
    },
  },
};

// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/db";
import Alumni from "@/model/alumni";
import mongoose from "mongoose";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        userId: { label: "User ID", type: "text" },
        email: { label: "Email", type: "email" },
        phone: { label: "Phone", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.userId || !credentials?.email || !credentials?.phone) {
          return null;
        }

        await connectDB();

        // Try to find alumni by userId (as ObjectId or string), email, and phone
        let alumni = null;
        
        // First try with userId as ObjectId
        if (mongoose.Types.ObjectId.isValid(credentials.userId)) {
          alumni = await Alumni.findOne({
            userId: credentials.userId,
            email: credentials.email,
            phone: credentials.phone,
          });
        }

        // If not found, try with userId as string field (if stored separately)
        if (!alumni) {
          alumni = await Alumni.findOne({
            email: credentials.email,
            phone: credentials.phone,
          });
          
          // Check if the userId matches (as string representation)
          if (alumni && alumni._id && alumni._id.toString() !== credentials.userId) {
            alumni = null;
          }
        }

        if (alumni) {
          return {
            id: alumni._id.toString(),
            email: alumni.email,
            name: alumni.name,
            role: "student",
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },

  callbacks: {
    async signIn({ user, account }) {
      // For credentials login, the role is already set in authorize
      if (account?.provider === "credentials") {
        return user.role === "student";
      }

      // For Google login
      await connectDB();

      if (user.email === process.env.ADMIN_EMAIL) {
        user.role = "admin";
        return true;
      }

      const alumni = await Alumni.findOne({ email: user.email });
      if (alumni) {
        user.role = "student";
        return true;
      }

      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

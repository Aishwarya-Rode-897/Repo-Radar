import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { upsertUser, getUser } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback triggered', { user, account, profile });
      
      if (user.email) {
        try {
          console.log('Attempting to upsert user:', { email: user.email, name: user.name });
          const dbUser = await upsertUser({
            email: user.email,
            name: user.name,
            image: user.image,
          });
          console.log('User upserted successfully:', dbUser);
          return true;
        } catch (error) {
          console.error('Error saving user to database:', error);
          return true; // Still allow sign in even if DB save fails
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session?.user?.email) {
        try {
          const dbUser = await getUser(session.user.email);
          if (dbUser) {
            session.user.id = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user data for session:', error);
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user?.email) {
        try {
          const dbUser = await getUser(user.email);
          if (dbUser) {
            token.userId = dbUser.id;
          }
        } catch (error) {
          console.error('Error fetching user data for JWT:', error);
        }
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST }; 
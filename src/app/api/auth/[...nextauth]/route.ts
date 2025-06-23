import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { validateOAuthUser } from "../../../../../utils/auth";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.jwt = token.id_token;
      let userRole = undefined;
      if (token.id_token && session.user) {
        const result = await validateOAuthUser(token.id_token as string);
        console.log("validateOAuthUser result:", JSON.stringify(result));
        if (result.valid && result.data?.user?.userRole) {
          userRole = result.data.user.userRole;
        }
      }
      // Always return a new session object and always set userRole (even if undefined)
      return {
        ...session,
        user: {
          ...session.user,
          userRole: userRole,
        },
      };
    },
  },
});

export { handler as GET, handler as POST };

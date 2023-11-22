import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '../../../../lib/mongodb'

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      profile(profile) {
        let userRole = "user"
        if (profile && profile.email ==="rittahbuyaki@gmail.com") {
          userRole = "admin"
        }

        return {
          ...profile,
          id: profile?.sub,
          role: userRole,
        }
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("JWT Callback - Token:", token)
      // console.log("JWT Callback - User:", user)
      return { ...token, ...user }
    },
    async session({ session, token }) {
      // console.log("Session Callback - Token:", token)
      // console.log("Session Callback - Session:", session)
    
      if (session?.user) session.user.role = token.role
      return session
    }
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }

import NextAuth from "next-auth"
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from '../../../../lib/mongodb'

export const authOptions = {
  providers: [
    GoogleProvider({
      profile(profile) {
        console.log("This is the profile output: ", profile)

        let userRole = "user"
        if (profile && profile.email ==="rittahbuyaki@gmail.com") {
          userRole = "admin"
        }

        const updatedProfile = {
          ...profile,
          id: profile?.sub,
          role: userRole,
        };
      
        console.log("Updated profile output: ", updatedProfile);
      
        return updatedProfile;
      },
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  // callbacks: {
  //   async jwt({ token, user }) {
  //     if (user && token) {
  //       token.role = user.role
  //     }
  //     return token
  //   },
  //   async session({ session, token }) {
  //     if (session?.user) session.user.role = token.role
  //     return session
  //   }
  // },
  adapter: MongoDBAdapter(clientPromise),
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, handler as PUT, handler as DELETE }

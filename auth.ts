import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { syncUser } from "@/lib/user"
import { JWT } from "next-auth/jwt"

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async signIn({ user }) {
            try {
                if (!user.email) {
                    console.error("No email provided by GitHub")
                    return false
                }
                await syncUser(user)
                return true
            } catch (error) {
                console.error("SignIn error:", error)
                return false
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = String(user.id ?? "")
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id ?? "")
            }
            return session
        },
    },
    trustHost: true,
    secret: process.env.NEXTAUTH_SECRET,
})
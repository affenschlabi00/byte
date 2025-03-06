import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { syncUser } from "@/lib/user"

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
        strategy: "jwt",
        maxAge: 60 * 60 * 24, // 24 Stunden gültig
        updateAge: 30,   // Token wird alle 15 Minuten erneuert
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
        async session({ session, token }) {
            try {
                if (session.user) {
                    session.user.id = token.sub ?? ""
                }
                return session
            } catch (error) {
                console.error("Session error:", error)
                return session
            }
        },
    },
    trustHost: true,
    cookies: {
        sessionToken: {
            name: `__Secure-next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true
            }
        }
    }
})
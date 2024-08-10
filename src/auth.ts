import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Instagram from "next-auth/providers/instagram"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
})
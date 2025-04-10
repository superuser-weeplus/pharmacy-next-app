import { type AuthConfig } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import LineProvider from "next-auth/providers/line"
import { SanityAdapter } from "@/lib/auth/sanity-adapter"
import { client } from "@/sanity/lib/client"
import { comparePwd } from "@/lib/auth/password"

export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Email/Password",
      credentials: {
        email: { label: "อีเมล", type: "email" },
        password: { label: "รหัสผ่าน", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // ค้นหาผู้ใช้จาก Sanity
        const user = await client.fetch(
          `*[_type == "user" && email == $email][0]{
            _id,
            name,
            email,
            emailVerified,
            image,
            passwordHash,
            role,
            status
          }`,
          { email: credentials.email },
        )

        if (!user || !user.passwordHash) {
          return null
        }

        // ตรวจสอบรหัสผ่าน
        const isValid = await comparePwd(credentials.password, user.passwordHash)

        if (!isValid) {
          return null
        }

        // ตรวจสอบสถานะผู้ใช้
        if (user.status !== "active") {
          throw new Error("บัญชีถูกระงับหรือรอการยืนยัน")
        }

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        }
      },
    }),
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID as string,
      clientSecret: process.env.LINE_CLIENT_SECRET as string,
    }),
  ],
  adapter: SanityAdapter(client),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id
        token.role = user.role
      }

      if (account && account.provider === "line") {
        token.accessToken = account.access_token
        token.provider = "line"
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string
        session.user.role = token.role as string
        if (token.provider === "line") {
          Object.assign(session, {
            provider: "line",
            accessToken: token.accessToken as string
          })
        }
      }

      return session
    },
    async signIn({ user, account, profile }) {
      // สร้างบัญชีผู้ใช้ใหม่สำหรับ LINE login ถ้ายังไม่มี
      if (account?.provider === "line" && profile) {
        const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, { email: user.email })

        if (!existingUser) {
          try {
            const newUser = await client.create({
              _type: "user",
              name: user.name || profile.name,
              email: user.email,
              image: user.image,
              role: "customer",
              status: "active",
              lineProfile: {
                userId: profile.sub,
                displayName: profile.name,
                pictureUrl: user.image,
              },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })

            user.id = newUser._id
            user.role = "customer"
          } catch (error) {
            console.error("Error creating user from LINE login:", error)
            return false
          }
        } else {
          // อัปเดตข้อมูล LINE ในกรณีที่ผู้ใช้มีอยู่แล้ว
          await client
            .patch(existingUser._id)
            .set({
              lineProfile: {
                userId: profile.sub,
                displayName: profile.name,
                pictureUrl: user.image,
              },
              updatedAt: new Date().toISOString(),
            })
            .commit()

          user.id = existingUser._id
          user.role = existingUser.role
        }
      }

      return true
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const { nextUrl } = request
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: false,
} satisfies AuthConfig 
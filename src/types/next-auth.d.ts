import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * เพิ่ม property ให้กับ User ใน session
   */
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    role: string
  }
}

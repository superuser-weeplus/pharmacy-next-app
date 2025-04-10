import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

// ระบุให้ชัดเจนว่าใช้ Node.js
export const runtime = "nodejs"

export const { 
  handlers, 
  auth, 
  signIn, 
  signOut
} = NextAuth(authConfig)
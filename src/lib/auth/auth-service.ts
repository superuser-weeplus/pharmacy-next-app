"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { usePlatform } from "@/components/platform-detector"

export function useAuth() {
  const { data: session, status } = useSession()
  const { platform, isLiff } = usePlatform()

  const login = async (provider: string, credentials?: any) => {
    try {
      // ตรวจสอบว่าเป็น LINE Login บน LIFF หรือไม่
      if (provider === "line" && isLiff) {
        // ใช้ LIFF SDK สำหรับ LINE Login
        if (typeof window !== "undefined" && (window as any).liff) {
          const liff = (window as any).liff
          if (!liff.isLoggedIn()) {
            await liff.login()
          }

          // ดึงข้อมูล profile และ token จาก LIFF
          const profile = await liff.getProfile()
          const token = liff.getAccessToken()

          // ส่งข้อมูลไปยัง API เพื่อสร้าง session
          const response = await fetch("/api/auth/liff-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile, token }),
          })

          return await response.json()
        }
      }

      // ใช้ NextAuth สำหรับการ login ปกติ
      return await signIn(provider, {
        ...credentials,
        redirect: false,
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      // ตรวจสอบว่าเป็น LIFF หรือไม่
      if (isLiff && typeof window !== "undefined" && (window as any).liff) {
        const liff = (window as any).liff
        if (liff.isLoggedIn()) {
          liff.logout()
        }
      }

      // ใช้ NextAuth สำหรับการ logout ปกติ
      return await signOut({ redirect: false })
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    user: session?.user,
    login,
    logout,
  }
}

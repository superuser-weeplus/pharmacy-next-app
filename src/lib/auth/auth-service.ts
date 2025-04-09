"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { usePlatform } from "@/components/platform-detector"

interface AuthResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    token: string
  }
}

interface LoginCredentials {
  email: string
  password: string
}

interface RegisterCredentials {
  name: string
  email: string
  password: string
}

interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  const { isLiff } = usePlatform()

  const login = async (provider: string, credentials?: LoginCredentials) => {
    try {
      if (provider === "line" && isLiff) {
        if (typeof window !== "undefined" && window.liff) {
          const liff = window.liff
          if (!liff.isLoggedIn()) {
            await liff.login()
          }

          const profile = await liff.getProfile()
          const token = liff.getAccessToken()

          const response = await fetch("/api/auth/liff-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profile, token }),
          })

          return await response.json()
        }
      }

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
      if (isLiff && typeof window !== "undefined" && window.liff) {
        const liff = window.liff
        if (liff.isLoggedIn()) {
          liff.logout()
        }
      }

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

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ',
    }
  }
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Register error:', error)
    return {
      success: false,
      message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก',
    }
  }
}

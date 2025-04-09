"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Platform = "web" | "liff" | "unknown"

type PlatformContextType = {
  platform: Platform
  isLiff: boolean
  isWeb: boolean
  isUnknown: boolean
}

const PlatformContext = createContext<PlatformContextType>({
  platform: "unknown",
  isLiff: false,
  isWeb: false,
  isUnknown: true,
})

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<Platform>("unknown")

  useEffect(() => {
    // ตรวจสอบว่าเป็น client-side หรือไม่
    if (typeof window !== "undefined") {
      // ตรวจสอบว่าเป็น LIFF หรือไม่
      if (
        window.location.pathname.startsWith("/liff") ||
        (window as any).liff ||
        window.location.search.includes("liff.state")
      ) {
        setPlatform("liff")
      } else {
        setPlatform("web")
      }
    }
  }, [])

  const value = {
    platform,
    isLiff: platform === "liff",
    isWeb: platform === "web",
    isUnknown: platform === "unknown",
  }

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>
}

export function usePlatform() {
  return useContext(PlatformContext)
}

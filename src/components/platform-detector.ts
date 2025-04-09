"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

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

  return React.createElement(PlatformContext.Provider, { value }, children)
}

export function usePlatform() {
  return useContext(PlatformContext)
}

export function isLineBrowser(userAgent: string): boolean {
  return /Line/i.test(userAgent)
}

export function isMobileBrowser(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export function getPlatform(userAgent: string): 'line' | 'mobile' | 'desktop' {
  if (isLineBrowser(userAgent)) return 'line'
  if (isMobileBrowser(userAgent)) return 'mobile'
  return 'desktop'
}

"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

interface PlatformContextType {
  platform: 'web' | 'liff' | 'mobile'
  isLiff: boolean
  isWeb: boolean
  isMobile: boolean
}

const PlatformContext = createContext<PlatformContextType>({
  platform: 'web',
  isLiff: false,
  isWeb: true,
  isMobile: false,
})

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [platform, setPlatform] = useState<PlatformContextType['platform']>('web')

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
    isMobile: platform === "mobile",
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

export function isLineApp(): boolean {
  if (typeof window === 'undefined') return false
  
  const userAgent = window.navigator.userAgent.toLowerCase()
  const lineInfo = window.navigator.userAgent.match(/Line\/(\d+\.\d+)/)
  
  return userAgent.includes('line') && lineInfo !== null
}

export function getPlatform(): 'web' | 'line' {
  if (typeof window === 'undefined') return 'web'
  return isLineApp() ? 'line' : 'web'
}

import { Liff } from "@line/liff"

declare global {
  interface Window {
    liff?: Liff
  }
}

declare module "@line/liff" {
  interface Liff {
    init: (config: { liffId: string }) => Promise<void>
    isLoggedIn: () => boolean
    login: () => Promise<void>
    logout: () => void
    getProfile: () => Promise<{
      userId: string
      displayName: string
      pictureUrl?: string
      statusMessage?: string
    }>
    getAccessToken: () => string
  }
} 
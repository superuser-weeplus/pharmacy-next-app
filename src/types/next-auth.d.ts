import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
  }
  
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
    provider?: string
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string
    role: string
    provider?: string
    accessToken?: string
  }
}

import type { Adapter } from "next-auth/adapters"
import type { SanityClient } from "next-sanity"
import { v4 as uuidv4 } from "uuid"

interface SanityUser {
  _id: string
  _type: string
  name: string
  email: string
  image?: string
  role: string
}

interface SanitySession {
  _id: string
  _type: string
  sessionToken: string
  userId: string
  expires: string
}

interface Account {
  provider: string
  type: string
  providerAccountId: string
  refresh_token?: string
  access_token?: string
  expires_at?: number
  token_type?: string
  scope?: string
  id_token?: string
  session_state?: string
}

export function SanityAdapter(client: SanityClient): Adapter {
  return {
    async createUser(user: SanityUser) {
      const newUser = {
        _id: `user.${uuidv4()}`,
        _type: "user",
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
        image: user.image,
        role: "customer",
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await client.create(newUser)
      return {
        id: result._id,
        name: result.name,
        email: result.email,
        emailVerified: result.emailVerified ? new Date(result.emailVerified) : null,
        image: result.image,
      }
    },

    async getUser(id) {
      const user = await client.fetch(`*[_type == "user" && _id == $id][0]`, { id })
      if (!user) return null

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        role: user.role || "customer",
      }
    },

    async getUserByEmail(email: string): Promise<SanityUser | null> {
      const user = await client.fetch(`*[_type == "user" && email == $email][0]`, { email })
      if (!user) return null

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        role: user.role || "customer",
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.fetch(
        `*[_type == "account" && providerId == $provider && providerAccountId == $providerAccountId][0]{
          "user": *[_type == "user" && _id == ^.userId][0]
        }`,
        { provider, providerAccountId },
      )

      if (!account?.user) return null

      return {
        id: account.user._id,
        name: account.user.name,
        email: account.user.email,
        emailVerified: account.user.emailVerified ? new Date(account.user.emailVerified) : null,
        image: account.user.image,
        role: account.user.role || "customer",
      }
    },

    async updateUser(user) {
      const updatedUser = {
        _id: user.id,
        _type: "user",
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
        image: user.image,
        updatedAt: new Date().toISOString(),
      }

      const result = await client.patch(user.id).set(updatedUser).commit()

      return {
        id: result._id,
        name: result.name,
        email: result.email,
        emailVerified: result.emailVerified ? new Date(result.emailVerified) : null,
        image: result.image,
        role: result.role || "customer",
      }
    },

    async deleteUser(userId) {
      // ลบบัญชีที่เกี่ยวข้องก่อน
      await client.delete({ query: `*[_type == "account" && userId == $userId]`, params: { userId } })
      // ลบเซสชันที่เกี่ยวข้อง
      await client.delete({ query: `*[_type == "session" && userId == $userId]`, params: { userId } })
      // ลบผู้ใช้
      await client.delete(userId)
    },

    async linkAccount(account: Account) {
      const newAccount = {
        _id: `
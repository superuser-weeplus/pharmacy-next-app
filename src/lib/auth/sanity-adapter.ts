import type { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters"
import type { SanityClient } from "next-sanity"
import { v4 as uuidv4 } from "uuid"

interface SanityUser {
  _id: string
  _type: string
  name: string
  email: string
  image?: string
  role: string
  emailVerified?: Date | null
}

interface SanitySession {
  _id: string
  _type: string
  sessionToken: string
  userId: string
  expires: string
}

interface Account {
  userId: string
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
    async createUser(user: Omit<AdapterUser, "id">) {
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

    async getUserByEmail(email: string) {
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
        _id: `account.${uuidv4()}`,
        _type: "account",
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        expires_at: account.expires_at,
        token_type: account.token_type,
        scope: account.scope,
        id_token: account.id_token,
        session_state: account.session_state,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      await client.create(newAccount)
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
      await client.delete({
        query: `*[_type == "account" && provider == $provider && providerAccountId == $providerAccountId][0]`,
        params: { provider, providerAccountId }
      })
    },

    async createSession(session: { sessionToken: string; userId: string; expires: Date }) {
      const newSession = {
        _id: `session.${uuidv4()}`,
        _type: "session",
        userId: session.userId,
        expires: session.expires.toISOString(),
        sessionToken: session.sessionToken,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await client.create(newSession)
      return {
        id: result._id,
        userId: result.userId,
        expires: new Date(result.expires),
        sessionToken: result.sessionToken,
      }
    },

    async getSessionAndUser(sessionToken) {
      const result = await client.fetch(
        `*[_type == "session" && sessionToken == $sessionToken && expires > now()][0]{
          _id,
          userId,
          expires,
          sessionToken,
          "user": *[_type == "user" && _id == ^.userId][0]{
            _id,
            name,
            email,
            emailVerified,
            image,
            role
          }
        }`,
        { sessionToken },
      )

      if (!result?.user) return null

      return {
        session: {
          id: result._id,
          userId: result.userId,
          expires: new Date(result.expires),
          sessionToken: result.sessionToken,
        },
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          emailVerified: result.user.emailVerified ? new Date(result.user.emailVerified) : null,
          image: result.user.image,
          role: result.user.role || "customer",
        },
      }
    },

    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">) {
      const updatedSession = {
        expires: session.expires ? new Date(session.expires).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = await client
        .patch(`*[_type == "session" && sessionToken == $sessionToken][0]._id`)
        .set(updatedSession)
        .commit()

      return {
        id: result._id,
        userId: result.userId,
        expires: new Date(result.expires),
        sessionToken: result.sessionToken,
      }
    },

    async deleteSession(sessionToken) {
      await client.delete({ 
        query: `*[_type == "session" && sessionToken == $sessionToken][0]`,
        params: { sessionToken }
      })
    },
  }
}
import bcrypt from "bcryptjs"

export async function hashPwd(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePwd(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

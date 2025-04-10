// สำหรับใช้ Argon2 ในฝั่ง Node.js (เหมาะสำหรับ authentication ที่ต้องการความปลอดภัยสูง)
import * as argon2 from 'argon2'

// กำหนดให้ชัดเจนว่าใช้ Node.js Runtime
export const runtime = 'nodejs'

/**
 * ฟังก์ชันสำหรับเข้ารหัสรหัสผ่านโดยใช้ Argon2
 * @param password รหัสผ่านที่ต้องการเข้ารหัส
 * @returns รหัสผ่านที่ถูกเข้ารหัส
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // ใช้ Argon2id ซึ่งเป็นโหมดที่แนะนำสำหรับการเข้ารหัสรหัสผ่าน
    return await argon2.hash(password, {
      type: argon2.argon2id, // ใช้ argon2id ซึ่งเหมาะกับการใช้งานทั่วไป
      memoryCost: 65536, // 64 MiB
      timeCost: 3, // 3 iterations
      parallelism: 4, // 4 threads
      hashLength: 32, // 32 bytes output
    })
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเข้ารหัสรหัสผ่าน:', error)
    throw new Error('ไม่สามารถเข้ารหัสรหัสผ่านได้')
  }
}

/**
 * ฟังก์ชันตรวจสอบรหัสผ่าน
 * @param plainPassword รหัสผ่านธรรมดาที่ต้องการตรวจสอบ
 * @param hashedPassword รหัสผ่านที่ถูกเข้ารหัสไว้
 * @returns true ถ้ารหัสผ่านตรงกัน, false ถ้าไม่ตรงกัน
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, plainPassword)
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน:', error)
    return false
  }
} 
// ไฟล์นี้เป็น entry point สำหรับเรียกใช้ฟังก์ชันเข้ารหัสรหัสผ่านตาม runtime ที่ต้องการ

/**
 * เลือกใช้ฟังก์ชันเข้ารหัสรหัสผ่านตาม runtime
 * @param runtime runtime ที่ต้องการใช้งาน ('edge' หรือ 'nodejs')
 * @returns ฟังก์ชัน hashPassword และ verifyPassword
 */
export async function getPasswordFunctions(runtime: 'edge' | 'nodejs' = 'edge') {
  // เลือกใช้ฟังก์ชันตาม runtime
  if (runtime === 'edge') {
    // ใช้ PBKDF2 ใน Edge Runtime (แนะนำ)
    return import('./pbkdf2-edge').then(module => ({
      hashPassword: module.hashPassword,
      verifyPassword: module.verifyPassword
    }))
  } else {
    // ใช้ Argon2 ใน Node.js Runtime (แนะนำ)
    return import('./argon2-node').then(module => ({
      hashPassword: module.hashPassword,
      verifyPassword: module.verifyPassword
    }))
  }
}

// ฟังก์ชันสำหรับตรวจสอบว่ารหัสผ่านมีความแข็งแรงหรือไม่
export function isStrongPassword(password: string): boolean {
  // กำหนดเงื่อนไขความแข็งแรงของรหัสผ่าน
  const minLength = 8 // ความยาวขั้นต่ำ
  const hasUpperCase = /[A-Z]/.test(password) // มีตัวพิมพ์ใหญ่
  const hasLowerCase = /[a-z]/.test(password) // มีตัวพิมพ์เล็ก
  const hasNumbers = /\d/.test(password) // มีตัวเลข
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) // มีอักขระพิเศษ
  
  // ตรวจสอบเงื่อนไขทั้งหมด
  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChars
  )
}

// สำหรับการใช้งานแบบเรียกใช้โดยตรง (ใช้ในกรณีที่ไม่ต้องการเลือก runtime)
// สามารถ import โดยตรงจาก './pbkdf2-edge' หรือ './argon2-node'
export { hashPassword, verifyPassword } from './pbkdf2-edge' // default ให้เป็น Edge Runtime 
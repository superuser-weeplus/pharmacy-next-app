// สร้างฟังก์ชันสำหรับเข้ารหัสรหัสผ่านโดยใช้ Web Crypto API
// เหมาะสำหรับ Edge Runtime

// กำหนดให้ชัดเจนว่าใช้ Edge Runtime
export const runtime = 'edge'

/**
 * ฟังก์ชันสำหรับเข้ารหัสรหัสผ่านโดยใช้ Web Crypto API
 * @param password รหัสผ่านที่ต้องการเข้ารหัส
 * @returns รหัสผ่านที่ถูกเข้ารหัสพร้อม salt
 */
export async function hashPassword(password: string): Promise<string> {
  // สร้าง salt แบบสุ่ม
  const salt = crypto.getRandomValues(new Uint8Array(16))
  
  // แปลง password เป็น TextEncoder
  const encoder = new TextEncoder()
  const passwordBuffer = encoder.encode(password)
  
  // รวม password กับ salt
  const combinedBuffer = new Uint8Array(passwordBuffer.length + salt.length)
  combinedBuffer.set(passwordBuffer)
  combinedBuffer.set(salt, passwordBuffer.length)
  
  // ใช้ SHA-256 hash เพื่อเข้ารหัส
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer)
  
  // แปลงผลลัพธ์เป็น base64
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // แปลง salt เป็น base64 เพื่อเก็บไว้รวมกับรหัสผ่านที่ถูกเข้ารหัส
  const saltArray = Array.from(salt)
  const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('')
  
  // รูปแบบที่เก็บคือ salt:hash
  return `${saltHex}:${hashHex}`
}

/**
 * ฟังก์ชันตรวจสอบรหัสผ่าน
 * @param plainPassword รหัสผ่านธรรมดาที่ต้องการตรวจสอบ
 * @param hashedPassword รหัสผ่านที่ถูกเข้ารหัสไว้
 * @returns true ถ้ารหัสผ่านตรงกัน, false ถ้าไม่ตรงกัน
 */
export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    // แยก salt และ hash
    const [saltHex, storedHashHex] = hashedPassword.split(':')
    
    if (!saltHex || !storedHashHex) {
      return false
    }
    
    // แปลง salt กลับเป็น Uint8Array
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
    
    // แปลง plainPassword เป็น TextEncoder
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(plainPassword)
    
    // รวม password กับ salt เดิม
    const combinedBuffer = new Uint8Array(passwordBuffer.length + salt.length)
    combinedBuffer.set(passwordBuffer)
    combinedBuffer.set(salt, passwordBuffer.length)
    
    // ใช้ SHA-256 hash เพื่อเข้ารหัส
    const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer)
    
    // แปลง hash เป็น hex
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // เปรียบเทียบ hash
    return hashHex === storedHashHex
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน:', error)
    return false
  }
} 
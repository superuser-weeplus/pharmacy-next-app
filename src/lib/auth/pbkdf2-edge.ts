// ใช้ PBKDF2 ผ่าน Web Crypto API ซึ่งปลอดภัยกว่า SHA-256 
// และเป็นมาตรฐานที่แนะนำสำหรับการเข้ารหัสรหัสผ่าน

// กำหนดให้ชัดเจนว่าใช้ Edge Runtime
export const runtime = 'edge'

// ค่าคงที่สำหรับ PBKDF2
const ITERATIONS = 100000 // จำนวนรอบการทำซ้ำ (ยิ่งมากยิ่งปลอดภัย)
const KEY_LENGTH = 256 // ความยาวของคีย์ในหน่วยบิต
const SALT_LENGTH = 16 // ความยาวของ salt ในหน่วยไบต์

/**
 * ฟังก์ชันสำหรับเข้ารหัสรหัสผ่านโดยใช้ PBKDF2
 * @param password รหัสผ่านที่ต้องการเข้ารหัส
 * @returns รหัสผ่านที่ถูกเข้ารหัสพร้อม salt และพารามิเตอร์
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // สร้าง salt แบบสุ่ม
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH))
    
    // แปลง password เป็น TextEncoder
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(password)
    
    // สร้าง key จาก password ด้วย PBKDF2
    const key = await crypto.subtle.importKey(
      'raw', 
      passwordBuffer, 
      { name: 'PBKDF2' }, 
      false, 
      ['deriveBits']
    )
    
    // ใช้ PBKDF2 เพื่อเข้ารหัส
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256'
      },
      key,
      KEY_LENGTH
    )
    
    // แปลงผลลัพธ์เป็น hex
    const hashArray = Array.from(new Uint8Array(derivedBits))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // แปลง salt เป็น hex เพื่อเก็บไว้
    const saltArray = Array.from(salt)
    const saltHex = saltArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // รูปแบบที่เก็บคือ algorithm:iterations:salt:hash
    return `pbkdf2:${ITERATIONS}:${saltHex}:${hashHex}`
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
    // แยกส่วนประกอบของรหัสผ่านที่ถูกเข้ารหัส
    const [algorithm, iterationsStr, saltHex, storedHashHex] = hashedPassword.split(':')
    
    if (algorithm !== 'pbkdf2' || !iterationsStr || !saltHex || !storedHashHex) {
      return false
    }
    
    // แปลง parameters
    const iterations = parseInt(iterationsStr, 10)
    
    // แปลง salt กลับเป็น Uint8Array
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [])
    
    // แปลง plainPassword เป็น TextEncoder
    const encoder = new TextEncoder()
    const passwordBuffer = encoder.encode(plainPassword)
    
    // สร้าง key จาก password ด้วย PBKDF2
    const key = await crypto.subtle.importKey(
      'raw', 
      passwordBuffer, 
      { name: 'PBKDF2' }, 
      false, 
      ['deriveBits']
    )
    
    // ใช้ PBKDF2 เพื่อเข้ารหัส
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256'
      },
      key,
      KEY_LENGTH
    )
    
    // แปลงผลลัพธ์เป็น hex
    const hashArray = Array.from(new Uint8Array(derivedBits))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    
    // เปรียบเทียบ hash
    return hashHex === storedHashHex
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน:', error)
    return false
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { getPasswordFunctions } from '@/lib/auth'

// กำหนดให้ใช้ Edge Runtime
export const runtime = 'edge'

// API Route สำหรับตรวจสอบรหัสผ่าน
export async function POST(request: NextRequest) {
  try {
    // รับข้อมูลจาก request
    const { password, hashedPassword } = await request.json()
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!password || !hashedPassword) {
      return NextResponse.json(
        { error: 'กรุณาระบุรหัสผ่านและรหัสผ่านที่เข้ารหัสแล้ว' },
        { status: 400 }
      )
    }
    
    // เรียกใช้ฟังก์ชันตรวจสอบรหัสผ่าน
    const { verifyPassword } = await getPasswordFunctions('edge')
    const isValid = await verifyPassword(password, hashedPassword)
    
    // ส่งผลลัพธ์การตรวจสอบกลับไป
    return NextResponse.json({ isValid })
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน:', error)
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน' },
      { status: 500 }
    )
  }
} 
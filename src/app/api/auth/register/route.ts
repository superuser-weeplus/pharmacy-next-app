import { NextRequest, NextResponse } from 'next/server'
import { getPasswordFunctions, isStrongPassword } from '@/lib/auth'
import { getSanityClient } from '@/lib/sanity'

// กำหนดให้ใช้ Edge Runtime
export const runtime = 'edge'

// API Route สำหรับลงทะเบียนผู้ใช้
export async function POST(request: NextRequest) {
  try {
    // รับข้อมูลจาก request
    const { email, password, name } = await request.json()
    
    // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }
    
    // ตรวจสอบความแข็งแรงของรหัสผ่าน
    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { 
          error: 'รหัสผ่านไม่ปลอดภัยเพียงพอ', 
          requirements: 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวพิมพ์ใหญ่, ตัวพิมพ์เล็ก, ตัวเลข และอักขระพิเศษ' 
        },
        { status: 400 }
      )
    }
    
    // ดึง client จาก Sanity
    const client = await getSanityClient('edge')
    
    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือไม่
    const existingUser = await client.fetch(`*[_type == "user" && email == $email][0]`, { email })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้มีในระบบแล้ว' },
        { status: 409 }
      )
    }
    
    // เข้ารหัสรหัสผ่าน (ใช้ PBKDF2 สำหรับ Edge Runtime)
    const { hashPassword } = await getPasswordFunctions('edge')
    const hashedPassword = await hashPassword(password)
    
    // สร้างผู้ใช้ใหม่ใน Sanity
    // หมายเหตุ: การสร้างข้อมูลใน Sanity ต้องใช้ API Token ซึ่งไม่ควรเปิดเผยใน Edge Runtime
    // สำหรับจริง ควรแยกส่วนนี้ไปทำงานใน Node.js หรือใช้ Server Action
    // นี่เป็นเพียงตัวอย่างเท่านั้น
    const user = await client.create({
      _type: 'user',
      email,
      name,
      password: hashedPassword, // เก็บรหัสผ่านที่เข้ารหัสแล้ว
      role: 'user',
      createdAt: new Date().toISOString()
    })
    
    // ส่งตอบกลับสำเร็จ (โดยไม่ส่งข้อมูลรหัสผ่านกลับไป)
    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }, { status: 201 })
    
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลงทะเบียน:', error)
    
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
} 
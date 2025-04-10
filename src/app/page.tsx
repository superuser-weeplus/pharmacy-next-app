import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function HomePage() {
  // ตรวจสอบ user agent แบบปลอดภัยไม่ให้เกิด error
  let destination = "/web" // ค่าเริ่มต้นเป็นเว็บเวอร์ชันปกติ
  
  try {
    const headersList = await headers()
    const userAgent = headersList.get("user-agent") || ""
    
    // ตรวจสอบว่าเป็น LINE หรือไม่
    const isLineApp = 
      userAgent.toLowerCase().includes("line") || 
      userAgent.toLowerCase().includes("liff")
    
    // กำหนดปลายทางตามประเภทของอุปกรณ์
    if (isLineApp) {
      destination = "/liff"
    }
  } catch (error) {
    console.error("Error in user agent detection:", error)
    // กรณีเกิดข้อผิดพลาด ยังคงใช้ค่าเริ่มต้น (/web)
  }
  
  // ทำการ redirect เพียงครั้งเดียวหลังจากการประมวลผลเสร็จสิ้น
  redirect(destination)
}
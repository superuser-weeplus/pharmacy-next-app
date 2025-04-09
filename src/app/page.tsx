import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function HomePage() {
  try {
    const headersList = await headers()
    const userAgent = headersList.get("user-agent") || ""
    
    // ตรวจสอบว่าเป็น LINE หรือไม่ด้วยการค้นหาคำที่เกี่ยวข้อง
    // ใช้ toLowerCase() เพื่อให้สามารถจับได้ทั้งตัวพิมพ์เล็กและใหญ่
    const isLineApp = 
      userAgent.toLowerCase().includes("line") || 
      userAgent.toLowerCase().includes("liff")
    
    // ทำการ redirect ไปยังหน้าที่เหมาะสม
    if (isLineApp) {
      redirect("/liff")
    } else {
      redirect("/web")
    }
  } catch (error) {
    console.error("Error in user agent detection:", error)
    // กรณีเกิดข้อผิดพลาด ให้ไปที่เว็บเวอร์ชันปกติ
    redirect("/web")
  }
  
  // โค้ดส่วนนี้จะไม่ทำงานเนื่องจาก redirect จะหยุดการทำงานของ component
  return null
}
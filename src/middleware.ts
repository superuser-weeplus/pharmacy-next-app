import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

// ระบุให้ชัดเจนว่าใช้ Edge Runtime
export const runtime = "edge"

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  process.env.NEXT_PUBLIC_APP_URL || '',
  process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : '',
].filter(Boolean)

export default async function middleware(request: NextRequest) {
  try {
    // ตรวจสอบ origin เพื่อป้องกัน CSRF
    const origin = request.headers.get("origin")
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      console.warn(`Origin not allowed: ${origin}`)
      return new NextResponse(null, { status: 403 })
    }

    // ตรวจสอบ token ที่ถูกต้อง
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    })

    // ตรวจสอบ role หากเป็นหน้าที่ต้องการสิทธิ์พิเศษ
    if (request.nextUrl.pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // ถ้าเป็นหน้า dashboard และไม่มี token ที่ถูกต้อง
    if (request.nextUrl.pathname.startsWith("/dashboard") && !token) {
      const signInUrl = new URL("/auth/signin", request.url)
      // เพิ่ม returnUrl เพื่อให้ redirect กลับมาหน้าเดิมหลังจาก login
      signInUrl.searchParams.set("callbackUrl", request.url)
      return NextResponse.redirect(signInUrl)
    }

    // ถ้าเป็นหน้า signin และมี token อยู่แล้ว
    if (request.nextUrl.pathname.startsWith("/auth/signin") && token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // กรณีเกิดข้อผิดพลาด ให้ redirect ไปหน้า signin และบันทึก log
    console.error("Middleware error:", error)
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/signin",
    "/unauthorized",
  ]
}
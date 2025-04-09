"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebPage() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>ยินดีต้อนรับสู่เว็บไซต์</CardTitle>
          <CardDescription>นี่คือเวอร์ชันสำหรับผู้ใช้ทั่วไป</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>คุณกำลังเข้าชมเว็บไซต์ผ่านเบราว์เซอร์ปกติ</p>
            <div className="flex gap-4">
              <Button variant="default">เข้าสู่ระบบ</Button>
              <Button variant="outline">สมัครสมาชิก</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
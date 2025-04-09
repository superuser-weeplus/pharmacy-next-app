"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function LiffPage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    // ตรวจสอบว่าเป็น LIFF หรือไม่
    if (typeof window !== 'undefined' && window.liff) {
      window.liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID || '' })
        .then(() => {
          if (window.liff.isLoggedIn()) {
            window.liff.getProfile()
              .then(profile => {
                setProfile(profile)
              })
              .catch(err => {
                console.error('Error getting profile:', err)
              })
          }
        })
        .catch(err => {
          console.error('Error initializing LIFF:', err)
        })
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>ยินดีต้อนรับสู่ LINE LIFF</CardTitle>
          <CardDescription>นี่คือเวอร์ชันสำหรับผู้ใช้ LINE</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profile ? (
              <>
                <p>สวัสดี {profile.displayName}</p>
                <img 
                  src={profile.pictureUrl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full"
                />
              </>
            ) : (
              <p>กรุณาเข้าสู่ระบบผ่าน LINE</p>
            )}
            <div className="flex gap-4">
              <Button variant="default">ดูประวัติการสั่งซื้อ</Button>
              <Button variant="outline">ติดต่อร้านค้า</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
"use client"

import Link from "next/link"
import { Search, ShoppingCart, User, Phone, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"

export function Header() {
  const { getItemCount } = useCart()
  const [cartCount, setCartCount] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "admin"

  // ตรวจสอบว่าเป็น client-side หรือไม่
  useEffect(() => {
    setIsClient(true)
  }, [])

  // อัปเดตจำนวนสินค้าในตะกร้าเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (isClient) {
      setCartCount(getItemCount())
    }
  }, [getItemCount, isClient])

  return (
    <header className="w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-primary">
                <path
                  fill="currentColor"
                  d="M10.5,17.15C10.5,17.15 12.03,16.45 13.5,16.45C14.97,16.45 16.5,17.15 16.5,17.15L15.46,19.36C15.46,19.36 14.5,18.83 13.5,18.83C12.5,18.83 11.54,19.36 11.54,19.36L10.5,17.15M13.5,6.33C14.97,6.33 16.5,7.03 16.5,7.03L15.46,9.24C15.46,9.24 14.5,8.71 13.5,8.71C12.5,8.71 11.54,9.24 11.54,9.24L10.5,7.03C10.5,7.03 12.03,6.33 13.5,6.33M10.5,11.73C10.5,11.73 12.03,11.03 13.5,11.03C14.97,11.03 16.5,11.73 16.5,11.73L15.46,13.95C15.46,13.95 14.5,13.42 13.5,13.42C12.5,13.42 11.54,13.95 11.54,13.95L10.5,11.73M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12Z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-primary">MedPharma</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Phone size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">โทร: 02-123-4567</span>
          </div>

          <div className="hidden md:block w-1/3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input type="text" placeholder="ค้นหาสินค้า..." className="pl-10 pr-4 py-2 w-full" />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/web/account" className="hidden md:flex items-center gap-1 text-sm">
              <User size={20} />
              <span>บัญชีของฉัน</span>
            </Link>
            <Link href="/web/cart" className="relative">
              <ShoppingCart size={24} />
              {isClient && cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>
      </div>

      <nav className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12 justify-between">
            <ul className="flex space-x-1">
              <li>
                <Link href="/" className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10">
                  หน้าหลัก
                </Link>
              </li>
              <li className="relative group">
                <button className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10 gap-1">
                  สินค้าทั้งหมด
                  <ChevronDown size={16} />
                </button>
                <div className="absolute left-0 top-full z-10 hidden w-48 rounded-md border bg-background p-2 shadow-md group-hover:block">
                  <Link href="/products" className="block rounded-sm px-3 py-2 hover:bg-muted">
                    สินค้าทั้งหมด
                  </Link>
                  <Link
                    href="/products?category=gastrointestinal"
                    className="block rounded-sm px-3 py-2 hover:bg-muted"
                  >
                    ยาระบบทางเดินอาหาร
                  </Link>
                  <Link href="/products?category=cardiovascular" className="block rounded-sm px-3 py-2 hover:bg-muted">
                    ยาระบบหัวใจและหลอดเลือด
                  </Link>
                  <Link href="/products?category=respiratory" className="block rounded-sm px-3 py-2 hover:bg-muted">
                    ยาระบบทางเดินหายใจ
                  </Link>
                </div>
              </li>
              <li>
                <Link href="/blog" className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10">
                  บทความ
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10"
                >
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link
                  href="/prescription"
                  className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10"
                >
                  ใบสั่งยา
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/products"
                  className="flex h-12 items-center px-4 font-medium hover:bg-primary-foreground/10"
                >
                  จัดการสินค้า
                </Link>
              </li>
            </ul>

            {/* ลบเงื่อนไขการตรวจสอบ admin ออก เพราะเราต้องการให้ปุ่มแสดงตลอดเวลา */}
          </div>
        </div>
      </nav>
    </header>
  )
}

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">MedPharma</h3>
            <p className="text-muted-foreground mb-4">ร้านขายยาออนไลน์ที่ให้บริการด้านสุขภาพครบวงจร พร้อมจัดส่งถึงบ้านทั่วประเทศ</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">หมวดหมู่สินค้า</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products?category=gastrointestinal" className="text-muted-foreground hover:text-primary">
                  ยาระบบทางเดินอาหาร
                </Link>
              </li>
              <li>
                <Link href="/products?category=cardiovascular" className="text-muted-foreground hover:text-primary">
                  ยาระบบหัวใจและหลอดเลือด
                </Link>
              </li>
              <li>
                <Link href="/products?category=respiratory" className="text-muted-foreground hover:text-primary">
                  ยาระบบทางเดินหายใจ
                </Link>
              </li>
              <li>
                <Link href="/products?category=supplements" className="text-muted-foreground hover:text-primary">
                  อาหารเสริมและวิตามิน
                </Link>
              </li>
              <li>
                <Link href="/products?category=medical-equipment" className="text-muted-foreground hover:text-primary">
                  เครื่องมือทางการแพทย์
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">ข้อมูลเพิ่มเติม</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-primary">
                  การจัดส่ง
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  เงื่อนไขการใช้บริการ
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  คำถามที่พบบ่อย
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">ติดต่อเรา</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-primary" />
                <span className="text-muted-foreground">02-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-primary" />
                <span className="text-muted-foreground">contact@medpharma.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MedPharma. สงวนลิขสิทธิ์ทั้งหมด</p>
        </div>
      </div>
    </footer>
  )
}

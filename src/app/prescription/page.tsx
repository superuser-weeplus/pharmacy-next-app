"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, ShoppingCart, ChevronRight, Plus, Minus, Check } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

// นิยามประเภทข้อมูลยา
interface IMedicine {
  id: string
  genericName: string
  strength: string
  form: string
  atcCode: string
  atcCategory: string
  indication: string
  price: number
  stock: number
}

// นิยามประเภทของรายการในตะกร้า
interface ICartItem {
  medicineId: string
  quantity: number
  medicine: IMedicine
}

// รายการตัวอย่างของยา (ในโปรเจคจริงข้อมูลจะมาจาก API)
const SAMPLE_MEDICINES: IMedicine[] = [
  {
    id: "med1",
    genericName: "Paracetamol",
    strength: "500 mg",
    form: "Tablet",
    atcCode: "N02BE01",
    atcCategory: "Other analgesics and antipyretics",
    indication: "Fever, Mild to moderate pain",
    price: 2.5,
    stock: 500,
  },
  {
    id: "med2",
    genericName: "Amoxicillin",
    strength: "500 mg",
    form: "Capsule",
    atcCode: "J01CA04",
    atcCategory: "Beta-lactam antibacterials, penicillins",
    indication: "Bacterial infections",
    price: 12,
    stock: 300,
  },
  {
    id: "med3",
    genericName: "Omeprazole",
    strength: "20 mg",
    form: "Capsule",
    atcCode: "A02BC01",
    atcCategory: "Drugs for peptic ulcer and gastro-oesophageal reflux disease (GORD)",
    indication: "Gastric ulcer, GERD",
    price: 15,
    stock: 200,
  },
  {
    id: "med4",
    genericName: "Simvastatin",
    strength: "20 mg",
    form: "Tablet",
    atcCode: "C10AA01",
    atcCategory: "Lipid modifying agents, plain",
    indication: "Hypercholesterolemia",
    price: 18,
    stock: 250,
  },
  {
    id: "med5",
    genericName: "Amlodipine",
    strength: "5 mg",
    form: "Tablet",
    atcCode: "C08CA01",
    atcCategory: "Selective calcium channel blockers with mainly vascular effects",
    indication: "Hypertension, Angina",
    price: 10,
    stock: 350,
  },
]

// กลุ่มตัวอย่างของ ATC
const ATC_CATEGORIES = [
  { code: "A", name: "Alimentary tract and metabolism" },
  { code: "B", name: "Blood and blood forming organs" },
  { code: "C", name: "Cardiovascular system" },
  { code: "D", name: "Dermatologicals" },
  { code: "G", name: "Genito-urinary system and sex hormones" },
  { code: "H", name: "Systemic hormonal preparations, excluding sex hormones and insulins" },
  { code: "J", name: "Anti-infectives for systemic use" },
  { code: "L", name: "Antineoplastic and immunomodulating agents" },
  { code: "M", name: "Musculo-skeletal system" },
  { code: "N", name: "Nervous system" },
  { code: "P", name: "Antiparasitic products, insecticides and repellents" },
  { code: "R", name: "Respiratory system" },
  { code: "S", name: "Sensory organs" },
  { code: "V", name: "Various" },
]

export default function PrescriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterByATC, setFilterByATC] = useState("")
  const [medicines, setMedicines] = useState<IMedicine[]>(SAMPLE_MEDICINES)
  const [filteredMedicines, setFilteredMedicines] = useState<IMedicine[]>(SAMPLE_MEDICINES)
  const [cart, setCart] = useState<ICartItem[]>([])
  const [selectedTab, setSelectedTab] = useState("search")

  // ตรวจสอบสิทธิ์การเข้าถึง - เฉพาะแพทย์และเภสัชกร
  useEffect(() => {
    if (status === "authenticated") {
      const userRole = session?.user?.role
      if (userRole !== "doctor" && userRole !== "pharmacist") {
        // ในสภาพแวดล้อมจริงควรมีการตรวจสอบบทบาท
        // router.push("/unauthorized");
      }
    } else if (status === "unauthenticated") {
      // ในสภาพแวดล้อมจริงควรมีการ redirect ไปหน้า login
      // router.push("/login");
    }
  }, [status, session, router])

  // ค้นหายาตามคำค้นและหมวดหมู่ ATC
  useEffect(() => {
    const searchResults = medicines.filter((medicine) => {
      const matchesSearch =
        searchTerm === "" ||
        medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.atcCode.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesATC = filterByATC === "" || medicine.atcCode.startsWith(filterByATC)

      return matchesSearch && matchesATC
    })

    setFilteredMedicines(searchResults)
  }, [searchTerm, filterByATC, medicines])

  // เพิ่มยาลงในตะกร้า
  const addToCart = (medicine: IMedicine) => {
    setCart((prevCart) => {
      // ตรวจสอบว่ามียาในตะกร้าแล้วหรือไม่
      const existingItem = prevCart.find((item) => item.medicineId === medicine.id)

      if (existingItem) {
        // ถ้ามีแล้ว เพิ่มจำนวน
        return prevCart.map((item) =>
          item.medicineId === medicine.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        // ถ้ายังไม่มี เพิ่มรายการใหม่
        return [...prevCart, { medicineId: medicine.id, quantity: 1, medicine }]
      }
    })

    toast({
      title: "เพิ่มยาในใบสั่งแล้ว",
      description: `${medicine.genericName} ถูกเพิ่มในใบสั่งยาแล้ว`,
      duration: 3000,
    })
  }

  // ลบยาออกจากตะกร้า
  const removeFromCart = (medicineId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.medicineId !== medicineId))
  }

  // อัพเดตจำนวนยาในตะกร้า
  const updateQuantity = (medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicineId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.medicineId === medicineId ? { ...item, quantity } : item)))
  }

  // คำนวณยอดรวม
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.medicine.price * item.quantity, 0)
  }

  // ส่งคำสั่งซื้อ
  const submitOrder = () => {
    // สร้างคำสั่งซื้อและส่งไปที่ API
    const order = {
      items: cart,
      totalAmount: calculateTotal(),
      doctorId: session?.user?.id,
      createdAt: new Date(),
    }

    console.log("Submitting order:", order)
    // ในที่นี้จะไม่มีการเรียก API จริง แต่ในโปรเจคจริงจะมีการส่งข้อมูลไปที่ backend

    // ล้างตะกร้าหลังจากสั่งซื้อ
    setCart([])
    setSelectedTab("confirm") // ไปที่แท็บยืนยัน

    toast({
      title: "ส่งคำสั่งซื้อสำเร็จ",
      description: "ใบสั่งยาของคุณถูกส่งเรียบร้อยแล้ว",
      duration: 3000,
    })
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">ระบบใบสั่งยา (สำหรับบุคลากรทางการแพทย์)</h1>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="search">1. ค้นหายา</TabsTrigger>
                  <TabsTrigger value="review">2. ตรวจสอบรายการ</TabsTrigger>
                  <TabsTrigger value="confirm">3. ยืนยัน</TabsTrigger>
                </TabsList>

                {/* แท็บค้นหายา */}
                <TabsContent value="search" className="mt-4">
                  <div className="mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* ช่องค้นหา */}
                      <div className="flex-1 relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          size={18}
                        />
                        <Input
                          placeholder="ค้นหาตามชื่อยาหรือรหัส ATC"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>

                      {/* ตัวกรองตามหมวดหมู่ ATC */}
                      <div className="w-full md:w-64">
                        <Select value={filterByATC} onValueChange={setFilterByATC}>
                          <SelectTrigger>
                            <SelectValue placeholder="ทุกหมวดหมู่" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                            {ATC_CATEGORIES.map((category) => (
                              <SelectItem key={category.code} value={category.code}>
                                {category.code} - {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* รายการยา */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h2 className="text-lg font-medium mb-4">รายการยา ({filteredMedicines.length})</h2>

                    {filteredMedicines.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">ไม่พบรายการยาที่ตรงกับการค้นหา</p>
                    ) : (
                      <div className="space-y-4">
                        {filteredMedicines.map((medicine) => (
                          <Card key={medicine.id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg">{medicine.genericName}</h3>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    <p>
                                      <span className="font-medium">ความแรง:</span> {medicine.strength}
                                    </p>
                                    <p>
                                      <span className="font-medium">ลักษณะยา:</span> {medicine.form}
                                    </p>
                                    <p>
                                      <span className="font-medium">รหัส ATC:</span> {medicine.atcCode} (
                                      {medicine.atcCategory})
                                    </p>
                                  </div>
                                  <div className="mt-2 bg-blue-50 p-2 rounded text-sm">
                                    <p>
                                      <span className="font-medium">บ่งใช้:</span> {medicine.indication}
                                    </p>
                                  </div>
                                  <div className="mt-2 flex items-center">
                                    <span className="text-lg font-bold text-primary">
                                      {medicine.price.toFixed(2)} บาท
                                    </span>
                                    <span className="ml-3 text-sm text-muted-foreground">
                                      คงเหลือ: {medicine.stock} หน่วย
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 md:mt-0 md:ml-4 flex items-center">
                                  <Button onClick={() => addToCart(medicine)}>
                                    <ShoppingCart size={16} className="mr-2" />
                                    เพิ่มในใบสั่ง
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ปุ่มต่อไป */}
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setSelectedTab("review")} disabled={cart.length === 0}>
                      ถัดไป
                      <ChevronRight size={16} className="ml-2" />
                    </Button>
                  </div>
                </TabsContent>

                {/* แท็บตรวจสอบรายการ */}
                <TabsContent value="review" className="mt-4">
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h2 className="text-lg font-medium mb-4">ตรวจสอบรายกา��ใบสั่ง</h2>

                    {cart.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">ไม่มีรายการยาในใบสั่ง</p>
                        <Button onClick={() => setSelectedTab("search")}>เพิ่มรายการยา</Button>
                      </div>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="py-2 px-4 text-left">��ายการยา</th>
                                <th className="py-2 px-4 text-center">ราคาต่อหน่วย</th>
                                <th className="py-2 px-4 text-center">จำนวน</th>
                                <th className="py-2 px-4 text-right">ราคารวม</th>
                                <th className="py-2 px-4"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {cart.map((item) => (
                                <tr key={item.medicineId} className="border-b">
                                  <td className="py-4 px-4">
                                    <div>
                                      <div className="font-medium">{item.medicine.genericName}</div>
                                      <div className="text-sm text-muted-foreground">
                                        {item.medicine.strength}, {item.medicine.form}
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-center">{item.medicine.price.toFixed(2)} บาท</td>
                                  <td className="py-4 px-4">
                                    <div className="flex items-center justify-center">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}
                                      >
                                        <Minus size={14} />
                                      </Button>
                                      <Input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) =>
                                          updateQuantity(item.medicineId, Number.parseInt(e.target.value) || 0)
                                        }
                                        className="w-16 mx-2 text-center"
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}
                                      >
                                        <Plus size={14} />
                                      </Button>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-right font-medium">
                                    {(item.medicine.price * item.quantity).toFixed(2)} บาท
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => removeFromCart(item.medicineId)}
                                    >
                                      ลบ
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-muted/50">
                                <td colSpan={3} className="py-4 px-4 text-right font-bold">
                                  ยอดรวมทั้งสิ้น:
                                </td>
                                <td className="py-4 px-4 text-right font-bold text-lg text-primary">
                                  {calculateTotal().toFixed(2)} บาท
                                </td>
                                <td></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>

                        <div className="mt-6 flex justify-between">
                          <Button variant="outline" onClick={() => setSelectedTab("search")}>
                            เพิ่มรายการยา
                          </Button>
                          <Button onClick={submitOrder} className="bg-green-600 hover:bg-green-700">
                            ยืนยันคำสั่ง
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                {/* แท็บยืนยัน */}
                <TabsContent value="confirm" className="mt-4">
                  <div className="bg-green-50 rounded-lg p-8 text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-green-700 mb-2">คำสั่งซื้อสำเร็จ</h2>
                    <p className="text-muted-foreground mb-6">ใบสั่งยาของคุณถูกส่งเรียบร้อยแล้ว</p>
                    <Button
                      onClick={() => {
                        setSelectedTab("search")
                        setCart([])
                      }}
                    >
                      สร้างใบสั่งยาใหม่
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

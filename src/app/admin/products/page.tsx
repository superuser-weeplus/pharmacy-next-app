import { getNodeApis } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { getPasswordFunctions } from '@/lib/auth'

// กำหนดให้ทำงานบน Node.js Runtime
export const runtime = 'nodejs'

export default async function AdminProductsPage() {
  // ใช้ API เฉพาะสำหรับ Node.js
  const { getProducts, urlFor } = await getNodeApis()
  const products = await getProducts(20)
  
  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">จัดการสินค้า</h1>
        <p className="text-gray-600">หน้านี้ทำงานบน Node.js Runtime เพื่อรองรับการจัดการข้อมูล</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">เพิ่มสินค้าใหม่</h2>
        <Link
          href="/admin/products/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          เพิ่มสินค้า
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รูปภาพ</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ชื่อสินค้า</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ราคา</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หมวดหมู่</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product: any) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.mainImage && (
                    <div className="relative h-16 w-16">
                      <Image
                        src={urlFor(product.mainImage).width(64).height(64).url()}
                        alt={product.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{product.price} บาท</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {product.categories?.map((cat: { title: string }) => cat.title).join(', ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    href={`/admin/products/edit/${product._id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    แก้ไข
                  </Link>
                  <button className="text-red-600 hover:text-red-900">
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export async function POST(request: Request) {
  const data = await request.json()
  const { password } = data
  const { hashPassword } = await getPasswordFunctions('nodejs')
  const hashedPassword = await hashPassword(password)
  // ...
}
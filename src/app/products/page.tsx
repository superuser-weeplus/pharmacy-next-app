import { getEdgeApis } from '@/lib/sanity'
import Link from 'next/link'
import Image from 'next/image'

// กำหนดให้ทำงานบน Edge Runtime
export const runtime = 'edge'

export default async function ProductsPage() {
  // ใช้ API เฉพาะสำหรับ Edge
  const { getProductsForEdge } = await getEdgeApis()
  const products = await getProductsForEdge(12)
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">สินค้าทั้งหมด</h1>
      <p className="mb-6 text-gray-600">หน้านี้ทำงานบน Edge Runtime เพื่อความเร็ว</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product: any) => (
          <div key={product._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {product.image && (
              <div className="relative h-48 w-full">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-gray-600 mt-2">{product.price} บาท</p>
              <Link 
                href={`/products/${product.slug?.current}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ดูรายละเอียด
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
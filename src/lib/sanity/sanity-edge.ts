import { createClient } from 'next-sanity'

// กำหนดให้ชัดเจนว่าใช้ Edge Runtime
export const runtime = 'edge'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-08-01'

// สร้าง client สำหรับ Edge Runtime - ไม่มีการใช้ฟีเจอร์ที่ต้อง Node.js
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  // เพิ่ม optimization สำหรับ Edge
  perspective: 'published',
  stega: {
    enabled: process.env.NODE_ENV === 'development',
  },
})

// ตัวอย่างฟังก์ชั่นที่ใช้ client โดยเฉพาะใน Edge
export async function getProductsForEdge(limit = 10) {
  return client.fetch(`*[_type == "product"][0...${limit}] {
    _id,
    title,
    price,
    slug,
    "image": mainImage.asset->url
  }`)
}

// ฟังก์ชั่นสำหรับค้นหาสินค้า (เหมาะกับ Edge เพราะเร็ว)
export async function searchProducts(query: string) {
  return client.fetch(`*[_type == "product" && title match "*${query}*"] {
    _id,
    title,
    price,
    slug,
    "image": mainImage.asset->url
  }`)
} 
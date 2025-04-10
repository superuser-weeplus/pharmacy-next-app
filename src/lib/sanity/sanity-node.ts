import { createClient } from 'next-sanity'
import { cache } from 'react'
import imageUrlBuilder from '@sanity/image-url'

// กำหนดให้ชัดเจนว่าใช้ Node.js Runtime
export const runtime = 'nodejs'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-08-01'
const token = process.env.SANITY_API_TOKEN // โทเค็นสำหรับ write operations

// สร้าง client สำหรับ Node.js Runtime - มีฟีเจอร์เพิ่มเติมที่ต้องการ Node.js
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  token, // ใช้ token สำหรับ write operations
  stega: {
    enabled: process.env.NODE_ENV === 'development',
  },
})

// สร้าง image URL builder
const builder = imageUrlBuilder(client)
export const urlFor = (source: any) => builder.image(source)

// ใช้ cache จาก React สำหรับการดึงข้อมูล
export const getProducts = cache(async (limit = 10) => {
  return client.fetch(`*[_type == "product"][0...${limit}] {
    _id,
    title,
    price,
    slug,
    mainImage,
    body,
    categories[]->{
      _id,
      title
    }
  }`)
})

// ฟังก์ชันสำหรับการ mutation (เช่น การสร้าง หรือ อัพเดทข้อมูล)
// ต้องใช้ Node.js Runtime เพราะมีการใช้ token
export async function createOrder(orderData: any) {
  return client.create({
    _type: 'order',
    ...orderData,
    createdAt: new Date().toISOString()
  })
}

// ฟังก์ชันสำหรับอัพโหลดรูปภาพ (ต้องใช้ Node.js)
export async function uploadImage(imageFile: any) {
  return client.assets.upload('image', imageFile)
} 
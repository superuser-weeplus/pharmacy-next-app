// ไฟล์นี้ใช้สำหรับเป็น entry point สำหรับการใช้งาน Sanity Client
// แต่ละไฟล์จะถูกเรียกใช้อย่างเจาะจงตาม runtime ที่ต้องการ

// ไม่แนะนำให้ import * จากทั้งสองไฟล์พร้อมกัน เนื่องจากมีการ export ชื่อซ้ำกัน
// ให้ใช้ getSanityClient แทน

// ฟังก์ชันสำหรับเรียกใช้ client ตาม runtime
export function getSanityClient(runtime: 'edge' | 'nodejs' = 'edge') {
  if (runtime === 'edge') {
    // Dynamic import เพื่อให้ Next.js สามารถแยก code splitting ได้
    return import('./sanity-edge').then(module => module.client)
  }
  return import('./sanity-node').then(module => module.client)
}

// ฟังก์ชันสำหรับเรียกใช้ API เฉพาะใน Edge
export async function getEdgeApis() {
  const edge = await import('./sanity-edge')
  return {
    getProductsForEdge: edge.getProductsForEdge,
    searchProducts: edge.searchProducts
  }
}

// ฟังก์ชันสำหรับเรียกใช้ API เฉพาะใน Node.js
export async function getNodeApis() {
  const node = await import('./sanity-node')
  return {
    getProducts: node.getProducts,
    createOrder: node.createOrder,
    uploadImage: node.uploadImage,
    urlFor: node.urlFor
  }
} 
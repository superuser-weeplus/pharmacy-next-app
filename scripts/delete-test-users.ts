/**
 * สคริปต์สำหรับลบข้อมูลผู้ใช้ทดสอบ
 * วิธีใช้: tsx scripts/delete-test-users.ts
 */

import { createClient } from '@sanity/client';
import { config } from 'dotenv';
import { resolve } from 'path';

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
config({ path: resolve(__dirname, '../.env') });

// ตรวจสอบว่ามีตัวแปรที่จำเป็นครบหรือไม่
const requiredEnvVars = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// สร้าง Client ด้วยข้อมูลเชื่อมต่อ Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false, // ไม่ใช้ CDN สำหรับการเขียนข้อมูล
  apiVersion: '2025-04-08'
});

// อีเมลของผู้ใช้ทดสอบที่ต้องการลบ
const testEmails = [
  'admin@example.com',
  'staff@example.com',
  'customer1@example.com',
  'customer2@example.com',
  'suspended@example.com',
];

// ฟังก์ชันสำหรับลบผู้ใช้ทดสอบ
async function deleteTestUsers(): Promise<void> {
  console.log('เริ่มการลบผู้ใช้ทดสอบ...');
  
  for (const email of testEmails) {
    try {
      // ค้นหาผู้ใช้จากอีเมล
      const user = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        { email }
      );
      
      if (!user) {
        console.log(`ไม่พบผู้ใช้ ${email}`);
        continue;
      }
      
      // ลบบัญชีที่เกี่ยวข้องก่อน
      await client.delete({ 
        query: `*[_type == "account" && userId == $userId]`,
        params: { userId: user._id }
      });
      
      // ลบเซสชันที่เกี่ยวข้อง
      await client.delete({
        query: `*[_type == "session" && userId == $userId]`,
        params: { userId: user._id }
      });
      
      // ลบผู้ใช้
      await client.delete(user._id);
      
      console.log(`ลบผู้ใช้ ${email} สำเร็จ`);
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการลบผู้ใช้ ${email}:`, error);
    }
  }
  
  console.log('ลบผู้ใช้ทดสอบเสร็จสิ้น');
}

// ฟังก์ชันหลัก
async function main(): Promise<void> {
  try {
    await deleteTestUsers();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการรันสคริปต์:', error);
    process.exit(1);
  }
}

// รันฟังก์ชันหลัก
main(); 
/**
 * สคริปต์สำหรับสร้างข้อมูลทดสอบสำหรับผู้ใช้งานและบทบาท
 * วิธีใช้: node scripts/seed-users.js
 */

const { createClient } = require('@sanity/client');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// สร้าง Client ด้วยข้อมูลเชื่อมต่อ Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false, // ไม่ใช้ CDN สำหรับการเขียนข้อมูล
  apiVersion: '2025-04-08'
});

// ฟังก์ชันสำหรับการแฮชรหัสผ่าน
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// กลุ่มผู้ใช้ทดสอบ
const testUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    status: 'active'
  },
  {
    name: 'Staff User',
    email: 'staff@example.com',
    password: 'staff123',
    role: 'staff',
    status: 'active'
  },
  {
    name: 'Customer 1',
    email: 'customer1@example.com',
    password: 'customer123',
    role: 'customer',
    status: 'active'
  },
  {
    name: 'Customer 2',
    email: 'customer2@example.com',
    password: 'customer123',
    role: 'customer',
    status: 'pending'
  },
  {
    name: 'Suspended User',
    email: 'suspended@example.com',
    password: 'suspended123',
    role: 'customer',
    status: 'suspended'
  }
];

// สร้างผู้ใช้
async function createTestUsers() {
  console.log('เริ่มการสร้างผู้ใช้ทดสอบ...');
  
  for (const user of testUsers) {
    try {
      // ตรวจสอบว่ามีผู้ใช้อยู่แล้วหรือไม่
      const existingUser = await client.fetch(
        `*[_type == "user" && email == $email][0]`,
        { email: user.email }
      );
      
      if (existingUser) {
        console.log(`ผู้ใช้ ${user.email} มีอยู่แล้ว ข้ามการสร้าง`);
        continue;
      }
      
      // แฮชรหัสผ่าน
      const passwordHash = await hashPassword(user.password);
      
      // สร้างผู้ใช้ใหม่
      const newUser = {
        _id: `user.${uuidv4()}`,
        _type: 'user',
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
        status: user.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const result = await client.create(newUser);
      console.log(`สร้างผู้ใช้ ${user.email} สำเร็จ: ${result._id}`);
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการสร้างผู้ใช้ ${user.email}:`, error);
    }
  }
  
  console.log('สร้างผู้ใช้ทดสอบเสร็จสิ้น');
}

// ฟังก์ชันหลัก
async function main() {
  try {
    await createTestUsers();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการรันสคริปต์:', error);
    process.exit(1);
  }
}

// รันฟังก์ชันหลัก
main(); 
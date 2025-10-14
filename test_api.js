// Simple API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing School Mark Management API...\n');

    // Test 1: Ping endpoint
    console.log('1. Testing ping endpoint...');
    const pingResponse = await axios.get(`${BASE_URL}/ping`);
    console.log('✅ Ping:', pingResponse.data);

    // Test 2: Admin login
    console.log('\n2. Testing admin login...');
    const adminLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@school.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin login successful');
    const adminToken = adminLogin.data.token;

    // Test 3: Teacher login
    console.log('\n3. Testing teacher login...');
    const teacherLogin = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'alice@school.com',
      password: 'teacher123',
      role: 'teacher'
    });
    console.log('✅ Teacher login successful');
    const teacherToken = teacherLogin.data.token;

    // Test 4: Get teachers (admin)
    console.log('\n4. Testing get teachers (admin)...');
    const teachers = await axios.get(`${BASE_URL}/admin/teachers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Teachers retrieved:', teachers.data.length, 'teachers');

    // Test 5: Get students (admin)
    console.log('\n5. Testing get students (admin)...');
    const students = await axios.get(`${BASE_URL}/admin/students`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Students retrieved:', students.data.length, 'students');

    // Test 6: Get subjects (admin)
    console.log('\n6. Testing get subjects (admin)...');
    const subjects = await axios.get(`${BASE_URL}/admin/subjects`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Subjects retrieved:', subjects.data.length, 'subjects');

    // Test 7: Add a mark (teacher)
    console.log('\n7. Testing add mark (teacher)...');
    const addMark = await axios.post(`${BASE_URL}/teacher/marks`, {
      student_id: 1,
      subject_id: 1,
      term: 'Term1',
      mark: 85
    }, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    console.log('✅ Mark added:', addMark.data);

    // Test 8: Get marks for student (teacher)
    console.log('\n8. Testing get marks for student (teacher)...');
    const studentMarks = await axios.get(`${BASE_URL}/teacher/marks/1`, {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    console.log('✅ Student marks retrieved:', studentMarks.data);

    // Test 9: Get all marks (admin)
    console.log('\n9. Testing get all marks (admin)...');
    const allMarks = await axios.get(`${BASE_URL}/admin/marks`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ All marks retrieved:', allMarks.data.length, 'marks');

    console.log('\n🎉 All tests passed! API is ready for frontend integration.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;

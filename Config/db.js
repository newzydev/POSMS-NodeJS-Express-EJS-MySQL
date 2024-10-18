// Database Config
const mysql = require('mysql');

// Function ในการสร้าง return การเชื่อมต่อฐานข้อมูล
const connectDB = () => {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'point_of_sale_management_system'
    });

    // เชื่อมต่อ database
    db.connect((err) => {
        if (err) {
            console.error('Database connection error:', err);
            throw err;
        }
        console.log('Server Connect: Connected to database successfully');
    });

    return db;
};

// Export the connectDB function
module.exports = connectDB;















// const mysql = require('mysql'); // นำเข้าชุดคำสั่งสำหรับใช้งาน MySQL

// let pool; // ประกาศตัวแปร pool เพื่อเก็บการเชื่อมต่อฐานข้อมูล

// // ฟังก์ชันสำหรับเริ่มการเชื่อมต่อกับฐานข้อมูลแบบ connection pool
// const initDB = () => {
//     pool = mysql.createPool({ // สร้าง connection pool สำหรับการเชื่อมต่อหลายครั้งพร้อมกัน
//         connectionLimit: 10, // กำหนดจำนวนการเชื่อมต่อสูงสุดที่ทำได้ในเวลาเดียวกัน
//         host: 'localhost', // ตั้งค่าโฮสต์ฐานข้อมูลเป็น localhost
//         user: 'root', // ตั้งค่าผู้ใช้ฐานข้อมูลเป็น root
//         password: 'root', // ตั้งค่ารหัสผ่านของผู้ใช้ฐานข้อมูล
//         database: 'point_of_sale_management_system', // ชื่อฐานข้อมูลที่ต้องการเชื่อมต่อ
//         connectTimeout: 10000, // ระยะเวลารอในการเชื่อมต่อ (10 วินาที)
//         acquireTimeout: 10000, // ระยะเวลารอให้เชื่อมต่อสำเร็จ (10 วินาที)
//         timeout: 60000, // ระยะเวลารอการเชื่อมต่อครั้งเดียว (60 วินาที)
//         waitForConnections: true, // รอหากไม่มีการเชื่อมต่อที่พร้อมใช้งาน
//         queueLimit: 0, // ไม่จำกัดจำนวนการเชื่อมต่อที่รอในคิว
//         debug: false, // ปิดการทำงาน debug mode
//         multipleStatements: true, // อนุญาตให้ใช้หลายคำสั่ง SQL ในการเชื่อมต่อเดียว
//         keepAliveInitialDelay: 30000, // ตั้งค่าระยะเวลารอในการส่งสัญญาณ keep-alive ครั้งแรก (30 วินาที)
//         keepAlive: true, // เปิดการใช้งานสัญญาณ keep-alive เพื่อรักษาการเชื่อมต่อ
//     });

//     // จัดการข้อผิดพลาดการเชื่อมต่อ
//     pool.on('connection', (connection) => { // เมื่อมีการเชื่อมต่อเกิดขึ้น
//         console.log('Database: Connected successfully.'); // แสดงข้อความว่าเชื่อมต่อสำเร็จ
//         connection.on('error', (err) => { // จัดการข้อผิดพลาดที่เกิดขึ้นในระหว่างเชื่อมต่อ
//             console.error('Database connection error:', err); // แสดงข้อผิดพลาดในการเชื่อมต่อ
//             if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') { 
//                 // กรณีที่การเชื่อมต่อหลุดหรือรีเซ็ต หรือการเชื่อมต่อล้มเหลวจาก timeout
//                 console.log('Database: Connection lost, attempting to reconnect...'); // แสดงข้อความว่ากำลังพยายามเชื่อมต่อใหม่
//                 reconnectDB(); // เรียกใช้ฟังก์ชัน reconnectDB เพื่อเชื่อมต่อใหม่
//             } else {
//                 throw err; // หากเป็นข้อผิดพลาดอื่น ให้โยนข้อผิดพลาดนั้นออกมา
//             }
//         });
//     });

//     // เมื่อมีการเชื่อมต่อที่ถูกยึดครอง (acquire)
//     pool.on('acquire', (connection) => {
//         console.log('Connection %d acquired', connection.threadId); // แสดงข้อความเมื่อมีการเชื่อมต่อที่ถูกยึดครองพร้อมหมายเลข thread ID
//     });

//     // เมื่อมีการรอการเชื่อมต่อในคิว
//     pool.on('enqueue', () => {
//         console.log('Waiting for available connection slot'); // แสดงข้อความเมื่อไม่มีการเชื่อมต่อที่พร้อมใช้งานและต้องรอในคิว
//     });

//     // เมื่อมีการปล่อยการเชื่อมต่อออกไป (release)
//     pool.on('release', (connection) => {
//         console.log('Connection %d released', connection.threadId); // แสดงข้อความเมื่อการเชื่อมต่อถูกปล่อยคืนพร้อม thread ID
//     });
// };

// // ฟังก์ชันสำหรับจัดการการเชื่อมต่อใหม่
// const reconnectDB = () => {
//     console.log('Reconnecting to database...'); // แสดงข้อความว่ากำลังพยายามเชื่อมต่อใหม่
//     pool.end((err) => { // ปิด pool เก่า
//         if (err) {
//             console.error('Error during reconnection:', err); // แสดงข้อผิดพลาดระหว่างการเชื่อมต่อใหม่
//         } else {
//             console.log('Reconnection complete, reinitializing database connection...'); // แสดงข้อความว่าเชื่อมต่อใหม่เสร็จสมบูรณ์และกำลังเริ่มต้นเชื่อมต่อใหม่
//             initDB(); // เรียกใช้ฟังก์ชัน initDB เพื่อสร้างการเชื่อมต่อใหม่
//         }
//     });
// };

// // เริ่มต้นการเชื่อมต่อฐานข้อมูลครั้งแรก
// initDB();

// // ส่งออก pool สำหรับการใช้งานในการ query ฐานข้อมูล
// module.exports = pool; // ส่งออก pool เพื่อให้สามารถใช้งานได้ในไฟล์อื่น

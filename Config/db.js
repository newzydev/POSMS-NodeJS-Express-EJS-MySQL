const mysql = require('mysql');

// ฟังก์ชันสำหรับสร้างการเชื่อมต่อใหม่เมื่อเกิดปัญหา connection lost
const handleDisconnect = () => {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'point_of_sale_management_system',
        connectTimeout: 10000, // 10 วินาที
        acquireTimeout: 10000, // 10 วินาทีสำหรับรอการดึง connection จาก pool
        timeout: 60000, // เวลารวมสูงสุดในการประมวลผล query คือ 1 นาที
        reconnect: true // เปิดการเชื่อมต่ออัตโนมัติเมื่อ connection หลุด
    });

    // เชื่อมต่อ database
    db.connect((err) => {
        if (err) {
            console.error('Database connection error:', err);
            setTimeout(handleDisconnect, 2000); // ลองเชื่อมต่อใหม่หลังจาก 2 วินาที
        } else {
            console.log('Server Connect: Connected to database successfully');
        }
    });

    // จัดการ error เมื่อเกิด connection lost หรือปัญหาอื่นๆ
    db.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Attempting to reconnect...');
            handleDisconnect(); // เรียกฟังก์ชันเชื่อมต่อใหม่
        } else if (err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
            console.log('Connection timed out. Reconnecting...');
            handleDisconnect();
        } else {
            throw err;
        }
    });

    return db;
};

// Export the handleDisconnect function
module.exports = handleDisconnect;

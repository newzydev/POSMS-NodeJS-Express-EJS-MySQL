// Database Config
const mysql = require('mysql');

// สร้าง pool สำหรับจัดการการเชื่อมต่อหลายๆ การเชื่อมต่อพร้อมกัน
const pool = mysql.createPool({
    connectionLimit: 10, // จำนวน connection สูงสุดที่ pool สามารถเก็บได้
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'point_of_sale_management_system'
});

// ฟังก์ชันสำหรับสร้างการเชื่อมต่อใหม่เมื่อเกิดปัญหา connection lost
const handleDisconnect = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection lost:', err);
                setTimeout(handleDisconnect, 2000); // ลองเชื่อมต่อใหม่หลังจาก 2 วินาที
            } else {
                console.error('Database connection error:', err);
            }
        }

        if (connection) {
            console.log('Server Connect: Connected to database successfully');
            connection.release(); // คืน connection ให้ pool
        }
    });

    // จัดการ error เมื่อเกิด connection lost
    pool.on('error', (err) => {
        console.error('Database pool error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Attempting to reconnect...');
            handleDisconnect(); // เรียกฟังก์ชันเชื่อมต่อใหม่
        } else {
            throw err;
        }
    });
};

// Export the handleDisconnect function
module.exports = handleDisconnect;
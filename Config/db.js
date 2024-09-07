// Database Config
const mysql = require('mysql');

// ฟังก์ชันสำหรับสร้างการเชื่อมต่อใหม่เมื่อเกิดปัญหา connection lost
const handleDisconnect = () => {
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
            setTimeout(handleDisconnect, 2000); // ลองเชื่อมต่อใหม่หลังจาก 2 วินาที
        } else {
            console.log('Server Connect: Connected to database successfully');
        }
    });

    // จัดการ error เมื่อเกิด connection lost
    db.on('error', (err) => {
        console.error('Database error:', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Attempting to reconnect...');
            handleDisconnect(); // เรียกฟังก์ชันเชื่อมต่อใหม่
        } else {
            throw err;
        }
    });

    return db;
};

// Export the handleDisconnect function
module.exports = handleDisconnect;
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
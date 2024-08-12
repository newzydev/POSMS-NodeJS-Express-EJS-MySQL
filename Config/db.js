// Config/db.js
const mysql = require('mysql');

// Function to create and return the database connection
const connectDB = () => {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'point_of_sale_management_system'
    });

    // Connect to the database
    db.connect((err) => {
        if (err) {
            console.error('Database connection error:', err);
            throw err;
        }
        console.log('Server Connect: Connected to database successfully');
    });

    return db;
};

// Export the connection function
module.exports = connectDB;
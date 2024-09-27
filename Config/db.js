const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10, // Adjust this limit as per your need
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'point_of_sale_management_system',
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 60000,
});

const connectDB = () => {
    pool.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.');
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.');
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.');
            }
            if (err.code === 'ETIMEDOUT') {
                console.error('Connection timeout.');
            }
            setTimeout(connectDB, 2000); // Reattempt connection
        }

        if (connection) connection.release();

        return;
    });

    pool.on('error', (err) => {
        console.error('Database error:', err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
            console.log('Database: Reconnecting...');
            connectDB();
        } else {
            throw err;
        }
    });
};

module.exports = connectDB;
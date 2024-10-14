const mysql = require('mysql');

// Function to handle reconnection and database initialization
const connectDB = () => {
    const db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'point_of_sale_management_system',
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 60000,
        keepAlive: true
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(connectDB, 2000); // Attempt reconnection after 2 seconds
        } else {
            console.log('Database: Connected successfully.');
        }
    });

    db.on('error', (err) => {
        console.error('Database error:', err);

        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
            console.log('Database: Reconnecting to database...');
            connectDB(); // Reconnect on connection loss
        } else {
            throw err; // Throw the error for other types
        }
    });

    return db; // Return the initialized db connection
};

// Export the connectDB function
module.exports = connectDB;

const mysql = require('mysql');

let db;

const handleDisconnect = () => {
    db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'point_of_sale_management_system',
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 60000,
    });

    db.connect((err) => {
        if (err) {
            console.error('Error connecting to database:', err);
            setTimeout(handleDisconnect, 2000); // Attempt reconnection after 2 seconds
        } else {
            console.log('Database connected successfully.');
        }
    });

    db.on('error', (err) => {
        console.error('Database error:', err);

        // Handle connection lost error
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
            console.log('Reconnecting to database...');
            handleDisconnect(); // Reconnect on connection loss
        } else {
            throw err; // Throw the error for other types
        }
    });
};

// Initialize the database connection
handleDisconnect();

// Export the db object
module.exports = db;

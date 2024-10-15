const mysql = require('mysql');

let pool;

// Function to initialize the database connection pool
const initDB = () => {
    pool = mysql.createPool({
        connectionLimit: 10, // Set limit of concurrent connections
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'point_of_sale_management_system',
        connectTimeout: 10000,
        acquireTimeout: 10000,
        timeout: 60000,
        waitForConnections: true, // Wait for new connection if the pool is full
        queueLimit: 0, // No queue limit
        debug: false, // Disable debug mode
        multipleStatements: true, // Allow multiple SQL statements in one query
        keepAliveInitialDelay: 30000, // Delay for keep-alive
        keepAlive: true,
    });

    // Handle connection errors gracefully
    pool.on('connection', (connection) => {
        console.log('Database: Connected successfully.');
        connection.on('error', (err) => {
            console.error('Database connection error:', err);
            if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT') {
                console.log('Database: Connection lost, attempting to reconnect...');
                reconnectDB(); // Handle reconnection
            } else {
                throw err; // Handle other errors
            }
        });
    });

    pool.on('acquire', (connection) => {
        console.log('Connection %d acquired', connection.threadId);
    });

    pool.on('enqueue', () => {
        console.log('Waiting for available connection slot');
    });

    pool.on('release', (connection) => {
        console.log('Connection %d released', connection.threadId);
    });
};

// Function to handle reconnection
const reconnectDB = () => {
    console.log('Reconnecting to database...');
    pool.end((err) => {
        if (err) {
            console.error('Error during reconnection:', err);
        } else {
            console.log('Reconnection complete, reinitializing database connection...');
            initDB(); // Reinitialize the database connection
        }
    });
};

// Initialize the database connection pool
initDB();

// Export the pool for querying
module.exports = pool;

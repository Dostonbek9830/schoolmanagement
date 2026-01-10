import sql from 'mssql';
// Environment variables are loaded in server.js

// Parse server and instance name
let serverName = process.env.DB_SERVER || 'localhost';
let instanceName = null;

if (serverName.includes('\\')) {
    const parts = serverName.split('\\');
    serverName = parts[0];
    instanceName = parts[1];
}

console.log('Connecting to server:', serverName, instanceName ? `(instance: ${instanceName})` : '');
console.log('Database:', process.env.DB_NAME);
console.log('User:', process.env.DB_USER);

const config = {
    server: serverName,
    database: process.env.DB_NAME || 'SchoolDB',
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true',
        enableArithAbort: true,
        instanceName: instanceName // Use the parsed instance name
    },
    authentication: {
        type: 'default',
        options: {
            userName: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        }
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Use Windows Authentication if specified
if (process.env.DB_INTEGRATED_SECURITY === 'true') {
    config.authentication = {
        type: 'ntlm',
        options: {
            domain: '',
            userName: '',
            password: ''
        }
    };
}

let pool;

export const connectDB = async () => {
    try {
        pool = await sql.connect(config);
        console.log('✅ Connected to SQL Server database:', process.env.DB_NAME);
        return pool;
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
        throw err;
    }
};

export const getPool = () => {
    if (!pool) {
        throw new Error('Database not connected. Call connectDB first.');
    }
    return pool;
};

export { sql };

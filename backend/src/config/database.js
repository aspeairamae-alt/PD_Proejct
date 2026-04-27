import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const baseConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const sslMode = (process.env.DB_SSL_MODE || '').toUpperCase();
const dbSslEnabled = process.env.DB_SSL === 'true' || sslMode === 'REQUIRED';
if (dbSslEnabled) {
  // Aiven typically requires SSL in production.
  if (process.env.DB_SSL_CA_PATH) {
    baseConfig.ssl = {
      ca: fs.readFileSync(process.env.DB_SSL_CA_PATH, 'utf8'),
      rejectUnauthorized: true,
    };
  } else {
    baseConfig.ssl = { rejectUnauthorized: false };
  }
}

const preferredDatabases = [
  process.env.DB_NAME,
  process.env.MYSQLDATABASE,
  'PipeDamageMonitoringSystem',
  'defaultdb',
].filter(Boolean);

const databaseCandidates = [...new Set(preferredDatabases)];

const findDatabaseWithSchema = async () => {
  if (databaseCandidates.length === 0) return 'PipeDamageMonitoringSystem';

  const testConnection = await mysql.createConnection(baseConfig);
  try {
    for (const dbName of databaseCandidates) {
      try {
        await testConnection.query(
          `SELECT 1 FROM \`${dbName}\`.\`RESIDENT\` LIMIT 1`
        );
        return dbName;
      } catch {
        // Try next candidate.
      }
    }
    return databaseCandidates[0];
  } finally {
    await testConnection.end();
  }
};

const resolvedDatabase = await findDatabaseWithSchema();
console.log(`[DB] Using database: ${resolvedDatabase}`);

export const pool = mysql.createPool({
  ...baseConfig,
  database: resolvedDatabase,
});

export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;

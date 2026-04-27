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
const tableKeys = ['resident', 'water_workstaff', 'damagereport', 'statusnotification'];

const findDatabaseWithSchema = async () => {
  if (databaseCandidates.length === 0) return 'PipeDamageMonitoringSystem';

  const testConnection = await mysql.createConnection(baseConfig);
  try {
    for (const dbName of databaseCandidates) {
      try {
        const [tables] = await testConnection.execute(
          `
            SELECT TABLE_NAME
            FROM INFORMATION_SCHEMA.TABLES
            WHERE TABLE_SCHEMA = ?
              AND LOWER(TABLE_NAME) IN (${tableKeys.map(() => '?').join(',')})
          `,
          [dbName, ...tableKeys]
        );
        if (tables.length > 0) return dbName;
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

const resolveTableMap = async () => {
  const connection = await mysql.createConnection({
    ...baseConfig,
    database: resolvedDatabase,
  });
  try {
    const [tables] = await connection.execute(
      `
        SELECT TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_SCHEMA = ?
          AND LOWER(TABLE_NAME) IN (${tableKeys.map(() => '?').join(',')})
      `,
      [resolvedDatabase, ...tableKeys]
    );

    const byLowerName = Object.fromEntries(
      tables.map((row) => [row.TABLE_NAME.toLowerCase(), row.TABLE_NAME])
    );

    return {
      resident: byLowerName.resident || 'resident',
      waterWorkStaff: byLowerName.water_workstaff || 'water_workstaff',
      damageReport: byLowerName.damagereport || 'damagereport',
      statusNotification: byLowerName.statusnotification || 'statusnotification',
    };
  } finally {
    await connection.end();
  }
};

export const TABLES = await resolveTableMap();
console.log('[DB] Table mapping:', TABLES);

export const pool = mysql.createPool({
  ...baseConfig,
  database: resolvedDatabase,
});

export const getConnection = async () => {
  return await pool.getConnection();
};

export default pool;

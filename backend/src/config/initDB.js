import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createDatabase = async () => {
  try {
    // Connect without specifying database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306,
    });

    console.log('Connected to MySQL Server');

    // Create database
    const dbName = process.env.DB_NAME || 'PipeDamageMonitoringSystem';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`Database '${dbName}' created or already exists`);

    // Switch to the new database
    await connection.query(`USE ${dbName}`);

    // Create RESIDENT table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS RESIDENT (
        Resident_ID INT AUTO_INCREMENT PRIMARY KEY,
        Full_Name VARCHAR(100) NOT NULL,
        Username VARCHAR(50) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        Address VARCHAR(255)
      )
    `);
    console.log('✓ RESIDENT table created');

    // Create WATER_WORKSTAFF table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS WATER_WORKSTAFF (
        Water_Work_Staff_ID INT AUTO_INCREMENT PRIMARY KEY,
        Full_Name VARCHAR(100) NOT NULL,
        Position VARCHAR(50),
        Username VARCHAR(50) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL
      )
    `);
    console.log('✓ WATER_WORKSTAFF table created');

    // Create DAMAGEREPORT table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS DAMAGEREPORT (
        Report_ID INT AUTO_INCREMENT PRIMARY KEY,
        Reporter_Name VARCHAR(100) NOT NULL,
        Photo VARCHAR(255),
        Description TEXT,
        DateTime DATETIME NOT NULL,
        Location VARCHAR(255),
        Current_Status VARCHAR(50),
        Resident_ID INT,
        Water_Work_Staff_ID INT,
        FOREIGN KEY (Resident_ID) REFERENCES RESIDENT(Resident_ID) ON DELETE SET NULL,
        FOREIGN KEY (Water_Work_Staff_ID) REFERENCES WATER_WORKSTAFF(Water_Work_Staff_ID) ON DELETE SET NULL
      )
    `);
    console.log('✓ DAMAGEREPORT table created');

    // Create STATUSNOTIFICATION table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS STATUSNOTIFICATION (
        Status_Notif_ID INT AUTO_INCREMENT PRIMARY KEY,
        Report_ID INT NOT NULL,
        Resident_ID INT NOT NULL,
        Message TEXT NOT NULL,
        Date_Sent DATETIME NOT NULL,
        FOREIGN KEY (Report_ID) REFERENCES DAMAGEREPORT(Report_ID) ON DELETE CASCADE,
        FOREIGN KEY (Resident_ID) REFERENCES RESIDENT(Resident_ID) ON DELETE CASCADE
      )
    `);
    console.log('✓ STATUSNOTIFICATION table created');

    // Optional: Insert default Water Work Staff admin
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const [existingAdmin] = await connection.execute(
      'SELECT * FROM WATER_WORKSTAFF WHERE Username = ?',
      [adminUsername]
    );

    if (existingAdmin.length === 0) {
      await connection.execute(
        'INSERT INTO WATER_WORKSTAFF (Full_Name, Position, Username, Password) VALUES (?, ?, ?, ?)',
        ['Admin User', 'Administrator', adminUsername, hashedPassword]
      );
      console.log('✓ Default water work staff admin created (username: admin, password: admin123)');
    }

    await connection.end();
    console.log('\n✓ Database initialization completed successfully!');
    console.log('Note: Change the default admin password in the database after first login.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
};

createDatabase();

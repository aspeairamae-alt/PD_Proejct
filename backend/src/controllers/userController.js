import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/database.js';

export const registerUser = async (req, res) => {
  try {
    const { name, username, password, address, role = 'resident' } = req.body;

    if (!name || !username || !password) {
      return res.status(400).json({ error: 'Name, username, and password are required' });
    }

    const connection = await getConnection();
    
    try {
      // Check if user already exists
      let table = role === 'staff' ? 'water_workstaff' : 'resident';
      const [existing] = await connection.execute(
        `SELECT * FROM ${table} WHERE Username = ?`,
        [username]
      );

      if (existing.length > 0) {
        return res.status(400).json({ error: 'Username already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      let result;
      // Create user in appropriate table
      if (role === 'staff') {
        [result] = await connection.execute(
          'INSERT INTO water_workstaff (Full_Name, Username, Password) VALUES (?, ?, ?)',
          [name, username, hashedPassword]
        );
      } else {
        [result] = await connection.execute(
          'INSERT INTO resident (Full_Name, Username, Password, Address) VALUES (?, ?, ?, ?)',
          [name, username, hashedPassword, address || null]
        );
      }

      const userId = result.insertId;
      const token = jwt.sign(
        { id: userId, username: username, role: role },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: userId,
          name: name,
          username: username,
          address: address || null,
          role: role,
        }
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const connection = await getConnection();

    try {
      // Try resident first
      let [users] = await connection.execute(
        'SELECT * FROM resident WHERE Username = ?',
        [username]
      );

      let role = 'resident';
      let user = null;

      if (users.length > 0) {
        user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
      } else {
        // Try staff
        [users] = await connection.execute(
          'SELECT * FROM water_workstaff WHERE Username = ?',
          [username]
        );

        if (users.length === 0) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }

        user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);
        if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid username or password' });
        }
        role = 'admin';
      }

      // Get address for resident
      let address = null;
      if (role === 'resident') {
        address = user.Address || null;
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.Resident_ID || user.Water_Work_Staff_ID, username: user.Username, role: role },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user.Resident_ID || user.Water_Work_Staff_ID,
          name: user.Full_Name,
          username: user.Username,
          address: address,
          role: role,
        },
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    try {
      // Try resident first
      let [users] = await connection.execute(
        'SELECT Resident_ID as id, Full_Name as name, Username as username FROM resident WHERE Resident_ID = ?',
        [id]
      );

      if (users.length === 0) {
        // Try staff
        [users] = await connection.execute(
          'SELECT Water_Work_Staff_ID as id, Full_Name as name, Username as username, Position FROM water_workstaff WHERE Water_Work_Staff_ID = ?',
          [id]
        );

        if (users.length === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({ ...users[0], role: 'staff' });
      } else {
        // Get address for resident
        const address = users[0].address || users[0].Address || null;
        res.json({ ...users[0], address: address, role: 'resident' });
      }
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: error.message });
  }
};

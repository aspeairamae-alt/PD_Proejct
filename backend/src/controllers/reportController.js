import { getConnection, TABLES } from '../config/database.js';

export const createReport = async (req, res) => {
  try {
    const { description, location, reporterName, residentId, photo } = req.body;

    if (!description || !location || !reporterName) {
      return res.status(400).json({ error: 'Description, location, and reporter name are required' });
    }

    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        `INSERT INTO \`${TABLES.damageReport}\` (Reporter_Name, Description, Location, DateTime, Current_Status, Resident_ID, Photo) VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
        [reporterName, description, location, 'Pending', residentId || null, photo || null]
      );

      res.status(201).json({ 
        id: result.insertId,
        message: 'Report created successfully' 
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const { status, residentId } = req.query;
    const connection = await getConnection();

    try {
      let query = `
        SELECT dr.* 
        FROM \`${TABLES.damageReport}\` dr
      `;
      const params = [];
      const filters = [];

      if (status) {
        filters.push('dr.Current_Status = ?');
        params.push(status);
      }

      if (residentId) {
        filters.push('dr.Resident_ID = ?');
        params.push(residentId);
      }

      if (filters.length > 0) {
        query += ' WHERE ' + filters.join(' AND ');
      }

      query += ' ORDER BY dr.DateTime DESC';

      const [reports] = await connection.execute(query, params);
      res.json(reports);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    try {
      const [reports] = await connection.execute(
        `SELECT * FROM \`${TABLES.damageReport}\` WHERE Report_ID = ?`,
        [id]
      );

      if (reports.length === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json(reports[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Ongoing', 'Fixed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        `UPDATE \`${TABLES.damageReport}\` SET Current_Status = ? WHERE Report_ID = ?`,
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }

      // Notify the resident who submitted the report
      const [reports] = await connection.execute(
        `SELECT Resident_ID FROM \`${TABLES.damageReport}\` WHERE Report_ID = ?`,
        [id]
      );

      if (reports.length > 0 && reports[0].Resident_ID) {
        await connection.execute(
          `INSERT INTO \`${TABLES.statusNotification}\` (Report_ID, Resident_ID, Message, Date_Sent) VALUES (?, ?, ?, NOW())`,
          [id, reports[0].Resident_ID, `Report #${id} status updated to ${status}`]
        );
      }

      res.json({ message: 'Report status updated successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        `DELETE FROM \`${TABLES.damageReport}\` WHERE Report_ID = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Report not found' });
      }

      res.json({ message: 'Report deleted successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete report error:', error);
    res.status(500).json({ error: error.message });
  }
};

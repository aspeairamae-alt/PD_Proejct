import { getConnection } from '../config/database.js';

export const getNotifications = async (req, res) => {
  try {
    const { residentId } = req.params;
    const connection = await getConnection();

    try {
      const query = 'SELECT * FROM statusnotification WHERE Resident_ID = ? ORDER BY Date_Sent DESC';
      const [notifications] = await connection.execute(query, [residentId]);
      res.json(notifications);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        'DELETE FROM statusnotification WHERE Status_Notif_ID = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ message: 'Notification marked as read' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Mark notification error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    try {
      const [result] = await connection.execute(
        'DELETE FROM statusnotification WHERE Status_Notif_ID = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      res.json({ message: 'Notification deleted successfully' });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: error.message });
  }
};

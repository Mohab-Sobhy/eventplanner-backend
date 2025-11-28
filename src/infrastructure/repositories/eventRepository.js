import pool from '../database/connection.js';

class EventRepository {
  async create(title, eventDate, eventTime, location, description, organizerId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create event
      const eventQuery = `
        INSERT INTO events (title, event_date, event_time, location, description)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const eventResult = await client.query(eventQuery, [
        title,
        eventDate,
        eventTime,
        location,
        description,
      ]);

      const event = eventResult.rows[0];

      // Get organizer role_id
      const roleQuery = `SELECT id FROM roles WHERE role = 'organizer'`;
      const roleResult = await client.query(roleQuery);
      const roleId = roleResult.rows[0].id;

      // Create event_attendance entry for organizer
      const attendanceQuery = `
        INSERT INTO event_attendance (event_id, user_id, role_id)
        VALUES ($1, $2, $3)
      `;
      await client.query(attendanceQuery, [event.id, organizerId, roleId]);

      await client.query('COMMIT');
      return event;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findById(eventId) {
    const query = 'SELECT * FROM events WHERE id = $1';
    const result = await pool.query(query, [eventId]);
    return result.rows[0] || null;
  }

  async findByOrganizer(userId) {
    const query = `
      SELECT e.*, r.role
      FROM events e
      INNER JOIN event_attendance ea ON e.id = ea.event_id
      INNER JOIN roles r ON ea.role_id = r.id
      WHERE ea.user_id = $1 AND r.role = 'organizer'
      ORDER BY e.event_date DESC, e.event_time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async findByAttendee(userId) {
    const query = `
      SELECT e.*, r.role, s.status
      FROM events e
      INNER JOIN event_attendance ea ON e.id = ea.event_id
      INNER JOIN roles r ON ea.role_id = r.id
      LEFT JOIN statuses s ON ea.status_id = s.id
      WHERE ea.user_id = $1 AND r.role = 'attendee'
      ORDER BY e.event_date DESC, e.event_time DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  async delete(eventId, organizerId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verify user is organizer
      const checkQuery = `
        SELECT ea.role_id, r.role
        FROM event_attendance ea
        INNER JOIN roles r ON ea.role_id = r.id
        WHERE ea.event_id = $1 AND ea.user_id = $2
      `;
      const checkResult = await client.query(checkQuery, [eventId, organizerId]);

      if (!checkResult.rows[0] || checkResult.rows[0].role !== 'organizer') {
        throw new Error('Only organizer can delete event');
      }

      // Delete event (cascade will handle event_attendance)
      const deleteQuery = 'DELETE FROM events WHERE id = $1 RETURNING *';
      const result = await client.query(deleteQuery, [eventId]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async inviteUser(eventId, userId, inviterId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Verify inviter is organizer
      const checkQuery = `
        SELECT ea.role_id, r.role
        FROM event_attendance ea
        INNER JOIN roles r ON ea.role_id = r.id
        WHERE ea.event_id = $1 AND ea.user_id = $2
      `;
      const checkResult = await client.query(checkQuery, [eventId, inviterId]);

      if (!checkResult.rows[0] || checkResult.rows[0].role !== 'organizer') {
        throw new Error('Only organizer can invite users');
      }

      // Check if user is already invited
      const existingQuery = `
        SELECT * FROM event_attendance
        WHERE event_id = $1 AND user_id = $2
      `;
      const existingResult = await client.query(existingQuery, [eventId, userId]);

      if (existingResult.rows.length > 0) {
        throw new Error('User is already invited to this event');
      }

      // Get attendee role_id
      const roleQuery = `SELECT id FROM roles WHERE role = 'attendee'`;
      const roleResult = await client.query(roleQuery);
      const roleId = roleResult.rows[0].id;

      // Create invitation
      const inviteQuery = `
        INSERT INTO event_attendance (event_id, user_id, role_id)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const result = await client.query(inviteQuery, [eventId, userId, roleId]);

      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async findAttendeesInEvent(userId, eventId) {

    const checkQuery = `
      SELECT ea.role_id, r.role
      FROM event_attendance ea
      INNER JOIN roles r ON ea.role_id = r.id
      WHERE ea.event_id = $1 AND ea.user_id = $2
    `;

    const checkResult = await pool.query(checkQuery, [eventId, userId]);

    if (!checkResult.rows[0] || checkResult.rows[0].role !== 'organizer') {
      throw new Error('Only organizer can view attendees');
    }

    const getAttendeesQuery = `
      SELECT u.first_name, u.last_name, s.status
      FROM event_attendance ea
      INNER JOIN users u ON ea.user_id = u.id
      LEFT JOIN statuses s ON ea.status_id = s.id
      INNER JOIN roles r ON ea.role_id = r.id
      WHERE ea.event_id = $1 AND r.role = 'attendee'
    `;

    const result = await pool.query(getAttendeesQuery, [eventId]);
    return result.rows;
  }

  async updateAttendeeStatus(userId, eventId, status) { 
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const checkQuery = `
        SELECT ea.role_id, r.role
        FROM event_attendance ea
        INNER JOIN roles r ON ea.role_id = r.id 
        WHERE ea.event_id = $1 AND ea.user_id = $2
      `;

      const checkResult = await client.query(checkQuery, [eventId, userId]);

      if (!checkResult.rows[0] || checkResult.rows[0].role !== 'attendee') {
        throw new Error('Only attendees can set their status');
      }

      const statusIdQuery = `SELECT id FROM statuses WHERE status = $1`;
      const statusIdResult = await client.query(statusIdQuery, [status]);

      if (statusIdResult.rows.length === 0) {
        throw new Error('Invalid status provided');
      }
      const statusId = statusIdResult.rows[0].id;

      const updateStatusQuery = `
        UPDATE event_attendance
        SET status_id = $1
        WHERE event_id = $2 AND user_id = $3
        RETURNING *
      `;
      
      const result = await client.query(updateStatusQuery, [statusId, eventId, userId]);

      await client.query('COMMIT');
      return result.rows[0];

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async search(userId, filters) {
    const { name, date, role } = filters;
    
    const params = [userId]; 
    let paramCount = 1;

    let query = `
      SELECT e.*, r.role, s.status
      FROM events e
      INNER JOIN event_attendance ea ON e.id = ea.event_id
      INNER JOIN roles r ON ea.role_id = r.id
      LEFT JOIN statuses s ON ea.status_id = s.id
      WHERE ea.user_id = $1
    `;

    if (name) {
      paramCount++;
      query += ` AND (e.title ILIKE $${paramCount} OR e.description ILIKE $${paramCount})`;
      params.push(`%${name}%`);
    }

    if (date) {
      paramCount++;
      query += ` AND e.event_date >= $${paramCount}`;
      params.push(date);
    }

    if (role) {
      paramCount++;
      query += ` AND r.role = $${paramCount}`;
      params.push(role.toLowerCase());
    }

    query += ` ORDER BY e.event_date ASC`;

    const result = await pool.query(query, params);
    return result.rows;
  }

}

export default new EventRepository();





import eventUseCases from '../../application/usecases/eventUseCases.js';
import { success, fail, error } from '../../utils/jsend.js';

class EventController {
  async createEvent(req, res) {
    try {
      const { title, eventDate, eventTime, location, description } = req.body;
      const userId = req.user.userId;

      const event = await eventUseCases.createEvent(
        title,
        eventDate,
        eventTime,
        location,
        description,
        userId
      );

      return res.status(201).json(success(event, 'Event created successfully'));
    } catch (err) {
      if (err.message.includes('required')) {
        return res.status(400).json(fail({ validation: err.message }));
      }
      return res.status(500).json(error(err.message));
    }
  }

  async getOrganizedEvents(req, res) {
    try {
      const userId = req.user.userId;
      const events = await eventUseCases.getOrganizedEvents(userId);
      return res.status(200).json(success(events));
    } catch (err) {
      return res.status(500).json(error(err.message));
    }
  }

  async getInvitedEvents(req, res) {
    try {
      const userId = req.user.userId;
      const events = await eventUseCases.getInvitedEvents(userId);
      return res.status(200).json(success(events));
    } catch (err) {
      return res.status(500).json(error(err.message));
    }
  }

  async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const userId = req.user.userId;

      await eventUseCases.deleteEvent(parseInt(eventId), userId);

      return res.status(200).json(success(null, 'Event deleted successfully'));
    } catch (err) {
      if (err.message === 'Event not found') {
        return res.status(404).json(fail({ event: err.message }));
      }
      if (err.message === 'Only organizer can delete event') {
        return res.status(403).json(fail({ permission: err.message }));
      }
      return res.status(500).json(error(err.message));
    }
  }

  async inviteUser(req, res) {
    try {
      const { eventId } = req.params;
      const { email } = req.body;
      const inviterId = req.user.userId;

      if (!email) {
        return res.status(400).json(fail({ email: 'Email is required' }));
      }

      await eventUseCases.inviteUserByEmail(parseInt(eventId), email, inviterId);

      return res.status(200).json(success(null, 'User invited successfully'));
    } catch (err) {
      if (['Event not found', 'User not found'].includes(err.message)) {
        return res.status(404).json(fail({ resource: err.message }));
      }
      if (err.message === 'Only organizer can invite users') {
        return res.status(403).json(fail({ permission: err.message }));
      }
      if (err.message === 'User is already invited to this event') {
        return res.status(409).json(fail({ invitation: err.message }));
      }
      return res.status(500).json(error(err.message));
    }
  }

  async getAttendees(req, res) {
    try {
      const userId = req.user.userId;
      const {eventId} = req.params;
      const attendees = await eventUseCases.getAttendeesInEvent(userId, parseInt(eventId));
      if(attendees.length === 0) {
        return res.status(200).json(success('No Attendees found for this event'));
      }
      return res.status(200).json(success(attendees));
    }
    catch (err) {
    if (err.message === 'Event not found') {
      return res.status(404).json(fail({ event: err.message }));
    }
    if (err.message === 'Only organizer can view attendees') { 
      return res.status(403).json(fail({ permission: err.message }));
    }
    return res.status(500).json(error(err.message));
  }
  }

  async updateAttendanceStatus(req, res) {
    try {
      const userId = req.user.userId;
      const { eventId } = req.params;
      const { status } = req.body;

      const updatedAttendance = await eventUseCases.updateAttendeeStatus(
        userId, 
        parseInt(eventId), 
        status
      );

      return res.status(200).json(success(updatedAttendance, 'Attendee status has been updated'));
    } catch (err) {
      if(err.message === 'Status is required') {
        return res.status(400).json(fail({ status: 'Status is required' }));
      }
      if (err.message === 'Only invited attendees can set their status') {
        return res.status(403).json(fail({ permission: err.message }));
      }
      if (err.message === 'Invalid status provided') {
        return res.status(400).json(fail({ status: err.message }));
      }
      if (err.message === 'Event not found') {
        return res.status(404).json(fail({ event: err.message }));
      }

      return res.status(500).json(error(err.message));
    }
  }

  async searchEvents(req, res) {
    try {
      const { keywords, startDate, endDate, role } = req.query;
      const userId = req.user.userId;

      const events = await eventUseCases.searchEvents(
        keywords,
        startDate,
        endDate,
        userId,
        role
      );

      return res.status(200).json(success(events));
    } catch (err) {
      return res.status(500).json(error(err.message));
    }
  }
}

export default new EventController();





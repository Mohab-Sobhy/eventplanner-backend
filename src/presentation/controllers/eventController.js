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
      const { userId } = req.body;
      const inviterId = req.user.userId;

      if (!userId) {
        return res.status(400).json(fail({ userId: 'User ID is required' }));
      }

      await eventUseCases.inviteUser(parseInt(eventId), parseInt(userId), inviterId);

      return res.status(200).json(success(null, 'User invited successfully'));
    } catch (err) {
      if (err.message === 'Event not found' || err.message === 'User not found') {
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

}

export default new EventController();





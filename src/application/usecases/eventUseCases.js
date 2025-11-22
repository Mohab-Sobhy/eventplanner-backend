import eventRepository from '../../infrastructure/repositories/eventRepository.js';
import userRepository from '../../infrastructure/repositories/userRepository.js';
import statusRepository from '../../infrastructure/repositories/statusRepository.js';

class EventUseCases {
  async createEvent(title, eventDate, eventTime, location, description, organizerId) {
    // Validate required fields
    if (!title || !eventDate || !eventTime) {
      throw new Error('Title, date, and time are required');
    }

    const event = await eventRepository.create(
      title,
      eventDate,
      eventTime,
      location,
      description,
      organizerId
    );

    return event;
  }

  async getOrganizedEvents(userId) {
    return await eventRepository.findByOrganizer(userId);
  }

  async getInvitedEvents(userId) {
    return await eventRepository.findByAttendee(userId);
  }

  async deleteEvent(eventId, userId) {
    // Verify event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    return await eventRepository.delete(eventId, userId);
  }

  async inviteUser(eventId, userId, inviterId) {
    // Verify event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Verify user exists
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return await eventRepository.inviteUser(eventId, userId, inviterId);
  }

  async getAttendees(eventId, organizerId) {
    // Verify event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    return await eventRepository.getAttendees(eventId, organizerId);
  }

  async updateAttendanceStatus(eventId, userId, statusName) {
    // Verify event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Get status
    const status = await statusRepository.findByName(statusName);
    if (!status) {
      throw new Error('Invalid status. Valid statuses: Going, Maybe, Not Going');
    }

    return await eventRepository.updateAttendanceStatus(eventId, userId, status.id);
  }

  async searchEvents(keywords, startDate, endDate, userId, roleFilter) {
    return await eventRepository.searchEvents(keywords, startDate, endDate, userId, roleFilter);
  }
}

export default new EventUseCases();





import eventRepository from '../../infrastructure/repositories/eventRepository.js';
import userRepository from '../../infrastructure/repositories/userRepository.js';
import statusRepository from '../../infrastructure/repositories/statusRepository.js';

class EventUseCases {
  async createEvent(title, eventDate, eventTime, location, description, organizerId) {
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

  async inviteUserByEmail(eventId, email, inviterId) {
    // Verify event exists
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    // Verify user exists
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    return await eventRepository.inviteUser(eventId, user.id, inviterId);
  }

  async getAttendeesInEvent(userId, eventId) {
    if(!eventId) throw new Error('Event Id is required');
    return await eventRepository.findAttendeesInEvent(userId, eventId);
  }

  async updateAttendeeStatus(userId, eventId, status) {
    if(!eventId) throw new Error('Event Id is required');
    if(!status) throw new Error('Status is required')
    await eventRepository.updateAttendeeStatus(userId,eventId, status);
  }

  async searchEvents(keywords, startDate, endDate, userId, roleFilter) {
    return await eventRepository.searchEvents(keywords, startDate, endDate, userId, roleFilter);
  }

}

export default new EventUseCases();





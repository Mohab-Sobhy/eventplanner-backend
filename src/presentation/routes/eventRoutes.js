import express from 'express';
import eventController from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All event routes require authentication
router.use(authenticate);

// Event management (organizer only for create/delete/invite)
router.post('/', eventController.createEvent.bind(eventController));
router.get('/organized', eventController.getOrganizedEvents.bind(eventController));
router.get('/invited', eventController.getInvitedEvents.bind(eventController));
router.delete('/:eventId', eventController.deleteEvent.bind(eventController));
router.post('/:eventId/invite', eventController.inviteUser.bind(eventController));

// TODO: Response management
//router.get('/:eventId/attendees', eventController.getAttendees.bind(eventController));
//router.put('/:eventId/attendance', eventController.updateAttendanceStatus.bind(eventController));

// TODO: Search and filtering
//router.get('/search', eventController.searchEvents.bind(eventController));

export default router;





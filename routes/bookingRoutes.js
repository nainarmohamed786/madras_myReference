import express from 'express';
import isAuthenticate from '../middlewares/isAuthenticate.js';
import { BookingDates, getBookings_admin, updateHoliday } from '../controller/bookingController.js';
import isAuthorized from '../middlewares/isAuthorized.js'

const router=express.Router();

router.route('/bookRoutes').post(isAuthenticate,BookingDates);
router.route('/admin/calender').post(isAuthorized("super-admin"),updateHoliday);
router.route('/admin/bookings').get(isAuthorized("super-admin"),getBookings_admin);
router.route('/holiday-calendar').get(isAuthenticate)


export default router;
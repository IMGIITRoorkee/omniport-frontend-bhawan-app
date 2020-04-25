import { combineReducers } from 'redux'
import activeDay from './active-day'
import authorities from './authorities'
import facilities from './facilities'
import complains from './complains'
import constants from './constants'
import who_am_i from './who-am-i'
import events from './events'
import bookingRequests from './roomBookings'
import timeSlots from './time-slots'
import facility from './facility'
import pendingComplains from './pendingComplains'
import resolvedComplains from './resolvedComplains'
import pastBookingRequests from './past-bookings'
import presentBookingRequests from './present-bookings'

const rootReducers = combineReducers({
  activeDay: activeDay,
  authorities: authorities,
  constants: constants,
  facilities: facilities,
  complains: complains,
  who_am_i: who_am_i,
  events: events,
  bookingRequests: bookingRequests,
  timeSlots: timeSlots,
  facility: facility,
  pendingComplains: pendingComplains,
  resolvedComplains: resolvedComplains,
  pastBookingRequests: pastBookingRequests,
  presentBookingRequests: presentBookingRequests,
})

export default rootReducers

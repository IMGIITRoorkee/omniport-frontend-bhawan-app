import { combineReducers } from 'redux'
import activeDay from './active-day'
import authorities from './authorities'
import facilities from './facilities'
import complains from './complains'
import who_am_i from './who-am-i'
import events from './events'
import bookingRequests from './roomBookings'
import timeSlots from './time-slots'
import facility from './facility'

const rootReducers = combineReducers({
  activeDay: activeDay,
  authorities: authorities,
  facilities: facilities,
  complains: complains,
  who_am_i: who_am_i,
  events: events,
  bookingRequests: bookingRequests,
  timeSlots: timeSlots,
  facility: facility
})

export default rootReducers

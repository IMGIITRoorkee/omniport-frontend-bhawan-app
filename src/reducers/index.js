import { combineReducers } from 'redux'
import activeDay from './active-day'
import activeAuthority from './active-authority'
import activeFacility from './active-facility'
import authorities from './authorities'
import facilities from './facilities'
import complains from './complains'
import constants from './constants'
import whoAmI from './who-am-i'
import events from './events'
import bookingRequests from './roomBookings'
import timeSlots from './time-slots'
import facility from './facility'
import pendingComplains from './pendingComplains'
import resolvedComplains from './resolvedComplains'
import pastBookingRequests from './past-bookings'
import searchPersonResults from './searchPerson'
import presentBookingRequests from './present-bookings'
import searchResidentResult from './searchResident'
import residents from './residents'
import activeHostel from './active-hostel'
import activePost from './active-post'
import previousRecords from './previousRecords'

const rootReducers = combineReducers({
  activeDay: activeDay,
  activeAuthority: activeAuthority,
  activeFacility: activeFacility,
  authorities: authorities,
  constants: constants,
  facilities: facilities,
  complains: complains,
  who_am_i: whoAmI,
  events: events,
  bookingRequests: bookingRequests,
  timeSlots: timeSlots,
  facility: facility,
  pendingComplains: pendingComplains,
  resolvedComplains: resolvedComplains,
  pastBookingRequests: pastBookingRequests,
  activeHostel: activeHostel,
  presentBookingRequests: presentBookingRequests,
  searchPersonResults: searchPersonResults,
  searchResidentResult: searchResidentResult,
  residents: residents,
  previousRecords: previousRecords,
  activePost: activePost
})

export default rootReducers

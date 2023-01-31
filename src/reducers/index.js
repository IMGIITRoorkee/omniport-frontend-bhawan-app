import { combineReducers } from 'redux'
import activeDay from './active-day'
import activeAuthority from './active-authority'
import activeFacility from './active-facility'
import authorities from './authorities'
import facilities from './facilities'
import complaints from './complaints'
import items from './items'
import defaultItems from './default-items'
import constants from './constants'
import whoAmI from './who-am-i'
import events from './events'
import bookingRequests from './roomBookings'
import timeSlots from './time-slots'
import facility from './facility'
import pendingComplaints from './pendingComplaints'
import resolvedComplaints from './resolvedComplaints'
import pastBookingRequests from './past-bookings'
import searchPersonResults from './searchPerson'
import presentBookingRequests from './present-bookings'
import searchResidentResult from './searchResident'
import residents from './residents'
import rooms from './rooms'
import studentAccommodation from './studentAccommodation'
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
  complaints: complaints,
  items: items,
  defaultItems: defaultItems,
  who_am_i: whoAmI,
  events: events,
  bookingRequests: bookingRequests,
  timeSlots: timeSlots,
  facility: facility,
  pendingComplaints: pendingComplaints,
  resolvedComplaints: resolvedComplaints,
  pastBookingRequests: pastBookingRequests,
  activeHostel: activeHostel,
  presentBookingRequests: presentBookingRequests,
  searchPersonResults: searchPersonResults,
  searchResidentResult: searchResidentResult,
  residents: residents,
  rooms: rooms,
  studentAccommodation: studentAccommodation,
  previousRecords: previousRecords,
  activePost: activePost
})

export default rootReducers

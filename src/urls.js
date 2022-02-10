import config from '../config.json'

// Frontend URLs

export const baseNavUrl = (forwardLink) => {
  return `${config.baseUrl}${forwardLink}`
}

export const homePageUrl = () => {
  return `${baseNavUrl('/')}`
}

export const profilePageUrl = () => {
  return `${baseNavUrl('/profile')}`
}
export const facilityPageUrl = () => {
  return `${baseNavUrl('/facility')}`
}

export const complainUrl = () => {
  return `${baseNavUrl('/complain')}`
}

export const adminComplainUrl = () => {
  return `${baseNavUrl('/admin_complain')}`
}

export const bookingUrl = () => {
  return `${baseNavUrl('/book_room')}`
}

export const eventUrl = () => {
  return `${baseNavUrl('/events')}`
}

export const registrationUrl = () => {
  return `${baseNavUrl('/registration')}`
}

export const databaseUrl = () => {
  return `${baseNavUrl('/database')}`
}

// Backend URLs

export const baseApiUrl = () => {
  return `/api/bhawan_app/`
}

export const complainsUrl = (residence) => {
  return `${baseApiUrl()}${residence}/complaint/`
}

export const complainsDownloadUrl = (residence) => {
  return `${baseApiUrl()}${residence}/complaint/download/`
}

export const statusComplainsUrl = (residence, statuses) => {
  let allStatus = '?'
  statuses.map((status) => {
    status = status.toUpperCase()
    allStatus = `${allStatus}status=${status}&`
  })
  return `${baseApiUrl()}${residence}/complaint/${allStatus}`
}

export const increaseUnsuccesfulComplainsUrl = (residence, id) => {
  return `${baseApiUrl()}${residence}/complaint/${id}/unsuccessful/`
}

export const bookingsUrl = (residence, past) => {
  return `${baseApiUrl()}${residence}/room_booking/?past=${past}`
}

export const bookingsDownloadUrl = (residence) => {
  return `${baseApiUrl()}${residence}/room_booking/download/`
}

export const yellowPagesUrl = (searchObject) => {
  return `/api/yellow_pages/person/?search=${searchObject}`
}

export const yellowPagesStudentUrl = (searchObject) => {
  return `/api/yellow_pages/student/?search=${searchObject}`
}

export const specificBookingUrl = (residence, id) => {
  return `${baseApiUrl()}${residence}/room_booking/${id}/`
}

export const constantsUrl = () => {
  return `${baseApiUrl()}constants/`
}

export const whoAmIUrl = () => {
  return `${baseApiUrl()}personal_info/`
}

export const statusBookingsUrl = (residence, status, past) => {
  status = status.toUpperCase()
  return `${baseApiUrl()}${residence}/room_booking/?status=${status}&past=${past}`
}

export const eventsUrl = (residence) => {
  return `${baseApiUrl()}${residence}/event/`
}

export const timeSlotsUrl = (residence) => {
  return `${baseApiUrl()}${residence}/time_slot/`
}

export const facilitiesUrl = (residence) => {
  return `${baseApiUrl()}${residence}/facility/`
}

export const facilityUrl = (residence, id) => {
  return `${baseApiUrl()}${residence}/facility/${id}/`
}
export const authoritiesUrl = (residence) => {
  return `${baseApiUrl()}${residence}/admin/`
}
export const specificAuthoritiesUrl = (residence, id) => {
  return `${baseApiUrl()}${residence}/admin/${id}/`
}
export const residentSearchUrl = (residence, enrollmentNo) => {
  return `${baseApiUrl()}${residence}/resident/${enrollmentNo}/`
}
export const residentUrl = (residence) => {
  return `${baseApiUrl()}${residence}/resident/`
}
export const residentDownloadUrl = (residence) => {
  return `${baseApiUrl()}${residence}/resident/download/`
}
export const deregisterUrl = (residence, person) => {
  return `${baseApiUrl()}${residence}/resident/${person}/deregister/`
}

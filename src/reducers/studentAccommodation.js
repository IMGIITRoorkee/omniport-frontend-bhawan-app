const initialState = {}

const studentAccommodation = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_STUDENT_ACCOMMODATION':
      return action.payload
    default:
      return state
  }
}

export default studentAccommodation

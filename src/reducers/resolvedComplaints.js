const initialState = {}

const resolvedComplaints = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_RESOLVED_COMPLAINTS':
      return action.payload
    default:
      return state
  }
}

export default resolvedComplaints

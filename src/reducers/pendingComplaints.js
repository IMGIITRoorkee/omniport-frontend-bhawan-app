const initialState = {}

const pendingComplaints = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PENDING_COMPLAINTS':
      return action.payload
    case 'INCREASE_UNSUCCESFUL_ATTEMPT': {
      state.results = state.results.map(complaint =>
        (complaint.id === action.payload.id)
          ? action.payload : complaint
      )
      return state
    }
    default:
      return state
  }
}

export default pendingComplaints

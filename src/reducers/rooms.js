const initialState = {}

const rooms = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_ROOMS':
      return action.payload
    default:
      return state
  }
}

export default rooms

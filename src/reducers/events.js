const initialState = {}

const events = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_EVENTS':
      return action.payload
    case 'ADD_EVENT': {
      return [...state, action.payload]
    }
    default:
      return state
  }
}

export default events

const initialState = {}

const previousRecords = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_PREVIOUS_RESIDENTS':
      return action.payload
    default:
      return state
  }
}

export default previousRecords

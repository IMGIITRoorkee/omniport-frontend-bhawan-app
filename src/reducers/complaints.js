const initialState = {}

const complaints = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_COMPLAINTS':
      return action.payload
    case 'ADD_COMPLAINT': {
      state.count++
      let results = state.results
      state.results = [action.payload, ...results]
      return state
    }
    default:
      return state
  }
}

export default complaints

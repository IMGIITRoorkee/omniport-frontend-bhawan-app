const initialState = {}

const update_bhawan_data = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return action.payload
    default:
      return state
  }
}

export default update_bhawan_data

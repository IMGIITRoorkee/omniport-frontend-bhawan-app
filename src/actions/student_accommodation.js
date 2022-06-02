import axios from 'axios'

export const getStudentAcccommodation = (url) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        let item = response.data
        dispatch({
          type: 'GET_ALL_STUDENT_ACCOMMODATION',
          payload: item
        })
      })
      .catch((err) => {
      })
  }
}


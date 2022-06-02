import axios from 'axios'

export const getRooms = (url, successCallBack, errCallBack) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        successCallBack(response)
        let item = response.data
        dispatch({
          type: 'GET_ALL_ROOMS',
          payload: item
        })
      })
      .catch((err) => {
        errCallBack(err)
      })
  }
}


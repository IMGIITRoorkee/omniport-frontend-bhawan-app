import axios from 'axios'

export const getComplaints = (url, successCallBack, errCallBack) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        successCallBack(response)
        console.log(response.data)
        let item = response.data
        dispatch({
          type: 'GET_ALL_COMPLAINTS',
          payload: item
        })
      })
      .catch((err) => {
        errCallBack(err)
      })
  }
}
export const getPendingComplaints = (url, successCallBack, errCallBack) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        successCallBack(response)
        let item = response.data
        dispatch({
          type: 'GET_PENDING_COMPLAINTS',
          payload: item
        })
      })
      .catch((err) => {
        errCallBack(err)
      })
  }
}
export const getResolvedComplaints = (url, successCallBack, errCallBack) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        successCallBack(response)
        let item = response.data
        dispatch({
          type: 'GET_RESOLVED_COMPLAINTS',
          payload: item
        })
      })
      .catch((err)=> {
        errCallBack(err)
      })
  }
}
export const increaseUnsuccefulAttempts = (url, successCallBack, errCallBack) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: url
    })
      .then((response) => {
        successCallBack(response)
      })
      .catch((error) => {
        errCallBack(error)
      })
  }
}

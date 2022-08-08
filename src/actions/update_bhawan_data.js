import axios from 'axios'

import { getCookie } from 'formula_one/src/utils'

export const updateBhawanData = (
  url,
  data,
  successCallBack,
  errCallBack
) => {
  const headers = {
    'Content-Type': 'multipart/form-data',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return (dispatch) => {
    axios
      .patch(url, data, {
        headers: headers
      })
      .then((res) => {
        successCallBack(res.data)
        dispatch({
          type: 'UPDATE_DATA',
          payload: res.data
        })
      })
      .catch((err) => {
        if (err.response) {
          errCallBack(err.response.data)
        }
      })
  }
}

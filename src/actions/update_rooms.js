import axios from 'axios'

import { getCookie } from 'formula_one/src/utils'

export const updateRooms = (
  url,
  data,
  successCallBack,
  errCallBack
) => {
  const headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return (dispatch) => {
    axios
      .patch(url, data, {
        headers: headers
      })
      .then((res) => {
        successCallBack(res)
      })
      .catch((err) => {
        errCallBack(err)
      })
  }
}

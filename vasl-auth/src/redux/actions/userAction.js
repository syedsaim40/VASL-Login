import ACTIONS from './index';
import axios from 'axios'

//fetchiong the all information of users for admin only
export const fetchAllUsers = async (token) => {
    const res = await axios.get('/user/all_infor', {
        headers: { Authorization: token }
    })
    return res
}

//dispatchinf the all information of users which already being fetched
export const dispatchGetAllUsers = (res) => {
    return {
        type: ACTIONS.GET_ALL_USERS,
        payload: res.data
    }
}
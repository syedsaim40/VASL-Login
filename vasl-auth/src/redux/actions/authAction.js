import ACTIONS from './index';
import axios from 'axios'

//dispatching the user to logout, or info will be removed
export const dispatchLogin = () =>{
    return{
        type: ACTIONS.LOGIN
    }
}

//fetching the user to get user information
export const fetchUser = async (token) =>{
    const res = await axios.get('/user/infor', {
        headers: {Authorization: token}
    })
    return res
}

//dispatching the information of user that already fetched
export const dispatchGetUser = (res) =>{
    return{
        type: ACTIONS.GET_USER,
        payload: {
            user: res.data,
            isAdmin: res.data.role === 1 ? true : false
        }
    }
}
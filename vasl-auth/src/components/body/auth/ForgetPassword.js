import React, {useState} from 'react';
import axios from 'axios';
import { isEmail } from '../../utils/Validation/Validation';
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';

//making the state for these attributes
const initialState = {
    email: '',
    err: '',
    success: ''
}

function ForgetPassword() {

    const [data, setData] = useState(initialState);

    const {email, err, success} = data

    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '',  success: ''})
    }
    
    const forgetPassword = async () => {
        if(!isEmail(email))
            return setData({...data, err: 'Invalid email! Please enter correct email',  success: ''})
            try {
                const res = await axios.post('/user/forgot', {email})
                return setData({...data, err: '',  success: res.data.msg})
            } catch (err) {
                err.response.data.msg && setData({...data, err: err.response.data.msg,  success: ''})
            }
    }

    return (
        <div className="fg_box">
            <div className="content_holder">
                <div className="forget_pass">
                    <h2>Forget Your Password?</h2>
                    <div className="row">
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        
                        <input type="email" name="email" id="email" value={email} onChange={handleChangeInput} placeholder="Enter your email address" />
                        <button onClick={forgetPassword}>Verify your email</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgetPassword;
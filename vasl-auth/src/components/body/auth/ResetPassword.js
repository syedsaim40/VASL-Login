import React, {useState} from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';
import { isLength, isMatch } from '../../utils/Validation/Validation';

//making the state for these attributes
const initialState = {
    password: '',
    cf_passsword: '',
    err: '',
    success: ''
}

//creating the Reset Password component
function ResetPassword() {

    const [data, setData] = useState(initialState);

    const {token} = useParams();

    const {password, cf_password, err, success} = data;

    //this function will call on change of name and email by user
    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '',  success: ''})
    }

    const handleResetPass = async () => {
        if(isLength(password))
            return setData({...data, err: "Password must be atleast 6 characters.", success: ''})
        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match!", success: ''})
        
        try {
            const res = await axios.post('/user/reset', {password}, {
                headers: {Authorization: token}
            })

            return setData({...data, err: '', success: res.data.msg})
        } catch (err) {
            err.response.data.msg && setData({...data, err: err.response.data.msg, success: ''})            
        }
    }

    return (         
        <div className="fg_box">
            <div className="content_holder">
                <div className="forget_pass">
                    <h2>Reset Your Password</h2>
                    <div className="row">
                        {/* Shiwing the notifications error/success */}
                        {err && showErrMsg(err)}
                        {success && showSuccessMsg(success)}
                        
                        <input type="password" name="password" id="password" value={password} onChange={handleChangeInput} placeholder="Enter your password" />
                        <input type="password" name="cf_password" id="cf_password" value={cf_password} onChange={handleChangeInput} placeholder="Confirm password" />
                        <button onClick={handleResetPass}>Reset Password</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword

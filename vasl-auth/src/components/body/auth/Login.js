import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';
import { dispatchLogin } from '../../../redux/actions/authAction';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
// import FacebookLogin from 'react-facebook-login';

//making the state for these attributes
const initialState = {
    email: '',
    password: '',
    err: '',
    success: ''
}

//creating the login component
function Login() {
    const [user, setUser] = useState(initialState);
    const dispatch = useDispatch()
    const history = useHistory()

    const { email, password, err, success } = user;

    //this function will call on change of name and email by user
    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }

    //this function will call when user hit sign up
    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/user/login', { email, password })
            setUser({ ...user, err: '', success: res.data.msg })

            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push("/")

        } catch (err) {
            err.response.data.msg &&
                setUser({ ...user, err: err.response.data.msg, success: '' }) //i have make a change here by putty && to ||

        }
    }

    //Login response for google login 
    const responseGoogle = async (response) => {
        try {
            const res = await axios.post('/user/google_login', { tokenId: response.tokenId })

            setUser({ ...user, err: '', success: res.data.msg })
            localStorage.setItem('firstLogin', true)

            dispatch(dispatchLogin())
            history.push("/")
        } catch (err) {
            setUser({ ...user, err: err.response.data.msg, success: '' })
        }
    }

    //Login response for facebook login 
    // const responseFacebook = async (response) => {
    //     console.log(response)
    //     try {
    //         const {accessToken, userID} = response
    //         const res = await axios.post('/user/facebook_login', { accessToken, userID })

    //         setUser({ ...user, err: '', success: res.data.msg })
    //         localStorage.setItem('firstLogin', true)

    //         dispatch(dispatchLogin())
    //         history.push("/")
    //     } catch (err) {
    //         setUser({ ...user, err: err.response.data.msg, success: '' })
    //     }
    // }

    return (
        <div className="login_page">
            <div className="content_holder">
                <h2>Sign In</h2>
                {/* Shiwing the notifications error/success */}
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <form className="login_form" onSubmit={handleSubmit}>
                    <div className="group_field">
                        <label htmlFor="email">Email<span>*</span></label>
                        <input type="text" placeholder="Enter email adddress" id="email"
                            value={email} name="email" onChange={handleChangeInput} />
                    </div>
                    <div className="group_field">
                        <label htmlFor="password">Password<span>*</span></label>
                        <input type="password" placeholder="Enter password" id="password"
                            value={password} name="password" onChange={handleChangeInput} />
                    </div>
                    <div className="row group_field e_btn">
                        <button type="submit">Sign In</button>
                        <Link className="f_link" to="/forgot_password">Forget Password?</Link>
                    </div>
                </form>
                <h2>Or login with</h2>
                <div className="social_login">
                    {/* For Google Login Authentication */}
                    <GoogleLogin
                        clientId="968709430379-dkv5gov48ieuc3t5kmq5s7in57sri6er.apps.googleusercontent.com"
                        buttonText="Login with google"
                        onSuccess={responseGoogle}
                        cookiePolicy={'single_host_origin'}
                    />

                    {/* For Facebbok Login Authentication */}
                    {/* <FacebookLogin
                        appId="452032583149631"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                    /> */}
                </div>
                <div className="group_field">
                    <p>New Customer? <Link className="f_link" to="/register">Register</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Login
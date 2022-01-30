import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';
import { isEmpty, isEmail, isLength, isMatch } from '../../utils/Validation/Validation';

//making the state for these attributes
const initialState = {
    name: " ",
    email: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

//creating the Register component
function Register() {
    const [user, setUser] = useState(initialState);

    const { name, email, password, cf_password, err, success } = user;

    //this function will call on change of name and email by user
    const handleChangeInput = e => {
        const { name, value } = e.target
        setUser({ ...user, [name]: value, err: '', success: '' })
    }

    //Register the user according to this schema
    const handleSubmit = async e => {
        e.preventDefault();
        if (isEmpty(name) || isEmpty(password))
            return setUser({ ...user, err: "Please fill all the required fields.", success: '' })

        if (!isEmail(email))
            return setUser({ ...user, err: "Invalid Email!", success: '' })

        if (isLength(password))
            return setUser({ ...user, err: "Password must be atleast 6 characters.", success: '' })

        if (!isMatch(password, cf_password))
            return setUser({ ...user, err: "Password not matched.", success: '' })
        try {
            const res = await axios.post('/user/register', {
                name, email, password
            })

            setUser({ ...user, err: '', success: res.data.msg })

        } catch (err) {
            err.response.data.msg ||
                setUser({ ...user, err: err.response.data.msg, success: '' }) //i have make a change here

        }
    }

    return (
        <div className="login_page">
            <div className="content_holder">
                <h2>Register</h2>
                {/* Shiwing the notifications error/success */}
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}

                <form className="login_form" onSubmit={handleSubmit}>

                    <div className="group_field">
                        <label htmlFor="name">Name<span>*</span></label>
                        <input type="text" placeholder={"Enter your name"} id="name"
                            value={name} name="name" onChange={handleChangeInput} />
                    </div>
                    
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

                    <div className="group_field">
                        <label htmlFor="cf_password">Confirm Password<span>*</span></label>
                        <input type="password" placeholder="Confirm password" id="cf_password"
                            value={cf_password} name="cf_password" onChange={handleChangeInput} />
                    </div>

                    <div className="row group_field e_btn">
                        <button type="submit">Register</button>
                    </div>

                </form>
                <div className="group_field">
                    <p>Already have an account? <Link className="f_link" to="/login">Login</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Register
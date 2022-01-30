import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useSelector, useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import { isLength, isMatch } from '../../utils/Validation/Validation';
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';
import { fetchAllUsers, dispatchGetAllUsers } from '../../../redux/actions/userAction';

//making the state for these attributes
const initialState = {
    name: '',
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

//creating the Profile component
function Profile() {
    const auth = useSelector(state => state.auth)
    const token = useSelector(state => state.token)

    const users = useSelector(state => state.users)


    const {user, isAdmin} = auth

    const [data, setData] = useState(initialState)

    const {name, password, cf_password, err, success} = data


    const [avatar, setAvatar] = useState(false)

    const [loading, setLoading] = useState(false)

    const [callback, setCallback] = useState(false)

    const dispatch = useDispatch()
    
    useEffect(()=>{
        if(isAdmin){
            fetchAllUsers(token).then(res=>{
                dispatch(dispatchGetAllUsers(res))
            })
        }
    },[token, isAdmin, dispatch, callback])

    //this function will call on change of name and email by user
    const handleChange = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err: '', success: ''})
    }

    //setting up the user avatar
    const changeAvatar = async(e)=>{
        e.preventDefault()
        try {
            const file = e.target.files[0]

            if(!file) return setData({...data, err: "No Files were uploaded.", success: ''})

            if(file.size > 1024 * 1024)
                return setData({...data, err: "Size to large!, try upload small size image.", success: ''})
            
            if(file.type !== 'image/jpeg' && file.type !== 'image/png')
                return setData({...data, err: "File format unsupported! Please upload jpeg/png image.", success: ''})

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)

            const res = await axios.post('/api/upload_avatar', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })

            setLoading(false)
            setAvatar(res.data.url)

        } catch (err) {
            return setData({...data, err: err.response.data.msg, success: ''})
        }                
    }

    //updating the user info
    const updateInfor = () => {
        try {
            axios.patch('/user/update', {
                name: name ? name: user.name,
                avatar: avatar ? avatar: user.avatar
            },{
                headers: {Authorization: token}
            })
            setData({...data, err: '', success: "Updated Successfully!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg, success: ''})
        }
    }

    //updating the exisiting user password
    const updatePass = () => {
        if(isLength(password))
            return setData({...data, err: "Password must be atleast 6 character", success: ''})

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match, please enter correct password", success: ''})

        try {
            axios.post('/user/reset', {password},{
                headers: {Authorization: token}
            })
            setData({...data, err: '', success: "Updated Successfully!"})
        } catch (err) {
            setData({...data, err: err.response.data.msg, success: ''})
        }
    }

    const handleUpdate = ()=> {
        if(name || avatar) updateInfor()
        if(password) updatePass()
    }
    
    //deleteing the user of vasl clothing
    const handleDelete = async (id) => {
        try {
            if(user._id !== id){
                if(window.confirm("Are you sure? you want to delete this account.")){
                    setLoading(true)
                    await axios.delete(`/user/delete/${id}`, {
                        headers: {Authorization: token}
                    })
                    setLoading(false)
                    setCallback(!callback)
                }
            }
        } catch (err) {
            setData({...data, err: err.response.data.msg, success: ''})
        }
    }

    return (
        <>
            <div>
                {/* Shiwing the notifications error/success/Loading for changing */}
                {err && showErrMsg(err)}
                {success && showSuccessMsg(success)}
                {loading && <h3>Loading! Please wait.</h3>}
            </div>
            <div className="profilePage">
                <div className="content-holder">                    
                    <div className="col_left">
                        <h2>{isAdmin? "Admin Profile" : "User Profile"}</h2>
                        <div className="avatar">
                            <img src={avatar ? avatar: user.avatar} alt="avatar"/>
                            <span>
                                <i className="fas fa-camera"></i>
                                <p>Change</p>
                                <input type="file" name="file" id="file_avatar" onChange={changeAvatar} />
                            </span>
                        </div>
                        <form>
                            <div className="form_group">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" defaultValue={user.name} 
                                placeholder="Your Name" onChange={handleChange} />
                            </div>
                            <div className="form_group">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" id="email" defaultValue={user.email} 
                                placeholder="Your email" disabled />
                            </div>
                            <div className="form_group">
                                <label htmlFor="password"> New Password</label>
                                <input type="password" name="password" id="password" value={password} 
                                placeholder="Your password" onChange={handleChange} />
                            </div>
                            <div className="form_group">
                                <label htmlFor="cf_password">Confirm New Password</label>
                                <input type="password" name="cf_password" id="cf_password" value={cf_password} 
                                placeholder="Confirm password" onChange={handleChange} />
                            </div>
                            <div className="note_box">
                                <em> 
                                * If you update your password here, you will not be able 
                                    to login quickly using google and facebook.
                                </em>
                            </div>
                            <button disabled={loading} onClick={handleUpdate} >Update</button>
                        </form>
                    </div>
                    <div className="col_right">
                        <h2>{isAdmin ? "Users" : "My Orders"}</h2>
                        <div style={{overflowX: "auto"}}>
                            <table className="vasl_customers">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Admin</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map(user => (
                                            <tr key={user._id}> 
                                                <td>{user._id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    {
                                                        user.role === 1
                                                        ? <i className="fas fa-check" title="This is Admin of Vasl Clothing."></i>
                                                        : <i className="fas fa-times" title="This is User of Vasl Clothing"></i>
                                                    }
                                                </td>
                                                <td>
                                                    <Link to={`/edit_user/${user._id}`}>
                                                        <i className="fas fa-edit" title="To edit this user click."></i>
                                                    </Link>
                                                    <i className="fas fa-trash-alt" title="To delete this user click."
                                                    onClick={()=>handleDelete(user._id)} ></i>
                                                </td>
                                            </tr>
                                        ))
                                    } 
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile

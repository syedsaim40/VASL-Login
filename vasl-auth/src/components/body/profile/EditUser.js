import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification';

//Creating the component for Edit user
function EditUser() {
    //select user by id
    const { id } = useParams()
    const history = useHistory()
    const [editUser, setEditUser] = useState([])

    const users = useSelector(state => state.users)
    const token = useSelector(state => state.token)

    //checking the user is it admin or not
    const [checkAdmin, setCheckAdmin] = useState(false)
    const [err, setErr] = useState(false)
    const [success, setSuccess] = useState(false)
    const [num, setNum] = useState(0)

    useEffect(() => {
        if (users.length !== 0) {
            users.forEach(user => {
                if (user._id === id) {
                    setEditUser(user)
                    setCheckAdmin(user.role === 1 ? true : false)
                }
            });
        }
        else {
            history.push('/profile')
        }
    }, [users, id, history])

    const handleUpdate = async () => {
        try {
            if(num % 2 !==0 ){
                const res = await axios.patch(`/user/update_role/${editUser._id}`, {
                    role: checkAdmin ? 1 : 0
                },{
                    headers: {Authorization: token}
                })

                setSuccess(res.data.msg)
                setNum(0)
            }
        } catch (err) {
            err.response.data.msg && setErr(err.response.data.msg) 
        }
    }

    const handleCheck = () => {
        setSuccess('')
        setErr('')
        setCheckAdmin(!checkAdmin)
        setNum(num + 1)
    }


    return (
        <div className="profilePage editUser_page">
            <h2>Edit User</h2>
            <div className="row">
                <button onClick={()=>history.goBack()} className="go_back">
                    <i className="fas fa-long-arrow-alt-left"></i>
                    Go Back
                </button>
            </div>
            <div className="col_left">
                <form>
                    <div className="form_group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" defaultValue={editUser.name} disabled />
                    </div>
                    <div className="form_group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" defaultValue={editUser.email} disabled />
                    </div>                    
                    <div className="form_group admin_check">
                        <input type="checkbox" id="isAdmin" checked={checkAdmin} onChange={handleCheck} />
                        <label htmlFor="isAdmin">Make this user Admin.</label>
                    </div>
                    <div className="note_box">
                        <em> by default this is "default user", to make admin click above checkbox.</em>
                    </div>
                    <button onClick={handleUpdate} >Update</button>

                    {/* Shiwing the notifications error/success */}
                    {err && showErrMsg(err)}
                    {success && showSuccessMsg(success)}
                </form>
            </div>
        </div>
    )
}

export default EditUser

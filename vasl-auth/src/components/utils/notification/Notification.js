import React from 'react';
import './notification.css';


//This will show erorr notification
export const showErrMsg = (msg) => {
    return <div className="errMsg">{msg}</div>
}

//This will show success notification
export const showSuccessMsg = (msg) => {
    return <div className="successMsg">{msg}</div>
}
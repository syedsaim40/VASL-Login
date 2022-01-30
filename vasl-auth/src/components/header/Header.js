import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.png';
import {useSelector} from 'react-redux';
import axios from 'axios';

//creating the unique header component for all vasl pages
function Header() {
    const auth  = useSelector(state => state.auth)
    
    const {user, isLogged} = auth;

    const handleLogout = async  () => {
        try {
            await axios.get('/user/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
    }

    const userLink = () =>{
        return <li className="dropNav">
            <Link to="#" className="avatar">
                <img src={user.avatar} alt=""/> {user.name} <i className="fas fa-chevron-down"></i>
            </Link>
            <ul className="dropDown">
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/" onClick={handleLogout}>Logout</Link></li>
            </ul>
        </li>
    }

    return (
        <header>
            <ul className="pull-left carT">
                <li><Link to="/"><i className="fas fa-shopping-cart"></i>Cart</Link></li>
            </ul>
            <div className="logo">
                <h1><Link to="/" ><img className="main_logo" src={logo} alt='logo' /></Link></h1>
            </div>
            <ul className="dp-box">
                {
                    isLogged
                    ? userLink()
                    :<li><Link to="/login"><i className="fas fa-user"></i>Sign In</Link></li>
                }                
            </ul>
        </header>
    )
}

export default Header

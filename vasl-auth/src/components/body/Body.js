import React from 'react'
import {Switch, Route} from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import ActivationEmail from './auth/ActivationEmail';
import NotFound from '../utils/NotFound/NotFound';
import ForgetPass from './auth/ForgetPassword';
import ResetPass from './auth/ResetPassword';
import Profile from './profile/Profile';
import EditUser from './profile/EditUser';

import {useSelector} from 'react-redux';

//creating the body of showing current pages of vasl clothing
function Body() {
    const auth = useSelector(state => state.auth)
    const {isLogged, isAdmin} = auth;
    return (
        <section>
            <Switch>
                <Route path="/login" component={isLogged ? NotFound : Login} exact />
                <Route path="/register" component={isLogged ? NotFound : Register} exact />
                <Route path="/forgot_password" component={isLogged ? NotFound : ForgetPass} exact />
                <Route path="/user/reset/:token" component={isLogged ? NotFound : ResetPass} exact />
                <Route path="/user/activate/:activation_token" component={ActivationEmail} exact />
                <Route path="/profile" component={isLogged ? Profile : NotFound} exact />
                <Route path="/edit_user/:id" component={isAdmin ? EditUser : NotFound} exact />
            </Switch>
        </section>
    )
}

export default Body

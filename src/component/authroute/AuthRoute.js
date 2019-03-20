import React from 'react';

import { withRouter,Route } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import AppSettings from '../../configs/AppSettings'

const loginRequired = process.env.REACT_APP_LOGIN_REQUIRED 
class AuthRoute extends React.Component{
    
    render(){
        return (
            <Route
                render={props => (
                    loginRequired === "false" || this.props.cookies.get('curUser') ? null : 
                    window.location.href=AppSettings.get().LOGIN_URL
                    // window.location.href="http://localhost:3000/CM-WEBUI-STATIC/login"
                )}
            />
        );
    };
}

export default withCookies(withRouter(AuthRoute));

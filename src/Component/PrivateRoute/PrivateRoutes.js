import React from "react";
import {Outlet, Navigate} from 'react-router-dom';

const PrivateRoutes = () => {
    const LoginToken = localStorage.getItem('LoginToken');
    
    return (
        LoginToken ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes;

import SideMenu from "../components/SideMenu";
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import '../styles/Dashboard.css'


const AdminActivities=()=>{
    return (
        <div className="home-page">
            <SideMenu activeLink='activities' admin={true}/>
            
            
        </div>
    )
}

export default AdminActivities


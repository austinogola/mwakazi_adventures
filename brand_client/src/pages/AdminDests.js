import SideMenu from "../components/SideMenu";
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import '../styles/Dashboard.css'


const AdminDests=()=>{
    return (
        <div className="home-page">
            <SideMenu activeLink='destinations' admin={true}/>
            
            
        </div>
    )
}

export default AdminDests


import SideMenu from "../components/SideMenu";
import React, { useEffect, useState } from 'react';
import { NavLink,useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import '../styles/Dashboard.css'



const Dashboard=()=>{
    //    const serverUrl='http://localhost:5010'
       const serverUrl=process.env.REACT_APP_SERVER_URL
//   const serverUrl='https://server.mwakaziadventures.com'
    const [isAdmin,setIsAdmin]=useState(false)
    const [username,setUserName]=useState('')
    const [cookies, setCookie, removeCookie] = useCookies(['ma_auth_token']);
    const navigate = useNavigate();

    let ma_auth_token=cookies.ma_auth_token
    

    useEffect(()=>{
        const getConfig=()=>{
            return new Promise(async(resolve, reject) => {
                fetch(`${serverUrl}/auth/config`,{
                    method:'get',
                    headers:{
                        Authorization:`Bearer ${ma_auth_token}`
                    }
                })
                .then(async resp=>{
                    let res=await resp.json()
                    if(res.status==='success'){
                        const theAccount=res.account
                        setIsAdmin(theAccount.isAdmin)
                        setUserName(theAccount.username)
                    }else{
                        removeCookie("ma_auth_token")
                        navigate('/login')
                    }
                    console.log(res)
                })
                
            })
        }

        getConfig()
    },[])
    return(
        <div className="home-page">
            <SideMenu activeLink='home' admin={isAdmin}/>
            <div className="content">
                <h1>Welcome, {username} {isAdmin?`(admin)`:null}</h1>
            </div>
            
        </div>
    )
}

export default Dashboard
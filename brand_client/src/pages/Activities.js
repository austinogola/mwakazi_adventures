
import React, { useEffect, useState } from 'react';
import '../styles/Activities.css'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import '../styles/Activities.css'
import imgg from '../images/abadare.jpg'
import NewHeader from "../components/NewHeader"


const Activities=()=>{
    const [activities, setActivities] = useState([]);

    // let serverUrl='http://localhost:5010'
    //  let serverUrl='https://server.mwakaziadventures.com'
     const serverUrl=process.env.REACT_APP_SERVER_URL
    useEffect(() => {
        const fetchActivities = async () => {
          try {
            const response = await fetch(`${serverUrl}/api/v1/activities?limit=9`,{
                method:'GET'
            }); //\Replace with your API URL

            const res=await response.json()
            console.log(res)
            setActivities(res);
          } catch (error) {
            console.error('Error fetching activities:', error);
          }
        };
        fetchActivities();
      }, []);
    return(
        <div>
            <NewHeader/>
            <Navbar/>
            <div className='shownImage'>
                    <img src={imgg}/>
                    <h1 className='activities_title'>Activites</h1>
                    
            </div>
            <div>

            <div className="activity-grid">
                {activities.map(activity => (
                    <div className="activity-card" key={activity._id}>
                    <img src={activity.images[0]} alt={activity.name} className="activity-image" />
                    <h3>{activity.name}</h3>
                    {/* <p>{activity.trips.length} Trip(s)</p> */}
                    </div>
                ))}
            </div>

            </div>

        </div>
    )
}

export default Activities
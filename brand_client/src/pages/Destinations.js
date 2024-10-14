import PopularDestinations from "../components/PopularDestinations"
import Navbar from "../components/Navbar"
import ResponsiveFooter from "../components/ResponsiveFooter"
import NewHeader from '../components/NewHeader'


const Destinations=()=>{
    return (
        <div>
            <NewHeader/>
            <Navbar/>
            <PopularDestinations/>
            <ResponsiveFooter/>
        </div>

    )
}

export default Destinations
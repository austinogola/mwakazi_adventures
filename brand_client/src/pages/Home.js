import Navbar from "../components/Navbar"
import Header from '../components/Header'
import HeroSection from "../components/HeroSection"
import Hero from "../components/Hero"
import PopularDestinations from "../components/PopularDestinations"
import PopularTrips from "../components/PopularTrips"
import ResponsiveFooter from "../components/ResponsiveFooter"
import Slider from "../components/Slider"
import WhatsAppButton from "../components/WhatsAppButton"
import Heroes from "../components/Heroes"
import SocialMediaButtons from "../components/SocialMediaButtons"
import NewHeader from "../components/NewHeader"
// import HeroSlider from "../components/HeroSlider"


const Home=()=>{
    return(
        <div>
            {/* <Header/> */}
            <NewHeader/>
            <Navbar/>
            {/* <Hero/> */}
            <Heroes/>
            {/* <HeroSlider/> */}
            <PopularTrips/>
            {/* <PopularDestinations/> */}
            <ResponsiveFooter/>
            <WhatsAppButton/>
            <SocialMediaButtons/>
            {/* <HeroSection/> */}
        </div>
        
    )
}

export default Home
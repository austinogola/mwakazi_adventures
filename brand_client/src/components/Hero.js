import main1 from '../images/unsplash1.jpg'


const Hero=()=>{

    const heroStyle = {
        width:'100%',
        // position:'relative',
        height:'500px',
        overflow:'hidden',
        marginBottom:'50px'

      };

    const imgStyle={
        width:'100%',
        objectFit:'contain',
    }
    return (
        <div style={heroStyle}>
            <img style={imgStyle} src={main1}/>
        </div>
    )
}


export default Hero
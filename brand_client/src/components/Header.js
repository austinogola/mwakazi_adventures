import React from 'react';
import logo from '../images/logoW.jpg'
import LogoImg from '../images/Mwakazi-Adventures-Logo-Cropped.png'
import {Link} from 'react-router-dom'

import '../styles/Header.css'

const Header = () => {

  const containerStyle = {
    
    
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00B98B',
  };

  const contactStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // border:'1px solid red'

  };

  const contactItemStyle = {
    margin: '0.2rem 0',
    color: '#333',
  };

  const phoneIconStyle = {
    marginRight: '0.5rem',
  };

  const emailIconStyle = {
    marginRight: '0.5rem',
  };

  const logoHolderStyle={
    display:'flex',
    justifyContent:'end'

  }


//   <div style={logoStyle}>
//           {/* Replace with your actual logo */}
//             <img src={logo} alt="Company Logo" width='30%'/>
//         </div>
//         <div style={contactStyle}>
//           <div style={contactItemStyle}>
//             <span style={phoneIconStyle}>📞</span>
//             <Link href="tel:+1234567890" style={{color: '#333', textDecoration: 'none'}}>+1 (234) 567-890</Link>
//           </div>
//           <div style={contactItemStyle}>
//             <span style={emailIconStyle}>✉️</span>
//             <Link href="mailto:info@travelcompany.com" style={{color: '#333', textDecoration: 'none'}}>info@travelcompany.com</Link>
//           </div>
//         </div>
  return (
    <header className='header'>
      <div className='headerContainer'>
        <div className='logoHolder'>
            <img src={LogoImg} alt="Company Logo" width='120rem'/>
        </div>
        <div className='contactHolder'>
            <p>info@mwakaziadventures.com</p>
            <p>+254723595924</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
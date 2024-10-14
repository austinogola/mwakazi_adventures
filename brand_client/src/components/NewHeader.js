import React from 'react';
import { FiPhoneCall,FiYoutube ,FiInstagram,FiMail  } from "react-icons/fi";
import { AiFillTikTok ,AiOutlineTikTok  } from "react-icons/ai";
import MyAccount from './MyAccount';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
// import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../styles/NewHeader.css'

const NewHeader = () => {
    const ytLink="https://youtube.com/@mwakaziadventures?si=-RALNb3IiW9llNVF"
    const igLink="https://www.instagram.com/mwakazi_adventures/profilecard/?igsh=MW02dXltcGQzbndhcw=="
    const tkLink='https://www.tiktok.com/@mwakazi.adventure?_t=8pFsxCr22Mg&_r=1'
  return (
    <header className='newHeader'>
      <div className='contactInfo'>
        <div className='contactItem'>
            <a href='tel:+254723595924'>
            <span className='iconSpan'><FiPhoneCall color='#FF6E03' size='18px'/></span>
           
            <span>+254 723 595 924</span>
          </a>
        </div>
        <div className='contactItem'>
            <a href="mailto:info@mwakaziadventures.com" target='_blank'>
            <span className='iconSpan'><FiMail color='#FF6E03' size='18px'/></span>
            <span>info@mwakaziadventures.com</span>
          </a>
        </div>
      </div>

      <div className='socialMedia'>
        <a href={ytLink} target='_blank'><span ><FiYoutube color='#FF6E03' size='20px'/></span></a>
        
        <a href={igLink} target='_blank'><span><FiInstagram color='#FF6E03' size='20px'/></span></a>
        <a href={tkLink} target='_blank'><span><AiOutlineTikTok color='#FF6E03' size='20px'/></span></a>
      </div>

      <div className='accountDiv'>
      <MyAccount/>
      </div>
    </header>
  );
};

const styles = {
 
};

export default NewHeader;

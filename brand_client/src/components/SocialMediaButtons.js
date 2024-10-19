import React from 'react';
import '../styles/SocialMediaButtons.css'
import { FiFacebook,FiYoutube,  } from "react-icons/fi";
import { AiFillTikTok ,AiOutlineTikTok  } from "react-icons/ai";
 

const SocialMediaButtons = () => {
  const socialMedia = [
    { name: 'Youtube', icon: <FiYoutube/>, color: '#ED0E03' ,link:"https://youtube.com/@mwakaziadventures?si=-RALNb3IiW9llNVF" },
    { name: 'Instagram', icon: '', color: '#c13584' ,link:"https://www.instagram.com/mwakazi_adventures/profilecard/?igsh=MW02dXltcGQzbndhcw=="},
    { name: 'TikTok', icon: <AiOutlineTikTok />, color: 'black' ,link:'https://www.tiktok.com/@mwakazi.adventure?_t=8pFsxCr22Mg&_r=1'},

  ];

  return (
    <div className="social-media-container">
      {/* <div className="share-text">Share</div> */}
      {socialMedia.map((platform, index) => (
        <a
          key={index}
          href={platform.link}
          target="_blank"
          rel="noopener noreferrer"
          className="social-media-button"
          style={{ backgroundColor: platform.color }}
        >
          {platform.icon === '' ? (
            <i className="instagram-icon"></i>
          ) : (
            platform.icon
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialMediaButtons;
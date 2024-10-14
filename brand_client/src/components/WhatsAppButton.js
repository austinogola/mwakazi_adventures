import React, { useState } from 'react';
import styled from 'styled-components';
import { AiOutlineWhatsApp } from "react-icons/ai";

// Styled components
const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 50px;
  background-color: #25D366;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &:hover {
    background-color: #128C7E;
  }
`;

const ChatBox = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  max-height: 400px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: ${props => (props.isOpen ? 'block' : 'none')};
  z-index: 1001;
`;

const ChatHeader = styled.div`
  background-color: #333;
  color: #fff;
  padding: 1rem;
  font-size: 1.25rem;
  text-align: center;
`;

const ChatBody = styled.div`
  padding: 1rem;
  height: 300px;
  overflow-y: auto;
`;

const WelcomeMessage = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #333;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.25rem;
  cursor: pointer;

 
`;

const WhatsAppLink = styled.a`
  display: block;
  background-color: #25D366;
  color: #fff;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #128C7E;
  }
`;

const WhatAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatBox = () => setIsOpen(!isOpen);

  // Replace with your WhatsApp number
  const whatsappNumber = '+254723595924';
  const message = 'Hello, I have a question about your tours.';
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <>
      <FloatingButton onClick={toggleChatBox}>
        <AiOutlineWhatsApp size='2rem'/>
      </FloatingButton>
      <ChatBox isOpen={isOpen}>
        <ChatHeader>
          <CloseButton onClick={toggleChatBox}>×</CloseButton>
          Chat with us
        </ChatHeader>
        <ChatBody>
          <WelcomeMessage>Hi there! Click the button below to start a conversation with us on WhatsApp.</WelcomeMessage>
          <WhatsAppLink href={whatsappURL} target="_blank" rel="noopener noreferrer">
            Chat on WhatsApp
          </WhatsAppLink>
        </ChatBody>
      </ChatBox>
    </>
  );
};

export default WhatAppButton;

import React from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import styled from 'styled-components';

const ContactContainer = styled(motion.section)`
  width: 100%;
  padding: 60px 20px;
  background: linear-gradient(135deg, #fbe9e7, #f9fbe7);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
`;

const ContactTitle = styled.h2`
  color: #050606;
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  &:before {
    content: "";
    position: absolute;
    width: 60px;
    height: 4px;
    background: #61dafb;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const ContactText = styled.p`
  color: #050606;
  font-size: 1.25rem;
  margin: 0;
`;

const ContactIcon = styled.div`
  font-size: 4rem;
  color: #61dafb;
  margin: 20px auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactSection = () => {
  return (
    <ContactContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ContactTitle><FaEnvelope /> Get in Touch</ContactTitle>
      <ContactIcon><FaEnvelope /></ContactIcon>
      <ContactText>
        If you have any questions or feedback, feel free to reach out to us at{' '}
        <a href="mailto:support@listease.com" className="text-blue-600 hover:underline">support@listease.com</a>. We're here to help!
      </ContactText>
    </ContactContainer>
  );
};

export default ContactSection;

import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const HeroContainer = styled(motion.section)`
  text-align: center;
  padding: 60px;
  background: linear-gradient(135deg, #61dafb, #adb3bc);
  color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  margin-bottom: 30px;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 20px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeroText = styled.p`
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
`;


const HeroSection = () => {
  return (
    <HeroContainer
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <HeroTitle> Welcome to ListEase!</HeroTitle>
      <HeroText>
        At ListEase, we believe in making list management simple, intuitive, and accessible for everyone.
      </HeroText>
    </HeroContainer>
  );
};

export default HeroSection;

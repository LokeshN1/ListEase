import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';

const VisionContainer = styled(motion.section)`
  width: 100%;
  padding: 80px 20px;
  background: #fdfdfd;
  color: #050606;
  text-align: center;
  margin: 0 auto;
  overflow: hidden;
`;

const VisionContent = styled.div`
  z-index: 1;
  padding: 40px 30px;
  background: #61dafb;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: inline-block;
  max-width: 900px;
`;

const VisionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  font-weight: bold;
  color: #050606;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  position: relative;
`;

const VisionText = styled.p`
  font-size: 1.25rem;
  color: #050606;
  line-height: 1.8;
  margin: 0;
`;

const VisionIcon = styled.div`
  font-size: 4rem;
  color: #fdfdfd;
  margin-bottom: 30px;
`;

const VisionSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,  // Trigger the animation only once
    threshold: 0.2,     // Trigger when 20% of the component is in view
  });

  return (
    <VisionContainer
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1 }}
    >
      <VisionContent>
        <VisionIcon><FaStar /></VisionIcon>
        <VisionTitle>Our Vision</VisionTitle>
        <VisionText>
          We envision a world where managing lists is as simple as a few clicks. By providing a dynamic and interactive platform,
          we aim to enhance productivity and organization for individuals and teams alike.
        </VisionText>
      </VisionContent>
    </VisionContainer>
  );
};

export default VisionSection;

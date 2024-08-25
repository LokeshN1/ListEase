import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaList, FaShareAlt, FaSearch } from 'react-icons/fa';
import styled from 'styled-components';

const HowItWorksContainer = styled.section`
  padding: 60px;
  background-color: #f1f5f9;
`;

const StepCard = styled(motion.div)`
  background-color: #ffffff;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 10px;
  text-align: center;
  transition: transform 0.3s, background-color 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
    background-color: #e0f7fa;
  }
`;

const StepTitle = styled.h3`
  color: #050606;
  font-size: 1.5rem;
  margin: 10px 0;
  font-weight: bold;
`;

const StepDescription = styled.p`
  color: #606060;
  font-size: 1rem;
  margin-top: 10px;
`;

const StepIcon = styled.div`
  font-size: 3rem;
  color: #61dafb;
  margin-bottom: 20px;
`;

const HowItWorks = () => {
  return (
    <HowItWorksContainer>
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">🔧 How It Works</h2>
      <div className="flex flex-wrap justify-center">
        {[
          { icon: <FaUser />, title: 'Create an Account', description: "Start by creating your account on ListEase. It's quick and easy!" },
          { icon: <FaList />, title: 'Make Lists', description: "Once you're signed in, you can start creating lists. Each list will have a unique ID." },
          { icon: <FaShareAlt />, title: 'Share Lists', description: "Share the unique list ID with anyone you want. They can access your list on our website." },
          { icon: <FaSearch />, title: 'Search and Find', description: "Recipients can paste the list ID into our search box to view and search through the list." }
        ].map((step, index) => (
          <StepCard
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <StepIcon>{step.icon}</StepIcon>
            <StepTitle>{index + 1}. {step.title}</StepTitle>
            <StepDescription>{step.description}</StepDescription>
          </StepCard>
        ))}
      </div>
    </HowItWorksContainer>
  );
};

export default HowItWorks;

import React from 'react';
import HeroSection from './HeroSection';
import HowItWorks from './HowItWorks';
import VisionSection from './VisionSection';
import ContactSection from './ContectSection';
import { GlobalStyle } from '../GlobalStyles';
const AboutUsPage = () => {
  return (
    <>
      <GlobalStyle />
      <div className="bg-white min-h-screen p-4">
        <HeroSection />
        <HowItWorks />
        <VisionSection />
        <ContactSection />
      </div>
    </>
  );
};

export default AboutUsPage;

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../assets/css/Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main className="content">
        {children}
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;

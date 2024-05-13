import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from "./Footer";
import NavBar from "./NavBar";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userIsLoggedIn = checkAuthenticationStatus();
    setIsLoggedIn(userIsLoggedIn);
  }, []);

  const checkAuthenticationStatus = () => {
    const isAuthenticated = localStorage.getItem('authenticated') === 'true';
    return isAuthenticated;
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
    <NavBar/>
      <section className="home" id="home">
        
        <div className="content">
          <h3>
            "REVOLUTIONIZE <span>YOUR INVOICING </span>EXPERIENCE<br/> WITH OUR PROCESSING AND GENERATOR"
          </h3>
          <p>Click here to begin your invoice journey</p>
          <button className="btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
       
      </section>
      <Footer/>
    </>
  );
};

export default Home;

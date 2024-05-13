import React, { useState, useEffect, useRef } from 'react';
import '../styles/CustomerDashboard.css';
import CustomerLeftSideBar from './CustomerLeftSideBar';
import RightSidebar from './RightSidebar'; // Import RightSidebar component
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import Image1 from '../assets/images/issued-invoice.png';
import Image2 from '../assets/images/paid-invoice.png';
import Image3 from '../assets/images/invoice-due.png';
import Image4 from '../assets/images/Invoice-pana.png';
import Image5 from '../assets/images/search-by-filter.png';
import Image6 from '../assets/images/email.png';
import Horn from '../assets/images/horn.png';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [userInvoices, setUserInvoices] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const sliderRef = useRef(null);
  const textSliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername || '');
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem('username');
        setUsername(storedUsername || '');

        const currentDate = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        setCurrentDate(currentDate);

        if (storedUsername) {
          const response = await fetchUserInvoices(storedUsername);
          setUserInvoices(response.data.invoices);
        }
      } catch (error) {
        console.error('Error fetching user invoices:', error);
      }
    };

    fetchData();
  }, []);

  const fetchUserInvoices = async (username) => {
    return await axios.get(`http://localhost:5000/api/invoice?username=${username}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollLeft += sliderRef.current.offsetWidth;
        if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth - sliderRef.current.offsetWidth) {
          sliderRef.current.scrollLeft = 0;
          setCurrentSlide(0); // Reset the current slide index
        } else {
          setCurrentSlide(currentSlide + 1); // Increment the current slide index
        }
      }
    }, 5000); // Adjust the interval time according to your preference

    return () => clearInterval(interval);
  }, [currentSlide]);

  useEffect(() => {
    const textInterval = setInterval(() => {
      if (textSliderRef.current) {
        textSliderRef.current.scrollLeft += textSliderRef.current.offsetWidth;
        if (textSliderRef.current.scrollLeft >= textSliderRef.current.scrollWidth - textSliderRef.current.offsetWidth) {
          textSliderRef.current.scrollLeft = 0;
        }
      }
    }, 5000); // Adjust the interval time according to your preference

    return () => clearInterval(textInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    localStorage.removeItem('username');
    navigate('/home');
    window.location.reload();
  };

  const handleItemClick = (event) => {
    // Add your logic here for item click
    console.log('Item clicked');
  };

  const activeItem = 'customerdashboard';

  return (
    <>
      <div className='flex-container1'>
        <div className="user-dashboard2">
          <CustomerLeftSideBar activeItem={activeItem} handleItemClick={navigate} handleLogout={handleLogout} />
          <section className="container">
            <div className="userflex">
              Welcome To BillBuddy!!! <br /> {username} <img src={Horn} alt="Horn" />
            </div>
            <div ref={sliderRef} className="slider">
              <img id="slide-1" src={Image1} alt="check out invoices issued on this day"/>
              <img id="slide-2" src={Image2} alt="check out paid invoice"/>
              <img id="slide-3" src={Image3} alt="check out due invoice on this day"/>
              <img id="slide-4" src={Image4} alt="check out unpaid invoice"/>
              <img id="slide-5" src={Image5} alt="search invoices by filter"/>
              <img id="slide-6" src={Image6} alt="Notification through mail"/>
            </div>
            <div ref={textSliderRef} className="text-slider">
              <div className="text-slide">
                <h3>Issued Invoice</h3>
                <p>Check out invoices issued on this day</p>
              </div>
              <div className="text-slide">
                <h3>Paid Invoice</h3>
                <p>Check out paid invoice</p>
              </div>
              <div className="text-slide">
                <h3>Due Invoice</h3>
                <p>Check out due invoice on this day</p>
              </div>
              <div className="text-slide">
                <h3>Unpaid Invoices</h3>
                <p>Check out unpaid invoice</p>
              </div>
              <div className="text-slide">
                <h3>Search Invoice</h3>
                <p>Search invoices by filter</p>
              </div>
              <div className="text-slide">
                <h3>Notification</h3>
                <p>Notification through mail</p>
              </div>
              {/* Add more text slides as needed */}
            </div>
            <div className="slider-nav">
              {[...Array(6)].map((_, index) => (
                <a key={index} href={`#slide-${index + 1}`} className={index === currentSlide ? 'active' : ''} onClick={handleItemClick}></a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <RightSidebar username={username} />
      <Footer />
    </>
  );
};

export default CustomerDashboard;

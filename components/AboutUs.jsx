import React from "react";
import AboutImg from "../assets/images/aboutus.jpg";
import Footer from "./Footer";
import NavBar from "./NavBar";
import Image2 from '../assets/images/image2.jpeg';
import Image1 from '../assets/images/image1.jpg';
import Image3 from '../assets/images/image3.jpg';
import Image4 from '../assets/images/image4.jpg';
import Image5 from '../assets/images/image5.jpg';
import Image6 from '../assets/images/image6.jpg';

const About = () => {
 // Adjust the path based on your project structure

  return (
    <>
      <NavBar/>
      <section className="about" id="about">
        <h1 className="heading">
          <p>about us</p> 
        </h1>
        <div className="row">
          <div className="image">
            <img src={AboutImg} alt="" />
          </div>

          <div className="content">
            <h3>Pioneering Innovation in Invoice Management</h3>
            <p>At [BILL BUDDY], we are committed to simplifying the complexities of invoice processing. Our journey began with a vision to empower businesses with user-friendly tools that streamline invoicing, enabling them to focus on what truly matters - growth and success</p>
            <p>With years of experience and a passion for problem-solving, our dedicated team has crafted an intuitive and efficient invoice generator. We believe in the power of technology to transform financial workflows, making invoicing hassle-free for businesses of all sizes. Join us on this journey of simplification, where innovation meets practicality. Discover a world where invoices are no longer a headache but a seamless part of your operations. Welcome to [Your Company Name], where invoices are made easy."
            </p>
            
          </div>
        </div>
        <br/><br/>
        <span>Meet the Team BillBuddy!!!</span><br/>
        <div className="AboutUs">
        <img src={Image2} alt="" /><br/>
        <span>Shreya V Upadhyaya</span>
        </div>
        <div className="AboutUs2">
        <img src={Image1} alt="" /><br/>
        <span>Sahana MS</span>
        </div>
        <div className="AboutUs2">
        <img src={Image1} alt="" /><br/>
        <span>Sahana MS</span>
        </div>
        <div className="AboutUs3">
        <img src={Image3} alt="" /><br/>
        <span>Padmashree V Hegde</span>
        </div>
        <div className="AboutUs4">
        <img src={Image4} alt="" /><br/>
        <span>Jeevitha MJ</span>
        </div>
        <div className="AboutUs5">
        <img src={Image5} alt="" /><br/>
        <span>Varun Gowda T</span>
        </div>
        <div className="AboutUs6">
        <img src={Image6} alt="" /><br/>
        <span>Tejas AG</span>
        </div>

      </section>
      <Footer/>
    </>
  );
};

export default About;

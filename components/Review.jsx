import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from "./Footer";
import NavBar from "./NavBar";
import ReviewImage from '../assets/images/review.png';

import '../styles/Review.css';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0); // Default to 0
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleReviewSubmit = async (review) => {
    setReviews([...reviews, review]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('rating', rating);
      formData.append('message', message);
  
      const response = await axios.post('http://localhost:5000/api/reviews', formData);
    
      handleReviewSubmit(response.data.review);
      alert('Review submitted successfully!');
      // Clear form fields after submission
      setName('');
      setRating(0);
      setMessage('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  

  return (
    <>
  <NavBar />
    <div className="review">
    <img src={ReviewImage} alt="Phone"/>
      <div className="review-form">
        <h2>Submit Your Review</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={star <= rating ? 'filled' : ''}
                  onClick={() => handleStarClick(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>

         

          <div className="form-group">
            <label htmlFor="message">Review:</label>
            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
          </div>

          <button type="submit">Submit Review</button>
        </form>
      </div>

  <div className="review-list">
  <h2>Existing Reviews</h2>
  {reviews.map((review) => (
    <div key={review.id} className="review-item-container">
      <div className="review-item">
        <div className="user-avatar">
          <div className="avatar-letter">{review.name.charAt(0).toUpperCase()}</div>
        </div>
        <div className="user-details">
          <p>
            <strong>{review.name}</strong> 
          </p>
          <div className="rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= review.rating ? 'filled' : ''}
              >
                &#9733;
              </span>
            ))}
          </div>
          <p>
            <strong>{review.message}</strong> 
          </p>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
    <Footer />
    </>
  );
};

export default Review;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Review.css';
import Footer from "./Footer";
import AdminNavbar from "./AdminNavbar";
const AdminReviews = () => {
  const [reviews, setAdminReviews] = useState([]);
  const [rating, setRating] = useState(0); // Default to 0
  

  const handleStarClick = (selectedRating) => {
    setRating(selectedRating);
  };

  useEffect(() => {
    const fetchAdminReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/reviews');
        setAdminReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
  
    fetchAdminReviews();
  }, []);
  

  // ... (rest of the code for form submission)

  return (
    <>
      <AdminNavbar/>
      <div className="review1">
      
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

export default AdminReviews;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FaStar, FaShoppingCart, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/api/cart/add', {
        productId: id,
        quantity: quantity
      });
      alert('Product added to cart!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding product to cart');
    }
  };

  const handleOrder = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Navigate to checkout or create order directly
    navigate('/cart');
  };

  const submitRating = async () => {
    if (!user || !rating) return;
    try {
      await axios.post(`/api/products/${id}/ratings`, { rating, review });
      fetchProduct();
      setRating(0);
      setReview('');
      alert('Thank you for your review!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail-grid">
          <div className="product-image-section">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className="main-image" />
            ) : (
              <div className="image-placeholder">
                {product.category === 'vegetables' && '🥬'}
                {product.category === 'fruits' && '🍎'}
                {product.category === 'grains' && '🌾'}
                {product.category === 'dairy' && '🥛'}
              </div>
            )}
          </div>

          <div className="product-info-section">
            <h1>{product.name}</h1>
            <div className="product-meta">
              {product.averageRating > 0 && (
                <div className="rating-display">
                  <FaStar className="star-filled" />
                  <span>{product.averageRating} ({product.ratings?.length || 0} reviews)</span>
                </div>
              )}
              <span className="category-badge">{product.category}</span>
            </div>

            <div className="price-section">
              <span className="price">₹{product.price}</span>
              <span className="unit">/{product.unit}</span>
            </div>

            <div className="farmer-info">
              <h3>Farmer Details</h3>
              <p><FaUser /> {product.farmer?.name || 'Farmer'}</p>
              {product.farmer?.farmName && <p>Farm: {product.farmer.farmName}</p>}
              <p><FaMapMarkerAlt /> {product.location?.city || 'Location not specified'}</p>
            </div>

            {product.description && (
              <div className="description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max={product.quantity}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
              <span className="available-qty">Available: {product.quantity} {product.unit}</span>
            </div>

            <div className="action-buttons">
              {product.quantity > 0 ? (
                <>
                  <button onClick={addToCart} className="btn btn-secondary btn-large">
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button onClick={handleOrder} className="btn btn-primary btn-large">
                    Buy Now
                  </button>
                </>
              ) : (
                <button disabled className="btn btn-secondary btn-large">
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>

        {product.ratings && product.ratings.length > 0 && (
          <div className="reviews-section">
            <h2>Reviews</h2>
            <div className="reviews-list">
              {product.ratings.map((ratingItem, idx) => (
                <div key={idx} className="review-card">
                  <div className="review-header">
                    <strong>{ratingItem.user?.name || 'Anonymous'}</strong>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < ratingItem.rating ? 'star-filled' : 'star-empty'}
                        />
                      ))}
                    </div>
                  </div>
                  {ratingItem.review && <p className="review-text">{ratingItem.review}</p>}
                  <p className="review-date">
                    {new Date(ratingItem.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {user && user.role === 'consumer' && (
          <div className="add-review-section">
            <h2>Write a Review</h2>
            <div className="review-form">
              <div className="rating-input">
                <label>Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= rating ? 'star-filled clickable' : 'star-empty clickable'}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Review (optional):</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="4"
                  placeholder="Share your experience..."
                />
              </div>
              <button onClick={submitRating} className="btn btn-primary" disabled={rating === 0}>
                Submit Review
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;


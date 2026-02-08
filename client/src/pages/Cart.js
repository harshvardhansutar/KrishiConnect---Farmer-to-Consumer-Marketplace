import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import './Cart.css';

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutData, setCheckoutData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    paymentMethod: 'cash'
  });

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await axios.get('/api/cart');
      if (res.data && res.data.length > 0) {
        const cartItems = res.data.map(item => ({
          ...item.product,
          quantity: item.quantity
        }));
        setCartItems(cartItems);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put('/api/cart/update', {
        productId,
        quantity: newQuantity
      });
      setCartItems(items =>
        items.map(item =>
          item._id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating quantity');
      fetchCart(); // Refresh cart on error
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`/api/cart/remove/${productId}`);
      setCartItems(items => items.filter(item => item._id !== productId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing item from cart');
      fetchCart(); // Refresh cart on error
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    try {
      const items = cartItems.map(item => ({
        product: item._id,
        quantity: item.quantity
      }));

      const orderData = {
        items,
        shippingAddress: checkoutData.shippingAddress,
        paymentMethod: checkoutData.paymentMethod
      };

      const res = await axios.post('/api/orders', orderData);
      // Clear cart after successful order
      await axios.delete('/api/cart/clear');
      alert('Order placed successfully!');
      setCartItems([]);
      navigate('/orders');
    } catch (error) {
      alert(error.response?.data?.message || 'Error placing order');
    }
  };

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <FaShoppingCart className="empty-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some fresh produce to get started!</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              <h2>Cart Items ({cartItems.length})</h2>
              {cartItems.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    {item.images && item.images.length > 0 ? (
                      <img src={item.images[0]} alt={item.name} />
                    ) : (
                      <div className="item-placeholder">🌾</div>
                    )}
                  </div>
                  <div className="item-details">
                    <h3>{item.name}</h3>
                    <p className="item-farmer">by {item.farmer?.name || 'Farmer'}</p>
                    <p className="item-price">₹{item.price}/{item.unit}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn-remove"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="checkout-section">
              <h2>Checkout</h2>
              <div className="order-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="shipping-form">
                <h3>Shipping Address</h3>
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    value={checkoutData.shippingAddress.street}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: {
                        ...checkoutData.shippingAddress,
                        street: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={checkoutData.shippingAddress.city}
                      onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        shippingAddress: {
                          ...checkoutData.shippingAddress,
                          city: e.target.value
                        }
                      })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={checkoutData.shippingAddress.state}
                      onChange={(e) => setCheckoutData({
                        ...checkoutData,
                        shippingAddress: {
                          ...checkoutData.shippingAddress,
                          state: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={checkoutData.shippingAddress.pincode}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData,
                      shippingAddress: {
                        ...checkoutData.shippingAddress,
                        pincode: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="payment-method">
                <h3>Payment Method</h3>
                <select
                  value={checkoutData.paymentMethod}
                  onChange={(e) => setCheckoutData({
                    ...checkoutData,
                    paymentMethod: e.target.value
                  })}
                >
                  <option value="cash">Cash on Delivery</option>
                  <option value="online">Online Payment</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <button onClick={handleCheckout} className="btn btn-primary btn-large">
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;


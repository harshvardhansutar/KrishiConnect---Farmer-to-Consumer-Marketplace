import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FaBox, FaCheckCircle, FaClock, FaTruck } from 'react-icons/fa';
import './Orders.css';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders/my-orders');
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'shipped':
      case 'processing':
        return <FaTruck className="status-icon processing" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'delivered';
      case 'shipped':
      case 'processing':
        return 'processing';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'pending';
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-orders">
            <FaBox className="empty-icon" />
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here!</p>
            <Link to="/products" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>
                      {getStatusIcon(order.status)}
                      Order #{order._id.slice(-8)}
                    </h3>
                    <p className="order-farmer">Farmer: {order.farmer?.name || 'N/A'}</p>
                    <p className="order-date">
                      Ordered on: {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                    {order.deliveryDate && (
                      <p className="delivery-date">
                        Delivered on: {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="order-status-badge">
                    <span className={`status ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  <h4>Items:</h4>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <div className="item-info">
                        {item.product?.images && item.product.images.length > 0 ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="item-image"
                          />
                        ) : (
                          <div className="item-placeholder">🌾</div>
                        )}
                        <div>
                          <strong>{item.product?.name || 'Product'}</strong>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="item-price">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ₹{order.totalAmount}</strong>
                    <span className="payment-status">
                      Payment: {order.paymentStatus}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <p className="tracking">Tracking: {order.trackingNumber}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;


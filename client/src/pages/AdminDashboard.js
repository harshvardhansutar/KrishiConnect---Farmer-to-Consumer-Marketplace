import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FaUsers, FaBox, FaRupeeSign, FaCheckCircle, FaTimes, FaChartBar } from 'react-icons/fa';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'overview') {
        const res = await axios.get('/api/admin/analytics');
        setAnalytics(res.data);
      }
      if (activeTab === 'users' || activeTab === 'overview') {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data);
      }
      if (activeTab === 'products' || activeTab === 'overview') {
        const res = await axios.get('/api/admin/products');
        setProducts(res.data);
      }
      if (activeTab === 'orders' || activeTab === 'overview') {
        const res = await axios.get('/api/admin/orders');
        setOrders(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyFarmer = async (farmerId) => {
    try {
      await axios.put(`/api/admin/farmers/${farmerId}/verify`);
      fetchData();
      alert('Farmer verified successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error verifying farmer');
    }
  };

  const approveProduct = async (productId) => {
    try {
      await axios.put(`/api/admin/products/${productId}/approve`);
      fetchData();
      alert('Product approved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error approving product');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'users' ? 'active' : ''}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={activeTab === 'orders' ? 'active' : ''}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
        </div>

        {activeTab === 'overview' && analytics && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>{analytics.users.total}</h3>
                <p>Total Users</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>{analytics.users.farmers}</h3>
                <p>Farmers</p>
              </div>
              <div className="stat-card">
                <FaUsers className="stat-icon" />
                <h3>{analytics.users.consumers}</h3>
                <p>Consumers</p>
              </div>
              <div className="stat-card">
                <FaBox className="stat-icon" />
                <h3>{analytics.products.total}</h3>
                <p>Total Products</p>
              </div>
              <div className="stat-card">
                <FaCheckCircle className="stat-icon" />
                <h3>{analytics.products.approved}</h3>
                <p>Approved Products</p>
              </div>
              <div className="stat-card">
                <FaRupeeSign className="stat-icon" />
                <h3>₹{analytics.revenue?.toLocaleString() || 0}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div className="analytics-section">
              <h2>Analytics</h2>
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Orders by Status</h3>
                  <ul>
                    {analytics.orders.byStatus?.map((item, idx) => (
                      <li key={idx}>
                        {item._id}: {item.count}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="analytics-card">
                  <h3>Products by Category</h3>
                  <ul>
                    {analytics.productsByCategory?.map((item, idx) => (
                      <li key={idx}>
                        {item._id}: {item.count}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="dashboard-content">
            <h2>All Users</h2>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {user.role === 'farmer' && (
                          user.isVerified ? (
                            <span className="verified">Verified</span>
                          ) : (
                            <span className="not-verified">Not Verified</span>
                          )
                        )}
                        {user.role !== 'farmer' && <span>-</span>}
                      </td>
                      <td>
                        {user.role === 'farmer' && !user.isVerified && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => verifyFarmer(user._id)}
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="dashboard-content">
            <h2>All Products</h2>
            <div className="products-list">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-farmer">Farmer: {product.farmer?.name || 'N/A'}</p>
                    <p className="product-price">₹{product.price}/{product.unit}</p>
                  </div>
                  <div className="product-status-section">
                    <p className="product-status">
                      {product.isApproved ? (
                        <span className="approved">✓ Approved</span>
                      ) : (
                        <span className="pending">Pending Approval</span>
                      )}
                    </p>
                    {!product.isApproved && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => approveProduct(product._id)}
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="empty-state">No products found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <h2>All Orders</h2>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-8)}</h3>
                      <p>Consumer: {order.consumer?.name}</p>
                      <p>Farmer: {order.farmer?.name}</p>
                      <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.product?.name}</span>
                        <span>Qty: {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <strong>Total: ₹{order.totalAmount}</strong>
                    <span>Payment: {order.paymentStatus}</span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="empty-state">No orders found.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '../hooks/useAuth';
import { FaPlus, FaEdit, FaTrash, FaRupeeSign, FaBox, FaCheckCircle, FaClock } from 'react-icons/fa';
import './Dashboard.css';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: 'vegetables',
    price: '',
    quantity: '',
    unit: 'kg'
  });

  useEffect(() => {
    if (user?.role !== 'farmer') {
      navigate('/');
      return;
    }
    fetchData();
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'overview' || activeTab === 'profile') {
        const res = await axios.get('/api/farmers/profile');
        setProfile(res.data);
      }
      if (activeTab === 'products' || activeTab === 'overview') {
        const res = await axios.get('/api/farmers/products');
        setProducts(res.data);
      }
      if (activeTab === 'orders' || activeTab === 'overview') {
        const res = await axios.get('/api/farmers/orders');
        setOrders(res.data);
      }
      if (activeTab === 'earnings' || activeTab === 'overview') {
        const res = await axios.get('/api/farmers/earnings');
        setEarnings(res.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productForm);
      } else {
        await axios.post('/api/products', productForm);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', category: 'vegetables', price: '', quantity: '', unit: 'kg' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      unit: product.unit
    });
    setShowProductForm(true);
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating order');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Farmer Dashboard</h1>

        <div className="dashboard-tabs">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
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
          <button
            className={activeTab === 'earnings' ? 'active' : ''}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <FaBox className="stat-icon" />
                <h3>{products.length}</h3>
                <p>Total Products</p>
              </div>
              <div className="stat-card">
                <FaClock className="stat-icon" />
                <h3>{orders.filter(o => ['pending', 'confirmed'].includes(o.status)).length}</h3>
                <p>Pending Orders</p>
              </div>
              <div className="stat-card">
                <FaRupeeSign className="stat-icon" />
                <h3>₹{earnings?.totalEarnings?.toLocaleString() || 0}</h3>
                <p>Total Earnings</p>
              </div>
              <div className="stat-card">
                <FaCheckCircle className="stat-icon" />
                <h3>{earnings?.totalOrders || 0}</h3>
                <p>Total Orders</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && profile && (
          <div className="dashboard-content">
            <div className="profile-section">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone || 'Not provided'}</p>
                <p><strong>Farm Name:</strong> {profile.farmName || 'Not provided'}</p>
                <p><strong>Farm Location:</strong> {profile.farmLocation || 'Not provided'}</p>
                <p><strong>Verification Status:</strong> 
                  {profile.isVerified ? (
                    <span className="verified">✓ Verified</span>
                  ) : (
                    <span className="not-verified">Pending Verification</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="dashboard-content">
            <div className="section-header">
              <h2>My Products</h2>
              <button className="btn btn-primary" onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', description: '', category: 'vegetables', price: '', quantity: '', unit: 'kg' });
                setShowProductForm(true);
              }}>
                <FaPlus /> Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleProductSubmit}>
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows="3"
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                          required
                        >
                          <option value="vegetables">Vegetables</option>
                          <option value="fruits">Fruits</option>
                          <option value="grains">Grains</option>
                          <option value="dairy">Dairy</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Unit *</label>
                        <select
                          value={productForm.unit}
                          onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                          required
                        >
                          <option value="kg">kg</option>
                          <option value="dozen">dozen</option>
                          <option value="litre">litre</option>
                          <option value="piece">piece</option>
                          <option value="bunch">bunch</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price (₹) *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          value={productForm.quantity}
                          onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowProductForm(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <h3>{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  <p className="product-price">₹{product.price}/{product.unit}</p>
                  <p className="product-quantity">Available: {product.quantity} {product.unit}</p>
                  <p className="product-status">
                    Status: {product.isApproved ? (
                      <span className="approved">✓ Approved</span>
                    ) : (
                      <span className="pending">Pending Approval</span>
                    )}
                  </p>
                  <div className="product-actions">
                    <button onClick={() => handleEditProduct(product)} className="btn-icon">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteProduct(product._id)} className="btn-icon danger">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {products.length === 0 && (
                <p className="empty-state">No products yet. Add your first product!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="dashboard-content">
            <h2>Orders</h2>
            <div className="orders-list">
              {orders.map(order => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Order #{order._id.slice(-8)}</h3>
                      <p>Customer: {order.consumer?.name}</p>
                      <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status}`}>{order.status}</span>
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
                    {order.status === 'pending' && (
                      <div className="order-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => updateOrderStatus(order._id, 'confirmed')}
                        >
                          Confirm
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => updateOrderStatus(order._id, 'cancelled')}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {order.status === 'confirmed' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateOrderStatus(order._id, 'processing')}
                      >
                        Start Processing
                      </button>
                    )}
                    {order.status === 'processing' && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateOrderStatus(order._id, 'shipped')}
                      >
                        Mark as Shipped
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <p className="empty-state">No orders yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'earnings' && earnings && (
          <div className="dashboard-content">
            <h2>Earnings Overview</h2>
            <div className="earnings-stats">
              <div className="earnings-card">
                <h3>Total Earnings</h3>
                <p className="earnings-amount">₹{earnings.totalEarnings?.toLocaleString() || 0}</p>
              </div>
              <div className="earnings-card">
                <h3>Total Orders</h3>
                <p className="earnings-amount">{earnings.totalOrders || 0}</p>
              </div>
              <div className="earnings-card">
                <h3>Pending Orders</h3>
                <p className="earnings-amount">{earnings.pendingOrders || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;


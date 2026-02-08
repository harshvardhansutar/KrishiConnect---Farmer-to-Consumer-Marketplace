import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaFilter } from 'react-icons/fa';
import './Products.css';

const ConsumerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [filters, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.location) params.append('location', filters.location);

      const res = await axios.get(`/api/products?${params.toString()}`);
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', location: '' });
    setSearchTerm('');
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Browse Fresh Produce</h1>

        <div className="products-header">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            className="btn btn-outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>Category</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="dairy">Dairy</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Min Price (₹)</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
              />
            </div>
            <div className="filter-group">
              <label>Max Price (₹)</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
              />
            </div>
            <div className="filter-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                placeholder="City or State"
              />
            </div>
            <button className="btn btn-secondary" onClick={clearFilters}>
              Clear Filters
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <>
            {products.length === 0 ? (
              <div className="empty-state">
                <p>No products found. Try adjusting your search or filters.</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <Link key={product._id} to={`/products/${product._id}`} className="product-card-link">
                    <div className="product-card">
                      <div className="product-image">
                        {product.images && product.images.length > 0 ? (
                          <img src={product.images[0]} alt={product.name} />
                        ) : (
                          <div className="product-placeholder">
                            {product.category === 'vegetables' && '🥬'}
                            {product.category === 'fruits' && '🍎'}
                            {product.category === 'grains' && '🌾'}
                            {product.category === 'dairy' && '🥛'}
                            {!['vegetables', 'fruits', 'grains', 'dairy'].includes(product.category) && '🌾'}
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3>{product.name}</h3>
                        <p className="product-farmer">by {product.farmer?.name || 'Farmer'}</p>
                        <p className="product-location">
                          📍 {product.location?.city || 'Location not specified'}
                        </p>
                        <div className="product-footer">
                          <span className="product-price">₹{product.price}/{product.unit}</span>
                          {product.averageRating > 0 && (
                            <span className="product-rating">⭐ {product.averageRating}</span>
                          )}
                        </div>
                        {product.quantity > 0 ? (
                          <span className="product-availability in-stock">In Stock</span>
                        ) : (
                          <span className="product-availability out-of-stock">Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConsumerProducts;


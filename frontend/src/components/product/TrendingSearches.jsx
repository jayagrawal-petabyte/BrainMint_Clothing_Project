import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchTrendingSearches } from '../../services/api';
import './TrendingSearches.css';

const TrendingSearches = ({ compact = false }) => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const getSearches = async () => {
      try {
        const data = await fetchTrendingSearches();
        if (isMounted) {
          setSearches(data || []);
        }
      } catch (err) {
        console.error('Failed to load trending searches', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    getSearches();
    return () => {
      isMounted = false;
    };
  }, []);

  const getKeywordText = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item.label || item.value || '';
  };

  const handleChipClick = (item) => {
    const keyword = getKeywordText(item);
    if (keyword) {
      navigate(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  if (loading) {
    return (
      <div className={`trending-searches-container ${compact ? 'compact' : ''}`}>
        {!compact && (
          <div className="section-header">
            <h2 className="section-title">Trending Searches</h2>
          </div>
        )}
        <div className="trending-chips skeleton-container">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="trending-chip-skeleton pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!loading && searches.length === 0) {
    return null;
  }

  return (
    <div className={`trending-searches-container ${compact ? 'compact' : ''}`}>
      {!compact && (
        <div className="section-header">
          <h2 className="section-title">Trending Searches</h2>
        </div>
      )}
      {compact && <span className="trending-label-compact">Trending:</span>}
      <div className="trending-chips">
        {searches.map((item, index) => {
          const text = getKeywordText(item);
          return (
            <motion.button
              key={text || index}
              className="trending-chip"
              onClick={() => handleChipClick(item)}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
            >
              <span className="chip-text">{text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingSearches;

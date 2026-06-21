import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { fetchPopularProducts } from '../../services/api';
import './PopularProducts.css';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const getProducts = async () => {
      try {
        const data = await fetchPopularProducts();
        if (isMounted) {
          setProducts(data || []);
        }
      } catch {
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    getProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  if (loading) {
    return (
      <div className="popular-products-section loading">
        <div className="popular-tagline">Trending Curations</div>
        <div className="section-header">
          <h2 className="section-title">Popular Right Now</h2>
        </div>
        <div className="popular-skeleton-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="product-card-skeleton pulse">
              <div className="skeleton-image" />
              <div className="skeleton-text title" />
              <div className="skeleton-text rating" />
              <div className="skeleton-text price" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="popular-products-section"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={sectionVariants}
    >
      <div className="popular-tagline">Trending Curations</div>
      <div className="section-header">
        <h2 className="section-title">Popular Right Now</h2>

        <div className="popular-nav-actions">
          <button className="popular-nav-btn popular-prev-btn" aria-label="Previous Slide">
            <ChevronLeft size={18} />
          </button>
          <button className="popular-nav-btn popular-next-btn" aria-label="Next Slide">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="popular-carousel-wrapper">
        <Swiper
          modules={[Navigation, Pagination]}
          navigation={{
            prevEl: '.popular-prev-btn',
            nextEl: '.popular-next-btn',
          }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={4}
          breakpoints={{
            320: {
              slidesPerView: 1.3,
              spaceBetween: 15
            },
            480: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30
            }
          }}
          className="popular-swiper"
        >
          {products.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.section>
  );
};

export default PopularProducts;

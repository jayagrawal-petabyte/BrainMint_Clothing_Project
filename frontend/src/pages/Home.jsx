import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from '../components/ProductCard';
import PromoBanner from '../components/PromoBanner';
import TrustBadges from '../components/TrustBadges';
import { fetchNewArrivals } from '../services/api';
import './Home.css';

const Home = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchNewArrivals();

        // backend response safety
        setNewArrivals(products || []);
      } catch (error) {
        console.error(
          'Failed to fetch new arrivals:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const heroSlides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600",
      badge: "NEW COLLECTION",
      title: "Elegance<br/>Redefined",
      subtitle: "Discover curated collections of timeless essentials, delicate dresses, and modern silhouettes for the contemporary woman.",
      link: "/shop?category=dresses",
      align: "left"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1600",
      badge: "SUMMER '26",
      title: "Turn Heads,<br/>Effortlessly",
      subtitle: "Fits that carry the vibe. Confidence, styled to perfection for your next party.",
      link: "/shop?category=essentials",
      align: "left"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600",
      badge: "EXCLUSIVE",
      title: "Shape of<br/>Summer",
      subtitle: "Lightweight fabrics, breathtaking prints, and the ultimate comfort for sunny days.",
      link: "/shop",
      align: "center"
    }
  ];

  return (
    <div className="home-container">
      <section className="hero-full">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          navigation={true}
          pagination={{
            clickable: true,
            renderBullet: function (index, className) {
              return `
                <span class="${className}">
                  <svg viewBox="0 0 40 40" class="timer-svg">
                    <circle cx="20" cy="20" r="18" class="bg-circle" />
                    <circle cx="20" cy="20" r="18" class="progress-circle" />
                  </svg>
                  <span class="dot"></span>
                </span>
              `;
            },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="hero-swiper-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <Link to={slide.link} className="hero-slide-link">
                <div 
                  className={`hero-slide-content align-${slide.align}`}
                  style={{ backgroundImage: `url(${slide.image})` }}
                >
                  <div className="hero-slide-overlay"></div>
                  
                  <motion.div 
                    className="hero-text-content"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="hero-badge">{slide.badge}</span>
                    <h1 dangerouslySetInnerHTML={{ __html: slide.title }}></h1>
                    <p>{slide.subtitle}</p>
                    <button className="shop-now-btn">Shop Collection</button>
                  </motion.div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <motion.section 
        className="featured-categories"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="section-title">
          Shop by Category
        </h2>

        <div className="categories-grid">
          <Link
            to="/shop?category=Dress"
            className="category-tile"
          >
            <img
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
              alt="Dresses"
            />
            <div className="category-content">
              <h3>Dresses</h3>
            </div>
          </Link>

          <Link
            to="/shop?category=Top"
            className="category-tile"
          >
            <img
              src="https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500"
              alt="Tops"
            />
            <div className="category-content">
              <h3>Tops</h3>
            </div>
          </Link>

          <Link
            to="/shop?category=Skirt"
            className="category-tile"
          >
            <img
              src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500"
              alt="Skirts"
            />
            <div className="category-content">
              <h3>Skirts</h3>
            </div>
          </Link>

          <Link
            to="/shop?category=Coat"
            className="category-tile"
          >
            <img
              src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500"
              alt="Coats"
            />
            <div className="category-content">
              <h3>Coats</h3>
            </div>
          </Link>
        </div>
      </motion.section>

      <PromoBanner />
      <TrustBadges />

      <motion.section 
        className="new-arrivals"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="section-header">
          <h2 className="section-title">
            New Arrivals
          </h2>

          <Link
            to="/shop"
            className="view-all-link"
          >
            View All
          </Link>
        </div>

        <div className="new-arrivals-row">
          {loading ? (
            <p>Loading products...</p>
          ) : (
            newArrivals.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          )}
        </div>
      </motion.section>
    </div>
  );
};

export default Home;

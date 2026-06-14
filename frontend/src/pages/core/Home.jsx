import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from '../../components/product/ProductCard';
import PromoBanner from '../../components/shop/PromoBanner';
import TrustBadges from '../../components/ui/TrustBadges';
import TrendingSearches from '../../components/product/TrendingSearches';
import PopularProducts from '../../components/product/PopularProducts';
import { fetchNewArrivals } from '../../services/api';
import { ShoppingBag, Shirt, Sparkles } from 'lucide-react';
import './Home.css';

const Home = ({ onSplashActive }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const location = useLocation();

  // Splash screen runs on every mount (home page entry)
  const [loadingHome, setLoadingHome] = useState(true);

  // Re-trigger splash loader on every click of Home or Logo (history push)
  useEffect(() => {
    if (location.pathname === '/') {
      setLoadingHome(true);
    }
  }, [location.key]);

  useEffect(() => {
    if (loadingHome) {
      if (onSplashActive) onSplashActive(true);
      const timer = setTimeout(() => {
        setLoadingHome(false);
        if (onSplashActive) onSplashActive(false);
      }, 2200);
      return () => {
        clearTimeout(timer);
        if (onSplashActive) onSplashActive(false);
      };
    }
  }, [loadingHome, onSplashActive]);

  const isDark = theme === 'dark';
  const splashBg = isDark ? "#0a0a0a" : "#FAF9F6";
  const splashTextColor = isDark ? "#ffffff" : "#111111";
  const iconColor = isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(17, 17, 17, 0.45)";
  const progressBg = isDark 
    ? "linear-gradient(to right, var(--ltn__secondary-color) 0%, #ffffff 100%)" 
    : "linear-gradient(to right, var(--ltn__secondary-color) 0%, #111111 100%)";

  const floatingWallpaperItems = [
    // Top Row
    { Icon: ShoppingBag, size: 28, x: "8%", y: "10%", delay: 0 },
    { Icon: Shirt, size: 36, x: "32%", y: "8%", delay: 0.3 },
    { Icon: Sparkles, size: 24, x: "50%", y: "6%", delay: 0.1 },
    { Icon: ShoppingBag, size: 28, x: "68%", y: "8%", delay: 0.4 },
    { Icon: Shirt, size: 32, x: "88%", y: "12%", delay: 0.2 },
    
    // Upper Middle Row (Outer Sides)
    { Icon: Sparkles, size: 20, x: "5%", y: "28%", delay: 0.5 },
    { Icon: ShoppingBag, size: 24, x: "92%", y: "26%", delay: 0.15 },
    
    // Lower Middle Row (Outer Sides)
    { Icon: Shirt, size: 30, x: "6%", y: "55%", delay: 0.25 },
    { Icon: Sparkles, size: 24, x: "90%", y: "58%", delay: 0.45 },
    
    // Bottom Rows
    { Icon: ShoppingBag, size: 32, x: "8%", y: "76%", delay: 0.1 },
    { Icon: Shirt, size: 28, x: "28%", y: "88%", delay: 0.35 },
    { Icon: Sparkles, size: 20, x: "48%", y: "90%", delay: 0.5 },
    { Icon: ShoppingBag, size: 26, x: "70%", y: "86%", delay: 0.2 },
    { Icon: Shirt, size: 36, x: "86%", y: "78%", delay: 0.4 },

    // Intermediate Safe Diagonals (Out of the exact center: x:35-65%, y:35-65%)
    { Icon: Sparkles, size: 22, x: "22%", y: "20%", delay: 0.6 },
    { Icon: ShoppingBag, size: 24, x: "74%", y: "22%", delay: 0.15 },
    { Icon: Shirt, size: 26, x: "20%", y: "68%", delay: 0.3 },
    { Icon: Sparkles, size: 24, x: "78%", y: "66%", delay: 0.55 }
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchNewArrivals();

        // backend response safety
        setNewArrivals(products || []);
      } catch {
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

  // Dynamic staggered variants for grid cards
  const gridVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <>
      <AnimatePresence>
        {loadingHome && (
          <motion.div
            className="home-splash-backdrop"
            initial={{ opacity: 1 }}
            exit={{ 
              y: "-100%",
              transition: { duration: 0.8, ease: [0.85, 0, 0.15, 1] }
            }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: splashBg,
              zIndex: 999999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden"
            }}
          >
            {/* Elegant Floating Fashion Wallpaper Pattern */}
            {floatingWallpaperItems.map((item, index) => {
              const Icon = item.Icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 0.8, 0.8, 0],
                    scale: [0.8, 1.1, 1.1, 0.8],
                    y: [0, -45],
                    rotate: [0, 20, -20, 0]
                  }}
                  transition={{
                    duration: 2.2,
                    times: [0, 0.2, 0.8, 1],
                    ease: "easeInOut",
                    delay: item.delay
                  }}
                  style={{
                    position: "absolute",
                    left: item.x,
                    top: item.y,
                    color: iconColor,
                    zIndex: 1,
                    pointerEvents: "none"
                  }}
                >
                  <Icon size={item.size} />
                </motion.div>
              );
            })}

            <motion.div
              className="neon-glow-logo"
              initial={{ opacity: 0, scale: 0.9, letterSpacing: "0px" }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                scale: [0.95, 1, 1.02, 1.05],
                letterSpacing: ["2px", "5px", "7px", "9px"]
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut"
              }}
              style={{
                fontFamily: "var(--ltn__heading-font)",
                fontSize: "46px",
                fontWeight: 800,
                color: splashTextColor,
                textAlign: "center",
                zIndex: 2
              }}
            >
              Princess Size Plus Collection<span style={{ color: "var(--ltn__secondary-color, #f24c5c)" }}>.</span>
            </motion.div>
            
            {/* Elegant loader line */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "4px",
                background: progressBg
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="home-container">
      {/* Cinematic Swiper Hero */}
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
                <div className={`hero-slide-content align-${slide.align}`}>
                  {/* Separate BG container for smooth Ken Burns pan */}
                  <div 
                    className="hero-slide-bg"
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  <div className="hero-slide-overlay"></div>
                  
                  <div className="hero-text-content">
                    <motion.span 
                      className="hero-badge"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {slide.badge}
                    </motion.span>
                    
                    <motion.h1 
                      dangerouslySetInnerHTML={{ __html: slide.title }}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    />
                    
                    <motion.p
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {slide.subtitle}
                    </motion.p>
                    
                    <motion.button 
                      className="shop-now-btn"
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.5, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Shop Collection
                    </motion.button>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Shop By Category Staggered Reveal */}
      <section className="featured-categories">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          Shop by Category
        </motion.h2>

<motion.div
  className="categories-grid"
  variants={gridVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true, margin: "-80px" }}
>
  <motion.div variants={itemVariants}>
    <Link
      to="/shop?category=Dress"
      className="category-tile"
      aria-label="Shop Dresses"
    >
      <img
        src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
        alt="Dresses"
      />
      <div className="category-content">
        <h3>Dresses</h3>
      </div>
    </Link>
  </motion.div>

  <motion.div variants={itemVariants}>
    <Link
      to="/shop?category=Top"
      className="category-tile"
      aria-label="Shop Tops"
    >
      <img
        src="https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=500"
        alt="Tops"
      />
      <div className="category-content">
        <h3>Tops</h3>
      </div>
    </Link>
  </motion.div>

  <motion.div variants={itemVariants}>
    <Link
      to="/shop?category=Skirt"
      className="category-tile"
      aria-label="Shop Skirts"
    >
      <img
        src="https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500"
        alt="Skirts"
      />
      <div className="category-content">
        <h3>Skirts</h3>
      </div>
    </Link>
  </motion.div>

  <motion.div variants={itemVariants}>
    <Link
      to="/shop?category=Coat"
      className="category-tile"
      aria-label="Shop Coats"
    >
      <img
        src="https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500"
        alt="Coats"
      />
      <div className="category-content">
        <h3>Coats</h3>
      </div>
    </Link>
  </motion.div>
</motion.div>
</section>
      {/* Scroll reveals for secondary banners */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <PromoBanner />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <TrustBadges />
      </motion.div>

      {/* New Arrivals Staggered Row */}
      <section className="new-arrivals">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="section-title">
            New Arrivals
          </h2>

          <Link to="/shop" className="view-all-link">
            View All
          </Link>
        </motion.div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading products...</p>
        ) : (
          <motion.div 
            className="new-arrivals-row"
            variants={gridVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            {newArrivals.map((product) => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Trending Searches & Popular Products */}
      <TrendingSearches />
      <PopularProducts />
    </div>
  </>
);
};

export default Home;

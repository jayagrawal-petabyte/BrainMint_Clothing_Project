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
import { ShoppingBag, Shirt, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import logoUrl from '../../assets/logo.png';
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
  const splashBg = isDark ? "#0a0a0a" : "#ffffff";
  const splashTextColor = isDark ? "#ffffff" : "#111111";
  const iconColor = isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(17, 17, 17, 0.45)";
  const progressBg = isDark 
    ? "linear-gradient(to right, var(--ltn__secondary-color) 0%, #ffffff 100%)" 
    : "linear-gradient(to right, var(--ltn__secondary-color) 0%, #111111 100%)";

  const floatingWallpaperItems = [
    // Top Row
    { Icon: ShoppingBag, size: 28, x: "8%", y: "10%", delayClass: "delay-0" },
    { Icon: Shirt, size: 36, x: "32%", y: "8%", delayClass: "delay-5" },
    { Icon: Sparkles, size: 24, x: "50%", y: "6%", delayClass: "delay-1" },
    { Icon: ShoppingBag, size: 28, x: "68%", y: "8%", delayClass: "delay-7" },
    { Icon: Shirt, size: 32, x: "88%", y: "12%", delayClass: "delay-3" },
    // Upper Middle Row (Outer Sides)
    { Icon: Sparkles, size: 20, x: "5%", y: "28%", delayClass: "delay-9" },
    { Icon: ShoppingBag, size: 24, x: "92%", y: "26%", delayClass: "delay-2" },
    // Lower Middle Row (Outer Sides)
    { Icon: Shirt, size: 30, x: "6%", y: "55%", delayClass: "delay-4" },
    { Icon: Sparkles, size: 24, x: "90%", y: "58%", delayClass: "delay-8" },
    // Bottom Rows
    { Icon: ShoppingBag, size: 32, x: "8%", y: "76%", delayClass: "delay-1" },
    { Icon: Shirt, size: 28, x: "28%", y: "88%", delayClass: "delay-6" },
    { Icon: Sparkles, size: 20, x: "48%", y: "90%", delayClass: "delay-9" },
    { Icon: ShoppingBag, size: 26, x: "70%", y: "86%", delayClass: "delay-3" },
    { Icon: Shirt, size: 36, x: "86%", y: "78%", delayClass: "delay-7" },
    // Intermediate Safe Diagonals
    { Icon: Sparkles, size: 22, x: "22%", y: "20%", delayClass: "delay-11" },
    { Icon: ShoppingBag, size: 24, x: "74%", y: "22%", delayClass: "delay-2" },
    { Icon: Shirt, size: 26, x: "20%", y: "68%", delayClass: "delay-5" },
    { Icon: Sparkles, size: 24, x: "78%", y: "66%", delayClass: "delay-10" }
  ];

  // Mobile: fewer icons but evenly spread across all screen regions
  const mobileWallpaperItems = [
    { Icon: ShoppingBag, size: 22, x: "10%", y: "8%", delayClass: "delay-0" },
    { Icon: Shirt, size: 26, x: "80%", y: "10%", delayClass: "delay-3" },
    { Icon: Sparkles, size: 18, x: "8%", y: "30%", delayClass: "delay-7" },
    { Icon: ShoppingBag, size: 20, x: "85%", y: "32%", delayClass: "delay-1" },
    { Icon: Shirt, size: 22, x: "12%", y: "62%", delayClass: "delay-5" },
    { Icon: Sparkles, size: 20, x: "82%", y: "60%", delayClass: "delay-9" },
    { Icon: ShoppingBag, size: 24, x: "15%", y: "85%", delayClass: "delay-2" },
    { Icon: Shirt, size: 22, x: "78%", y: "84%", delayClass: "delay-6" }
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const activeWallpaperItems = isMobile ? mobileWallpaperItems : floatingWallpaperItems;

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
            {/* Elegant Floating Fashion Wallpaper Pattern — Pure CSS, zero JS overhead */}
            {activeWallpaperItems.map((item, index) => {
              const Icon = item.Icon;
              return (
                <div
                  key={index}
                  className={`splash-float-icon ${item.delayClass}`}
                  style={{
                    left: item.x,
                    top: item.y,
                    color: iconColor
                  }}
                >
                  <Icon size={item.size} />
                </div>
              );
            })}

            <motion.div
              className="neon-glow-logo"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: [0, 0.9, 0.9, 0],
                scale: [0.95, 1, 1.02, 1.05]
              }}
              transition={{
                duration: 2.2,
                times: [0, 0.2, 0.8, 1],
                ease: "easeInOut"
              }}
              style={{
                textAlign: "center",
                zIndex: 2,
                position: "relative",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
                willChange: "transform, opacity",
                transform: "translateZ(0)"
              }}
            >
              {/* Main Crisp Logo */}
              <img src={logoUrl} alt="Princess Size+ Collection" style={{ height: '300px', width: 'auto', display: 'block', position: 'relative', zIndex: 1 }} />
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

      {!loadingHome && (
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

          <div className="popular-nav-actions" style={{ marginLeft: 'auto', marginRight: '20px' }}>
            <button className="popular-nav-btn new-arrivals-prev-btn" aria-label="Previous Slide">
              <ChevronLeft size={18} />
            </button>
            <button className="popular-nav-btn new-arrivals-next-btn" aria-label="Next Slide">
              <ChevronRight size={18} />
            </button>
          </div>

          <Link to="/shop" className="view-all-link">
            View All
          </Link>
        </motion.div>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Loading products...</p>
        ) : (
          <motion.div 
            className="popular-carousel-wrapper"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: '.new-arrivals-prev-btn',
                nextEl: '.new-arrivals-next-btn',
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
              {newArrivals.slice(0, 8).map((product) => (
                <SwiperSlide key={product._id || product.id}>
                  <ProductCard product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        )}
      </section>

      {/* Trending Searches & Popular Products */}
      <TrendingSearches />
      <PopularProducts />
    </div>
      )}
  </>
);
};

export default Home;

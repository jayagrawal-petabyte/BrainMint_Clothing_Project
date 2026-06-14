import { useTheme } from "../../context/ThemeContext";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaGift,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";
import { Sparkles, Maximize, Globe, Heart, ShoppingBag } from 'lucide-react';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import "./About.css";

const features = [
  {
    icon: <FaTruck />,
    title: "Free Shipping",
    text: "On all orders over ₹2,500",
  },
  {
    icon: <FaStar />,
    title: "Premium Quality",
    text: "Handpicked fabrics",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure checkout",
    text: "Protected by RazorPay",
  },
  {
    icon: <FaGift />,
    title: "Offer & gift here",
    text: "On all orders over",
  },
];

const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Fashion Enthusiast",
    feedback:
      "Princess Size+ Collection completely changed how I shop for everyday fashion. Premium quality and the fit is perfect.",
  },
  {
    name: "Priya Mehta",
    role: "College Student",
    feedback:
      "The designs feel modern yet minimal. Finally found a brand that matches my vibe without compromising comfort.",
  },
  {
    name: "Rohan Verma",
    role: "Working Professional",
    feedback:
      "Loved the fabric quality. The clothes genuinely feel premium and delivery was super smooth.",
  },
  {
    name: "Sneha Kapoor",
    role: "Content Creator",
    feedback:
      "Princess Size+ Collection outfits instantly became my go-to styling pieces. Super versatile and aesthetic.",
  },
  {
    name: "Aditya Singh",
    role: "Streetwear Lover",
    feedback:
      "Minimal, stylish, and insanely comfortable. Exactly what modern streetwear should feel like.",
  },
  {
    name: "Neha Gupta",
    role: "Designer",
    feedback:
      "The attention to detail in stitching and fabric quality really stands out from other brands.",
  },
];

const About = () => {
  const swiperRef = useRef(null);
  const { theme } = useTheme();

  const isDark =
    theme === "dark";
  return (
    <div
      style={{
        background: "var(--white-7)",
        minHeight: "100vh",
        paddingBottom: "120px",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          padding: "50px 20px 120px",
          background: isDark
            ? "linear-gradient(135deg, rgba(26,26,26,1) 0%, rgba(17,17,17,1) 100%)"
            : "linear-gradient(135deg, rgba(246,244,241,1) 0%, rgba(250,249,246,1) 100%)",
        }}
      >
        {/* FEATURES */}
        <div
          style={{
            maxWidth: "1250px",
            margin: "0 auto",
            background: isDark ? "#1e1e1e" : "#faf8f5",
            border: "1px solid rgba(0,0,0,0.05)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            overflow: "hidden",
            boxShadow:
              "-8px 12px 30px rgba(0,0,0,0.05), 0px 6px 15px rgba(0,0,0,0.04)",
          }}
        >
          {features.map((item, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "22px",
                padding: "42px 34px",
                transition: "none",
                transform: "none",
                borderRight:
                  index !== features.length - 1
                    ? "1px solid var(--border-color-1)"
                    : "none",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  color: "var(--ltn__heading-color)",
                  minWidth: "55px",
                }}
              >
                {item.icon}
              </div>

              <div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "var(--ltn__heading-color)",
                    marginBottom: "6px",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    color: "var(--ltn__paragraph-color)",
                    lineHeight: "1.6",
                  }}
                >
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ABOUT CONTENT */}
        <motion.section
          className="about-content-grid"
          style={{
            margin: "70px 0 0",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            alignItems: "stretch",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 5% 40px 5%" }}>
            <div style={{ maxWidth: "650px", width: "100%", paddingRight: "4vw" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "28px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "1px",
                    background: "var(--ltn__secondary-color)",
                  }}
                />

                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: "400",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    color: "var(--ltn__heading-color)",
                    fontFamily: "var(--ltn__heading-font)",
                  }}
                >
                  About Us
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px", flexWrap: "wrap" }}>
                <h1
                  style={{
                    fontFamily: "var(--ltn__heading-font)",
                    fontSize: "48px",
                    fontWeight: "600",
                    lineHeight: "1.2",
                    color: "var(--ltn__heading-color)",
                    letterSpacing: "-1px",
                    margin: 0
                  }}
                >
                  From Vellore To Global
                </h1>
                <div style={{ color: "var(--ltn__secondary-color)", display: "flex", alignItems: "center" }}>
                  <Globe size={38} strokeWidth={1.5} />
                </div>
              </div>

              <h3
                style={{
                  fontFamily: "var(--ltn__heading-font)",
                  fontSize: "24px",
                  fontWeight: "500",
                  lineHeight: "1.3",
                  color: "var(--ltn__heading-color)",
                  marginBottom: "20px",
                }}
              >
                Designed For Every Curve, Inspired By Every Woman.
              </h3>

              <p
                style={{
                  fontSize: "16px",
                  color: "var(--ltn__paragraph-color)",
                  lineHeight: "1.9",
                  fontWeight: "300",
                  marginBottom: "20px",
                  maxWidth: "550px",
                }}
              >
                We believe every woman deserves to feel confident, beautiful, and comfortable in what she wears. Starting from Vellore and reaching customers across the world, our mission is to bring fashionable women's clothing in sizes ranging from S to 12XL.
              </p>

              <p
                style={{
                  fontSize: "16px",
                  color: "var(--ltn__paragraph-color)",
                  lineHeight: "1.9",
                  fontWeight: "300",
                  marginBottom: "20px",
                  maxWidth: "550px",
                }}
              >
                Our collections are carefully chosen to celebrate women of all shapes and sizes, offering styles that blend comfort, elegance, and everyday confidence. Whether you're looking for effortless daily wear or statement pieces, we bring you fashion that fits both your style and your personality.
              </p>

              <p
                style={{
                  fontSize: "16px",
                  color: "var(--ltn__paragraph-color)",
                  lineHeight: "1.9",
                  fontWeight: "300",
                  marginBottom: "28px",
                  maxWidth: "550px",
                }}
              >
                At the heart of our brand is inclusivity—because style has no size limit. From Vellore to Global, we're proud to help women everywhere express themselves through fashion.
              </p>

              <div
                style={{
                  borderLeft: "2px solid var(--ltn__secondary-color)",
                  paddingLeft: "24px",
                  marginBottom: "45px",
                }}
              >
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "400",
                    lineHeight: "1.8",
                    color: "var(--ltn__heading-color)",
                    fontStyle: "italic",
                    maxWidth: "500px",
                  }}
                >
                  "Every woman deserves fashion that fits, flatters, and inspires confidence."
                </p>
              </div>

              <div style={{ marginBottom: "50px", marginTop: "30px", width: "100%" }}>
                <h3 style={{ fontSize: "22px", marginBottom: "25px", fontFamily: "var(--ltn__heading-font)", color: "var(--ltn__heading-color)", fontWeight: "600" }}>Why Shop With Us</h3>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "16px", maxWidth: "550px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 20px", borderRadius: "12px", background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9f9", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "45px", height: "45px", borderRadius: "50%", background: isDark ? "rgba(229, 84, 114, 0.15)" : "rgba(229, 84, 114, 0.1)", color: "var(--ltn__secondary-color)" }}>
                      <Sparkles size={20} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: "15px", color: "var(--ltn__heading-color)", fontWeight: "500" }}>Women's Fashion for Every Occasion</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 20px", borderRadius: "12px", background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9f9", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "45px", height: "45px", borderRadius: "50%", background: isDark ? "rgba(229, 84, 114, 0.15)" : "rgba(229, 84, 114, 0.1)", color: "var(--ltn__secondary-color)" }}>
                      <Maximize size={20} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: "15px", color: "var(--ltn__heading-color)", fontWeight: "500" }}>Sizes Available from S to 12XL</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 20px", borderRadius: "12px", background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9f9", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "45px", height: "45px", borderRadius: "50%", background: isDark ? "rgba(229, 84, 114, 0.15)" : "rgba(229, 84, 114, 0.1)", color: "var(--ltn__secondary-color)" }}>
                      <Globe size={20} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: "15px", color: "var(--ltn__heading-color)", fontWeight: "500" }}>Worldwide Shipping Available</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 20px", borderRadius: "12px", background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9f9", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "45px", height: "45px", borderRadius: "50%", background: isDark ? "rgba(229, 84, 114, 0.15)" : "rgba(229, 84, 114, 0.1)", color: "var(--ltn__secondary-color)" }}>
                      <Heart size={20} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: "15px", color: "var(--ltn__heading-color)", fontWeight: "500" }}>Inclusive Styles for Every Body Type</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "18px", padding: "16px 20px", borderRadius: "12px", background: isDark ? "rgba(255,255,255,0.03)" : "#f9f9f9", border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "#f0f0f0"}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "45px", height: "45px", borderRadius: "50%", background: isDark ? "rgba(229, 84, 114, 0.15)" : "rgba(229, 84, 114, 0.1)", color: "var(--ltn__secondary-color)" }}>
                      <ShoppingBag size={20} strokeWidth={1.5} />
                    </div>
                    <span style={{ fontSize: "15px", color: "var(--ltn__heading-color)", fontWeight: "500" }}>Trendy, Comfortable & Affordable</span>
                  </div>
                </div>
              </div>

              <Link
                to="/shop"
                style={{
                  background: "var(--ltn__primary-color)",
                  color: "var(--white-7)",
                  border: "1px solid var(--ltn__primary-color)",
                  padding: "16px 36px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.4s ease",
                  textDecoration: "none",
                  display: "inline-block",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "var(--ltn__heading-color)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "var(--ltn__primary-color)";
                  e.target.style.color = "var(--white-7)";
                }}
              >
                Explore Collection
              </Link>
            </div>
          </div>

          {/* IMAGE SIDE */}
          <div
            style={{
              position: "relative",
              height: "100%",
            }}
          >
            <img
              src="/cloth1.jpg"
              alt="Princess Size Plus Collection"
              style={{
                width: "100%",
                height: "100%",
                minHeight: "750px",
                objectFit: "cover",
              }}
            />

            {/* FLOATING CARD */}
            <div
              style={{
                position: "absolute",
                bottom: "-35px",
                left: "-35px",
                background: isDark ? "#1f1f1f" : "var(--white-7)",
                padding: "28px 32px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                maxWidth: "280px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--ltn__heading-font)",
                  fontSize: "24px",
                  fontWeight: "400",
                  marginBottom: "10px",
                  color: "var(--ltn__heading-color)",
                }}
              >
                Crafted Thoughtfully
              </h3>

              <p
                style={{
                  color: "var(--ltn__paragraph-color)",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  fontWeight: "300",
                }}
              >
                Every collection reflects modern simplicity with timeless
                elegance.
              </p>
            </div>
          </div>
        </motion.section>
      </section>

      {/* TESTIMONIALS */}
      <motion.div
        style={{
          maxWidth: "1250px",
          margin: "140px auto 0",
          textAlign: "center",
        }}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => {
          if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.autoplay.stop();
          }
        }}
        onMouseLeave={() => {
          if (swiperRef.current && swiperRef.current.swiper) {
            swiperRef.current.swiper.autoplay.start();
          }
        }}
      >
        <p
          style={{
            color: "#f24c5c",
            fontSize: "14px",
            fontWeight: "600",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "14px",
            fontFamily: "Montserrat",
          }}
        >
          Customer Feedback
        </p>

        <h2
          style={{
            fontSize: "44px",
            marginBottom: "60px",
            color: "var(--ltn__heading-color)",
          }}
        >
          What Our Customers Say
        </h2>

        <Swiper
          ref={swiperRef}
          modules={[Autoplay, Navigation]}
          spaceBetween={30}
          slidesPerView={3}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          navigation={true}
          className="testimonials-swiper"
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div
                style={{
                  background: "var(--section-bg-1)",
                  padding: "40px 35px",
                  minHeight: "320px",
                  textAlign: "left",
                  boxShadow:
                    "0 15px 35px rgba(0,0,0,0.08), 0 8px 16px rgba(242, 76, 92, 0.08)",
                  transition: "0.3s ease",
                  border: "1px solid rgba(242, 76, 92, 0.15)",
                  borderRadius: "6px",
                }}
              >
                <FaQuoteLeft
                  style={{
                    fontSize: "28px",
                    color: "#f24c5c",
                    marginBottom: "25px",
                  }}
                />

                <p
                  style={{
                    fontSize: "16px",
                    color: "var(--ltn__paragraph-color)",
                    lineHeight: "1.9",
                    marginBottom: "30px",
                  }}
                >
                  "{item.feedback}"
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "5px",
                    marginBottom: "20px",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      style={{
                        color: "#f24c5c",
                        fontSize: "14px",
                      }}
                    />
                  ))}
                </div>

                <h3
                  style={{
                    fontSize: "20px",
                    marginBottom: "4px",
                    color: "var(--ltn__heading-color)",
                  }}
                >
                  {item.name}
                </h3>

                <p
                  style={{
                    color: "var(--ltn__paragraph-color)",
                    fontSize: "14px",
                  }}
                >
                  {item.role}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </div>
  );
};

export default About;

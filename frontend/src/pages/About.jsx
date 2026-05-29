import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaGift,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";

const features = [
  {
    icon: <FaTruck />,
    title: "Free Shipping",
    text: "On all orders over ₹1,999",
  },
  {
    icon: <FaMoneyBillWave />,
    title: "15 days returns",
    text: "Moneyback guarantee",
  },
  {
    icon: <FaCreditCard />,
    title: "Secure checkout",
    text: "Protected by Paypal",
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
      "UrbanWear completely changed how I shop for everyday fashion. Premium quality and the fit is absolutely perfect.",
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
      "UrbanWear outfits instantly became my go-to styling pieces. Super versatile and aesthetic.",
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

  return (
    <div
      style={{
        background: "var(--white-7)",
        minHeight: "100vh",
        padding: "50px 20px 120px",
      }}
    >
      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          background: "#faf8f5",
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
              transition: "all 0.3s ease",
              borderRight:
                index !== features.length - 1
                  ? "1px solid var(--border-color-1)"
                  : "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--section-bg-1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--white-7)";
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

      <section
        style={{
          maxWidth: "1250px",
          margin: "70px auto 0",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "55px",
          alignItems: "center",
        }}
      >
        <div>
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

          <h1
            style={{
              fontFamily: "var(--ltn__heading-font)",
              fontSize: "62px",
              fontWeight: "400",
              lineHeight: "1.1",
              color: "var(--ltn__heading-color)",
              marginBottom: "30px",
              letterSpacing: "-1px",
            }}
          >
            Style That <br />
            Speaks Quietly.
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "var(--ltn__paragraph-color)",
              lineHeight: "1.9",
              fontWeight: "300",
              marginBottom: "20px",
              maxWidth: "520px",
            }}
          >
            At UrbanWear, we believe fashion should feel effortless,
            timeless, and personal. Our collections are thoughtfully
            curated to bring together comfort, elegance, and modern
            silhouettes for individuals who value understated style.
          </p>

          <p
            style={{
              fontSize: "16px",
              color: "var(--ltn__paragraph-color)",
              lineHeight: "1.9",
              fontWeight: "300",
              marginBottom: "28px",
              maxWidth: "520px",
            }}
          >
            Every piece is designed with intention from carefully
            selected fabrics to refined detailing helping you build a
            wardrobe that feels as confident as it looks. UrbanWear is
            more than fashion; it’s about creating everyday moments of
            confidence through elevated essentials.
          </p>

          <div
            style={{
              borderLeft:
                "2px solid var(--ltn__secondary-color)",
              paddingLeft: "24px",
              marginBottom: "45px",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                fontWeight: "300",
                lineHeight: "1.8",
                color: "var(--ltn__heading-color)",
                fontStyle: "italic",
                maxWidth: "500px",
              }}
            >
              “We design timeless essentials that feel
              effortless, refined, and beautifully lived in.”
            </p>
          </div>

          <Link
            to="/shop"
            style={{
              background: "var(--ltn__primary-color)",
              color: "var(--white-7)",
              border:
                "1px solid var(--ltn__primary-color)",
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

        <div
          style={{
            position: "relative",
          }}
        >
          <div
            style={{
              overflow: "hidden",
              background: "var(--border-color-11)",
            }}
          >
            <img
              src="/cloth1.jpg"
              alt="UrbanWear Fashion"
              style={{
                width: "100%",
                height: "580px",
                objectFit: "cover",
                transition: "transform 0.8s ease",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              bottom: "-35px",
              left: "-35px",
              background: "var(--white-7)",
              padding: "28px 32px",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.08)",
              maxWidth: "280px",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--ltn__heading-font)",
                fontSize: "24px",
                fontWeight: "400",
                marginBottom: "10px",
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
              Every collection reflects modern simplicity
              with timeless elegance.
            </p>
          </div>
        </div>
      </section>

      <div
        style={{
          maxWidth: "1250px",
          margin: "140px auto 0",
          textAlign: "center",
        }}
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
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={3}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
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
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 20px 45px rgba(0,0,0,0.12), 0 12px 20px rgba(242, 76, 92, 0.15)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 15px 35px rgba(0,0,0,0.08), 0 8px 16px rgba(242, 76, 92, 0.08)";
                  e.currentTarget.style.transform = "translateY(0)";
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
      </div>
    </div>
  );
};

export default About;

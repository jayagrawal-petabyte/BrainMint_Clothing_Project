import { useState } from 'react';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import './Login.css';
import './Contact.css';

const Contact = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--section-bg-1)",
        minHeight: "100vh",
        padding: "50px 20px 80px",
      }}
    >
      {/* Contact Info Section */}
      <section
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "1px",
              background:
                "var(--ltn__secondary-color)",
            }}
          />

          <span
            style={{
              fontSize: "15px",
              fontWeight: "400",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color:
                "var(--ltn__heading-color)",
              fontFamily:
                "var(--ltn__heading-font)",
            }}
          >
            Contact Us
          </span>
        </div>

        <h1
          style={{
            fontFamily:
              "var(--ltn__heading-font)",
            fontSize: "58px",
            fontWeight: "400",
            color:
              "var(--ltn__heading-color)",
            marginBottom: "18px",
          }}
        >
          We'd Love To Hear <br />
          From You.
        </h1>

        <p
          style={{
            maxWidth: "600px",
            fontSize: "16px",
            color:
              "var(--ltn__paragraph-color)",
            lineHeight: "1.9",
            fontWeight: "300",
            marginBottom: "60px",
          }}
        >
          Have questions about products,
          orders, or collaborations? Reach
          out to us and our team will get
          back to you as soon as possible.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: <FaPhoneAlt />,
              title: "Phone Number",
              value: "+91 9876543210",
            },
            {
              icon: <FaEnvelope />,
              title: "Email Address",
              value: "support@urbanwear.com",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Office Address",
              value:
                "Bhubaneswar, Odisha, India",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "var(--white-7)",
                padding: "40px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  color:
                    "var(--ltn__secondary-color)",
                  marginBottom: "22px",
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "500",
                  marginBottom: "12px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color:
                    "var(--ltn__paragraph-color)",
                  fontSize: "15px",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="contact-form-section">
        <div className="contact-form-card stitch-card">
          <div className="contact-form-header">
            <p className="contact-form-subtitle">Have A Doubt?</p>
            <h2 className="contact-form-title">Send Us A Message</h2>
          </div>

          <form className="contact-form">
            <div className="contact-form-grid">
              <div className="stitch-input">
                <input type="text" id="contactName" placeholder=" " required />
                <label htmlFor="contactName">Your Name</label>
              </div>

              <div className="stitch-input">
                <input type="email" id="contactEmail" placeholder=" " required />
                <label htmlFor="contactEmail">Email Address</label>
              </div>

              <div className="stitch-input">
                <select id="contactQuery" required defaultValue="">
                  <option value="" disabled hidden></option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Return">Return</option>
                  <option value="Payment">Payment</option>
                  <option value="Product Query">Product Query</option>
                  <option value="Other">Other</option>
                </select>
                <label htmlFor="contactQuery">Select Query Type</label>
              </div>

              <div className="stitch-input">
                <input type="tel" id="contactPhone" placeholder=" " required />
                <label htmlFor="contactPhone">Phone Number</label>
              </div>
            </div>

            <div className="stitch-input">
              <textarea id="contactMessage" rows="6" placeholder=" " required style={{ resize: 'none' }}></textarea>
              <label htmlFor="contactMessage">Describe your query...</label>
            </div>

            <div className="contact-form-actions">
              <button type="submit" className="stitch-btn">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

  background: "var(--section-bg-1)",
  color: "var(--ltn__heading-color)",
};

export default Contact;

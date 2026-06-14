import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm } from '../../services/api';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import '../auth/Login.css';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    phone: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleChange = (e) => {
    const { id, value } = e.target;
    // Map ids to state keys
    const key = id.replace('contact', '').toLowerCase();
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });
    
    // The backend expects name, email, subject, message
    // We'll append phone to the message
    const finalMessage = formData.phone 
      ? `Phone: ${formData.phone}\n\n${formData.message}` 
      : formData.message;

    const result = await submitContactForm({
      name: formData.name,
      email: formData.email,
      subject: formData.subject || 'General Inquiry',
      message: finalMessage
    });

    if (result && result.success !== false) {
      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', subject: '', phone: '', message: '' });
    } else {
      setStatus({ loading: false, success: false, error: result?.error || result?.message || 'Failed to send message.' });
    }
  };

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

        <motion.div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
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
              value: "support@Princess Size Plus Collection.com",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Office Address",
              value:
                "Bhubaneswar, Odisha, India",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
              }}
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
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Form */}
      <motion.section
        className="contact-form-section"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="contact-form-card stitch-card">
          <div className="contact-form-header">
            <p className="contact-form-subtitle">
              Have A Doubt?
            </p>

            <h2 className="contact-form-title">
              Send Us A Message
            </h2>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {status.success && <div className="auth-error" style={{backgroundColor: '#e6ffe6', color: '#008000', borderColor: '#b3ffb3'}}>Message sent successfully! We will get back to you soon.</div>}
            {status.error && <div className="auth-error">{status.error}</div>}
            
            <div className="contact-form-grid">
              <div className="stitch-input">
                <input type="text" id="contactName" placeholder=" " value={formData.name} onChange={handleChange} required />
                <label htmlFor="contactName">Your Name</label>
              </div>

              <div className="stitch-input">
                <input type="email" id="contactEmail" placeholder=" " value={formData.email} onChange={handleChange} required />
                <label htmlFor="contactEmail">Email Address</label>
              </div>

              <div className="stitch-input">
                <select id="contactSubject" required value={formData.subject} onChange={handleChange}>
                  <option value="" disabled hidden></option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Return">Return</option>
                  <option value="Payment">Payment</option>
                  <option value="Product Query">Product Query</option>
                  <option value="Other">Other</option>
                </select>
                <label htmlFor="contactSubject">Select Query Type</label>
              </div>

              <div className="stitch-input">
                <input type="tel" id="contactPhone" placeholder=" " value={formData.phone} onChange={handleChange} required />
                <label htmlFor="contactPhone">Phone Number</label>
              </div>
            </div>

            <div className="stitch-input">
              <textarea id="contactMessage" rows="6" placeholder=" " value={formData.message} onChange={handleChange} required style={{ resize: 'none' }}></textarea>
              <label htmlFor="contactMessage">Describe your query...</label>
            </div>

            <div className="contact-form-actions">
              <button type="submit" className="stitch-btn" disabled={status.loading}>
                {status.loading ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;

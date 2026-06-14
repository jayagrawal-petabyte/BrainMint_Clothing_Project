import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContactForm } from '../../services/api';
import {
  FaPhoneAlt,
  FaGlobe,
  FaRulerCombined,
  FaCreditCard,
  FaTimesCircle,
  FaExchangeAlt,
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
    const key = id.replace('contact', '').toLowerCase();
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

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
    <div className="contact-page">

      {/* ── Hero Section ── */}
      <section className="contact-hero">
        <div className="contact-hero-inner">
          <motion.div
            className="contact-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-hero-label">
              <div className="contact-hero-line" />
              <span>Customer Care</span>
            </div>
            <h1 className="contact-hero-title">We're Here To Help.</h1>
            <p className="contact-hero-desc">
              At Princess Size Plus Collection, your satisfaction is important to us. Whether you have questions about sizing, orders, shipping, or product details, our support team is ready to assist you.
            </p>
            <p className="contact-hero-desc">
              We strive to provide a smooth and enjoyable shopping experience for every customer, from Vellore to destinations around the world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Details + Support Hours ── */}
      <section className="contact-details-section">
        <div className="contact-details-inner">

          <motion.div
            className="contact-detail-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="contact-detail-heading">Contact Us</h3>
            <div className="contact-phone-row">
              <FaPhoneAlt className="contact-phone-icon" />
              <a href="tel:+917200219272" className="contact-phone-link">+91 72002 19272</a>
            </div>
            <div className="contact-phone-row">
              <FaPhoneAlt className="contact-phone-icon" />
              <a href="tel:+918637660372" className="contact-phone-link">+91 86376 60372</a>
            </div>
          </motion.div>

          <motion.div
            className="contact-detail-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="contact-detail-heading">Customer Support Hours</h3>
            <p className="contact-detail-text">Monday – Saturday</p>
            <p className="contact-detail-text contact-detail-highlight">10:00 AM – 7:00 PM (IST)</p>
          </motion.div>

        </div>
      </section>

      {/* ── Important Information ── */}
      <section className="contact-info-section">
        <div className="contact-info-inner">
          <motion.h2
            className="contact-info-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5 }}
          >
            Important Information
          </motion.h2>

          <motion.div
            className="contact-info-grid"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.08 } }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
          >
            {[
              { icon: <FaGlobe />, text: "Worldwide Shipping Available" },
              { icon: <FaRulerCombined />, text: "Sizes Available from S to 12XL" },
              { icon: <FaCreditCard />, text: "No Cash on Delivery (COD)" },
              { icon: <FaTimesCircle />, text: "No Returns" },
              { icon: <FaExchangeAlt />, text: "No Exchanges" },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="contact-info-item"
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                }}
              >
                <div className="contact-info-icon">{item.icon}</div>
                <span className="contact-info-text">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="contact-info-note"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            For faster assistance, please keep your order details ready when contacting our support team.
          </motion.p>
        </div>
      </section>

      {/* ── Send Message Form (preserved) ── */}
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
            {status.success && <div className="auth-error" style={{ backgroundColor: '#e6ffe6', color: '#008000', borderColor: '#b3ffb3' }}>Message sent successfully! We will get back to you soon.</div>}
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
                  <option value="Payment">Payment</option>
                  <option value="Product Query">Product Query</option>
                  <option value="Sizing">Sizing</option>
                  <option value="Shipping">Shipping</option>
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

      {/* ── Closing line ── */}
      <div className="contact-closing">
        <p>Your style journey matters to us, and we're always happy to help.</p>
      </div>

    </div>
  );
};

export default Contact;

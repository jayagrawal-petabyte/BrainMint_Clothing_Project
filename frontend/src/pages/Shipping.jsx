import React from 'react';
import { Link } from 'react-router-dom';
import './Returns.css'; // Reusing static page CSS

const Shipping = () => {
  return (
    <div className="static-page">
      <div className="static-header">
        <h1>Shipping Information</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">{'>'}</span>
          <span className="current">Shipping Info</span>
        </div>
      </div>

      <div className="static-content">
        <h2>Delivery Times & Costs</h2>
        <p>
          We partner with premium logistics providers to ensure your orders arrive quickly and safely. We currently ship to all major cities and regions across India.
        </p>

        <h3>Standard Shipping</h3>
        <ul>
          <li><strong>Cost:</strong> Free on all orders over ₹2,000. For orders under ₹2,000, a flat rate of ₹150 applies.</li>
          <li><strong>Delivery Time:</strong> 3-5 business days for metro cities, and 5-7 business days for non-metro locations.</li>
        </ul>

        <h3>Express Delivery</h3>
        <ul>
          <li><strong>Cost:</strong> Flat rate of ₹350 on all orders.</li>
          <li><strong>Delivery Time:</strong> 1-2 business days. Available only in select metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad).</li>
        </ul>

        <h3>Order Tracking</h3>
        <p>
          Once your order has been dispatched, you will receive an email and SMS notification containing your tracking number and a link to trace your package in real-time. Please allow up to 24 hours for the tracking link to become active.
        </p>

        <h3>Undelivered Packages</h3>
        <p>
          If our courier partners are unable to deliver your package after 3 attempts, it will be returned to our warehouse. In such cases, we will issue a full refund minus the original shipping fees. Please ensure your delivery address and contact number are accurate during checkout to avoid any issues.
        </p>
      </div>
    </div>
  );
};

export default Shipping;

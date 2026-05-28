import React from 'react';
import {
  FaTruck,
  FaMoneyBillWave,
  FaCreditCard,
  FaGift,
} from "react-icons/fa";
import './TrustBadges.css';

const TrustBadges = () => {
  const features = [
    {
      icon: <FaTruck />,
      title: "Free Shipping",
      text: "On all orders over $49.00",
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

  return (
    <div className="trust-badges-container">
      <div className="trust-badges-wrapper">
        {features.map((item, index) => (
          <div key={index} className="trust-badge-item" style={{
            borderRight: index !== features.length - 1 ? "1px solid var(--border-color-1)" : "none"
          }}>
            <div className="badge-icon">
              {item.icon}
            </div>
            <div className="badge-info">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;

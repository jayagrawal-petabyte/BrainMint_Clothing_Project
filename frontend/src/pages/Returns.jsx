import React from 'react';
import { Link } from 'react-router-dom';
import './Returns.css';

const Returns = () => {
  return (
    <div className="static-page">
      <div className="static-header">
        <h1>Returns Policy</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">{'>'}</span>
          <span className="current">Returns Policy</span>
        </div>
      </div>

      <div className="static-content">
        <h2>Our 30-Day Return Guarantee</h2>
        <p>
          We want you to be completely satisfied with your purchase. If for any reason you are not entirely happy, you may return your item(s) within 30 days of receiving your order for a full refund or exchange.
        </p>

        <h3>Eligibility for Returns</h3>
        <ul>
          <li>Items must be unworn, unwashed, and in their original condition.</li>
          <li>All original tags must still be attached to the garment.</li>
          <li>Intimates, swimwear, and pierced jewelry are final sale for hygiene reasons.</li>
          <li>Sale items marked as "Final Sale" cannot be returned or exchanged.</li>
        </ul>

        <h3>How to Initiate a Return</h3>
        <p>
          To start a return, please visit our <Link to="/contact">Contact Page</Link> and provide your order number along with the reason for return. Our customer care team will email you a prepaid shipping label within 24 hours.
        </p>

        <h3>Refund Process</h3>
        <p>
          Once your return is received and inspected at our warehouse, we will notify you of the approval or rejection of your refund. If approved, your refund will be processed automatically to your original method of payment within 5-7 business days. Please note that shipping costs are non-refundable.
        </p>

        <h3>Exchanges</h3>
        <p>
          If you need a different size or color, the fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, make a separate purchase for the new item.
        </p>
      </div>
    </div>
  );
};

export default Returns;

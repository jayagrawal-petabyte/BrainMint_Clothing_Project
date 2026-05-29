import React from 'react';
import { Link } from 'react-router-dom';
import './Returns.css'; // Reusing static page CSS

const Returns = () => {
  return (
    <div className="static-page">
      <div className="static-header">
        <h1>Return & Refund Policy</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">{'>'}</span>
          <span className="current">Return & Refund Policy</span>
        </div>
      </div>

      <div className="static-content">
        <h2>General Returns</h2>
        <p>
          We grant a period of 15 days from the date of delivery to return or exchange products (except those products mentioned below, for which the right to return / exchange is excluded). In case you return the goods within the said period, you will be reimbursed with the amount paid for the products.
        </p>

        <h3>Conditions for Return</h3>
        <ul>
          <li>Products must be returned in their original condition, unwashed, and unworn.</li>
          <li>All original tags, packaging, and labels must be completely intact.</li>
          <li>Footwear must be returned in the original shoe box without any damage to the box.</li>
        </ul>

        <h3>Non-Returnable Items</h3>
        <p>For hygiene and safety reasons, the following items are strictly non-returnable and non-exchangeable:</p>
        <ul>
          <li>Lingerie, innerwear, and sleepwear</li>
          <li>Swimwear</li>
          <li>Cosmetics and perfumes</li>
          <li>Jewelry and hair accessories</li>
          <li>Products purchased on clearance or marked as "Final Sale"</li>
        </ul>

        <h3>Refund Process</h3>
        <p>
          Once your return reaches our warehouse and passes the quality check, a refund will be initiated to your original payment method. Please allow 5-7 business days for the amount to reflect in your bank account or credit card statement. Shipping charges and cash-on-delivery fees (if applicable) are non-refundable.
        </p>

        <h3>Store Exchanges</h3>
        <p>
          Online purchases can also be exchanged at any of our physical retail stores within 15 days of delivery, provided you carry the original invoice and the items meet our return conditions.
        </p>
      </div>
    </div>
  );
};

export default Returns;

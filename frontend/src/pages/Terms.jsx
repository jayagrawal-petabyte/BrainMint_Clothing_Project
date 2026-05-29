import React from 'react';
import { Link } from 'react-router-dom';
import './Returns.css'; // Reusing static page CSS

const Terms = () => {
  return (
    <div className="static-page">
      <div className="static-header">
        <h1>Terms & Conditions</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">{'>'}</span>
          <span className="current">Terms & Conditions</span>
        </div>
      </div>

      <div className="static-content">
        <h2>Introduction</h2>
        <p>
          Welcome to UrbanWear. These Terms & Conditions govern your use of our website and services. By accessing or using this website, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our website.
        </p>

        <h3>Use of Website</h3>
        <p>
          You may use our website only for lawful purposes. You must not use our site in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.
        </p>

        <h3>Intellectual Property Rights</h3>
        <p>
          Unless otherwise stated, we or our licensors own the intellectual property rights in the website and material on the website. All these intellectual property rights are reserved. You may view, download for caching purposes only, and print pages from the website for your own personal use.
        </p>

        <h3>Pricing & Availability</h3>
        <p>
          All prices are inclusive of VAT/GST. We try to ensure that all details, descriptions, and prices which appear on this website are accurate, however errors may occur. If we discover an error in the price of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it.
        </p>

        <h3>Limitation of Liability</h3>
        <p>
          UrbanWear will not be liable to you in relation to the contents of, or use of, or otherwise in connection with, this website for any indirect, special, or consequential loss; or for any business losses, loss of revenue, income, profits, or anticipated savings.
        </p>

        <h3>Governing Law</h3>
        <p>
          These Terms & Conditions shall be governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of India.
        </p>
      </div>
    </div>
  );
};

export default Terms;

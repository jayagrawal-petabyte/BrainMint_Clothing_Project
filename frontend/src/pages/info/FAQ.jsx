import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

const faqs = [
  {
    question: "Do you offer worldwide shipping?",
    answer: "Yes, we proudly offer worldwide shipping! No matter where you are, you can enjoy our Princess Size+ Collection. Shipping times and costs will vary depending on your specific location and will be calculated automatically at checkout."
  },
  {
    question: "What sizes do you offer?",
    answer: "We believe in celebrating every body type, which is why our collection features an extensive and highly inclusive size range from S all the way up to 12XL. Please refer to our detailed sizing chart on each product page to find your perfect fit."
  },
  {
    question: "Can I pay using Cash on Delivery (COD)?",
    answer: "Currently, we do not offer Cash on Delivery (COD) as a payment option. To ensure a seamless, fast, and secure transaction process, all orders must be prepaid. We accept all major credit/debit cards, net banking, and trusted digital wallets through our secure payment gateway."
  },
  {
    question: "What is your return policy?",
    answer: "To maintain the highest standards of hygiene, exclusivity, and quality for all our customers, we strictly do not accept returns on any of our products once they have been successfully delivered. We highly recommend reviewing your order details and checking our sizing guide carefully before completing a purchase."
  },
  {
    question: "Can I exchange an item if it doesn't fit?",
    answer: "We do not offer exchanges. Because our items are carefully curated and frequently sell out, we cannot guarantee the availability of alternative sizes. We strongly encourage you to consult our comprehensive size chart before finalizing your order to ensure you receive the best possible fit."
  },
  {
    question: "What do the different order statuses mean?",
    answer: "You can track the progress of your purchase through your account dashboard. Here is what each status means:\n\n• Pending: We have received your order request, but the payment is still being processed, awaiting verification or there was an internal issue while the order was being processed.\n• Confirmed: Your payment was successful, and our fulfillment team is actively preparing your items for shipment.\n• Cancelled: Your order has been voided. This usually occurs if a payment fails, or if a cancellation was requested before processing."
  },
  {
    question: "What should I do if my payment failed but the money was deducted from my account?",
    answer: "Please do not worry! If your transaction failed on our end but your bank account was charged, the amount is typically auto-refunded by your bank's payment gateway within 5 to 7 business days. If you need immediate assistance or reassurance, please reach out to our Customer Care team via the Contact Us page, and we will gladly look into the transaction status for you."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="faq-page">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">{'>'}</span>
          <span className="current">FAQ</span>
        </div>
      </div>

      <div className="faq-container">
        <div className="faq-intro">
          <p>
            Find answers to our most commonly asked questions below. If you cannot find the information you are looking for, our Customer Care team is always ready to assist you.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="faq-icon"
                    size={20}
                  />
                </button>
                <div className="faq-answer-wrapper">
                  <div className="faq-answer">
                    {faq.answer.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i !== faq.answer.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq-footer">
          <p>Still have questions?</p>
          <Link to="/contact" className="faq-contact-btn">Contact Customer Care</Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

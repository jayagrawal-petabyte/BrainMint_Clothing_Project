
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
        <h2>1. General Return Policy</h2>
        <p>
          At UrbanWear, we strive to ensure that you are completely satisfied with your purchase. However, if you are not entirely happy, we grant a period of <strong>15 days from the date of delivery</strong> to return or exchange products. This applies to most items, with certain exceptions detailed in Section 3 below. In case you return the goods within the said period, you will be reimbursed with the amount paid for the products, subject to our quality inspection.
        </p>
        <p>
          We request you to please retain the original packaging and the invoice to ensure a smooth return process. Returns initiated after 15 days from delivery will not be accepted under any circumstances.
        </p>

        <h2>2. Conditions for Return</h2>
        <p>To be eligible for a return or exchange, the following conditions must be strictly met:</p>
        <ul>
          <li>The product must be in its original, unused, unwashed, and undamaged condition.</li>
          <li>All original tags, brand labels, and price tags must be intact and securely attached.</li>
          <li>The item must be returned in the original brand packaging (e.g., shoe boxes must be returned undamaged along with the shoes).</li>
          <li>Any free promotional items, gifts, or accessories shipped with the product must also be returned.</li>
          <li>Items that show signs of wear, alteration, or misuse will be rejected and sent back to the customer.</li>
        </ul>

        <h2>3. Non-Returnable and Non-Exchangeable Items</h2>
        <p>For hygiene, safety, and operational reasons, the following items are strictly non-returnable and non-exchangeable:</p>
        <ul>
          <li>Innerwear, lingerie, sleepwear, and shapewear</li>
          <li>Swimwear and beachwear</li>
          <li>Cosmetics, perfumes, and personal care products</li>
          <li>Jewelry, sunglasses, and hair accessories</li>
          <li>Socks and hosiery</li>
          <li>Products purchased on final clearance or marked as "Final Sale"</li>
          <li>Customized or personalized garments</li>
        </ul>

        <h2>4. How to Initiate a Return</h2>
        <p>Initiating a return is simple and can be done in two ways:</p>
        <ul>
          <li><strong>Online Return:</strong> Log into your UrbanWear account, navigate to "My Orders", select the item you wish to return, and click "Initiate Return". Our courier partner will pick up the package from your delivery address within 2-3 business days.</li>
          <li><strong>Guest Checkout Return:</strong> If you checked out as a guest, please visit our <Link to="/contact">Contact Page</Link> and submit a return request with your Order ID and email address. Our support team will generate a return pickup for you.</li>
        </ul>

        <h2>5. Refund Process & Timelines</h2>
        <p>
          Once your return reaches our central warehouse, it will undergo a strict quality check. This process typically takes 24 to 48 hours from the time the package is received. 
        </p>
        <p>
          <strong>If approved:</strong> Your refund will be processed immediately. 
          <ul>
            <li>Prepaid Orders: The refund will be credited back to the original credit card, debit card, or UPI account within 5-7 business days.</li>
            <li>Cash on Delivery (COD) Orders: You will receive a payout link via email and SMS to enter your bank details. Once submitted, the refund will be transferred within 3-5 business days.</li>
          </ul>
        </p>
        <p>
          Please note that original shipping charges, COD convenience fees, and gift-wrapping charges are strictly non-refundable.
        </p>

        <h2>6. In-Store Exchanges</h2>
        <p>
          For a faster resolution, you can exchange items purchased online at any of our physical UrbanWear retail stores across the country. Please bring the item in its original condition along with the digital or printed invoice within 15 days of delivery. Note that refunds cannot be processed in-store; physical stores can only offer size/color exchanges or issue a store credit voucher.
        </p>

        <h2>7. Damaged or Defective Items</h2>
        <p>
          If you receive an item that is damaged, defective, or incorrect, please notify us within 48 hours of delivery by contacting our customer care team with clear photographs of the defect and the packaging. We will arrange a priority replacement at no additional cost to you.
        </p>
      </div>
    </div>
  );
};

export default Returns;

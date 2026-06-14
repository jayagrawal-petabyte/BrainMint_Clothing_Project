
import { Link } from 'react-router-dom';
import './Returns.css'; // Reusing static page CSS

const CustomerCare = () => {
  return (
    <div className="static-page">
      <div className="static-header">
        <h1>Customer Care</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">{'>'}</span>
          <span className="current">Customer Care</span>
        </div>
      </div>

      <div className="static-content">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Princess Size Plus Collection. These Customer Care ("CustomerCare") govern your access to and use of our website, mobile application, and the services provided by Princess Size Plus Collection (collectively, the "Platform"). By accessing, browsing, or placing an order on the Platform, you acknowledge that you have read, understood, and agree to be bound by these CustomerCare. 
        </p>
        <p>
          If you do not agree with any part of these CustomerCare, you must immediately cease all use of our Platform. Princess Size Plus Collection reserves the right to update, modify, or replace any part of these CustomerCare at our sole discretion by posting updates to our website. It is your responsibility to check this page periodically for changes.
        </p>

        <h2>2. User Accounts and Security</h2>
        <p>
          While you may browse our Platform as a guest, placing an order may require you to register and create an account. You agree to provide accurate, current, and complete information during the registration process. 
        </p>
        <p>
          You are solely responsible for safeguarding the password that you use to access your account and for any activities or actions under your password. Princess Size Plus Collection will not be liable for any loss or damage arising from your failure to comply with this security obligation. We reserve the right to suspend or terminate accounts, refuse service, or cancel orders at our sole discretion if we suspect fraudulent or malicious activity.
        </p>

        <h2>3. Intellectual Property Rights</h2>
        <p>
          All content included on the Platform, such as text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of Princess Size Plus Collection or its content suppliers and is protected by international copyright, trademark, and intellectual property laws.
        </p>
        <p>
          You may view, download for caching purposes only, and print pages from the website for your own personal, non-commercial use, subject to the restrictions set out below and elsewhere in these CustomerCare. You must not:
        </p>
        <ul>
          <li>Republish material from this website (including republication on another website).</li>
          <li>Sell, rent, or sub-license material from the website.</li>
          <li>Reproduce, duplicate, copy, or otherwise exploit material on this website for a commercial purpose.</li>
          <li>Edit or otherwise modify any material on the website.</li>
        </ul>

        <h2>4. Pricing and Availability</h2>
        <p>
          All prices displayed on the Platform are in Indian Rupees (INR) and are inclusive of applicable Goods and Services Tax (GST). We make every effort to ensure that all details, descriptions, and prices are accurate; however, errors (including processing errors) may occur.
        </p>
        <p>
          If we discover an error in the price or availability of any goods which you have ordered, we will inform you of this as soon as possible and give you the option of reconfirming your order at the correct price or cancelling it. If we are unable to contact you, we will treat the order as cancelled. If you cancel and you have already paid for the goods, you will receive a full refund.
        </p>

        <h2>5. Product Descriptions and Colors</h2>
        <p>
          We have made every effort to display as accurately as possible the colors and images of our products that appear on the store. We cannot guarantee that your computer monitor's display of any color will be accurate. We do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
        </p>

        <h2>6. Prohibited Uses</h2>
        <p>
          In addition to other prohibitions as set forth in the CustomerCare, you are prohibited from using the site or its content: 
          (a) for any unlawful purpose; 
          (b) to solicit others to perform or participate in any unlawful acts; 
          (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; 
          (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others; 
          (e) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          In no case shall Princess Size Plus Collection, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service.
        </p>

        <h2>8. Governing Law and Jurisdiction</h2>
        <p>
          These Customer Care and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of India. Any disputes relating to these CustomerCare and conditions will be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra.
        </p>
      </div>
    </div>
  );
};

export default CustomerCare;

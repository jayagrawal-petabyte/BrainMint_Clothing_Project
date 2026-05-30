import { useState } from "react";
import { Link } from "react-router-dom";
import { mockProducts } from "../data/products";
import "./Admin.css";

const recentOrders = [
  { id: "#UW-1042", customer: "Aarav Sharma", product: "Floral Maxi Dress", amount: "₹4,999", status: "delivered", date: "May 28" },
  { id: "#UW-1041", customer: "Priya Mehta", product: "Silk Blouse", amount: "₹3,499", status: "processing", date: "May 28" },
  { id: "#UW-1040", customer: "Rohan Verma", product: "Little Black Dress", amount: "₹5,999", status: "shipped", date: "May 27" },
  { id: "#UW-1039", customer: "Sneha Kapoor", product: "Tailored Blazer", amount: "₹6,999", status: "pending", date: "May 27" },
  { id: "#UW-1038", customer: "Aditya Singh", product: "High-Waist Trousers", amount: "₹3,999", status: "delivered", date: "May 26" },
];

const activityFeed = [
  { dot: "", text: <><strong>Sneha Kapoor</strong> placed order #UW-1039</>, time: "2 min ago" },
  { dot: "green", text: <><strong>Order #UW-1040</strong> shipped via BlueDart</>, time: "18 min ago" },
  { dot: "blue", text: <>New product <strong>Ruffle Blouse</strong> added to inventory</>, time: "1 hr ago" },
  { dot: "orange", text: <><strong>Denim Mini Skirt</strong> stock below threshold (3 left)</>, time: "2 hrs ago" },
  { dot: "green", text: <><strong>Order #UW-1042</strong> delivered successfully</>, time: "3 hrs ago" },
  { dot: "", text: <><strong>Priya Mehta</strong> left a 5â˜… review on Silk Blouse</>, time: "4 hrs ago" },
];

const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const topProducts = mockProducts.slice(0, 8);

  return (
    <div className="admin-container">
      <div className="admin-inner">

        {/* Header */}
        <div className="admin-header">
          <div>
            <div className="admin-header-left">
              <div className="accent-line" />
              <span>Dashboard</span>
            </div>
            <h1 className="admin-title">Admin Panel</h1>
          </div>
          <div className="admin-actions">
            <button className="admin-btn admin-btn-outline">Export Data</button>
            <button className="admin-btn">+ Add Product</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {["overview", "products", "orders"].map(tab => (
            <button
              key={tab}
              className={`admin-tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="admin-stats">
              {[
                { icon: "ðŸ“¦", value: "1,284", label: "Total Orders", trend: "+12.5%", dir: "up" },
                { icon: "ðŸ’°", value: "₹18.4L", label: "Revenue", trend: "+8.2%", dir: "up" },
                { icon: "ðŸ‘¥", value: "3,842", label: "Customers", trend: "+15.3%", dir: "up" },
                { icon: "ðŸ‘—", value: mockProducts.length.toString(), label: "Products", trend: "+2", dir: "up" },
              ].map((stat, i) => (
                <div className="stat-card" key={i}>
                  <div className="stat-card-header">
                    <div className="stat-card-icon">{stat.icon}</div>
                    <span className={`stat-trend ${stat.dir}`}>
                      {stat.dir === "up" ? "â†‘" : "â†“"} {stat.trend}
                    </span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Orders + Activity */}
            <div className="admin-content">
              <div className="admin-panel">
                <div className="panel-header">
                  <h3>Recent Orders</h3>
                  <Link to="/admin">View All</Link>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 600, color: "var(--ltn__heading-color)" }}>{order.id}</td>
                        <td>{order.customer}</td>
                        <td>
                          <div className="order-product">
                            <div className="order-product-thumb">ðŸ‘—</div>
                            <span className="order-product-name">{order.product}</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{order.amount}</td>
                        <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="admin-panel">
                <div className="panel-header">
                  <h3>Activity</h3>
                  <Link to="/admin">See All</Link>
                </div>
                <div className="activity-list">
                  {activityFeed.map((item, i) => (
                    <div className="activity-item" key={i}>
                      <div className={`activity-dot ${item.dot}`} />
                      <div>
                        <div className="activity-text">{item.text}</div>
                        <div className="activity-time">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <>
            <h2 className="admin-section-title">Product Inventory</h2>
            <div className="admin-products-grid">
              {topProducts.map((product) => (
                <div className="admin-product-card" key={product.id}>
                  <div className="admin-product-img">
                    ðŸ‘—
                    <div className="admin-product-overlay">
                      <button title="Edit">âœï¸</button>
                      <button title="Delete">ðŸ—‘ï¸</button>
                    </div>
                  </div>
                  <div className="admin-product-info">
                    <h4>{product.name}</h4>
                    <div className="admin-product-meta">
                      <span className="admin-product-price">₹{product.price.toLocaleString("en-IN")}</span>
                      <span className={`admin-product-stock ${product.rating > 4.5 ? "in-stock" : "low-stock"}`}>
                        {product.rating > 4.5 ? "In Stock" : "Low Stock"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <>
            <h2 className="admin-section-title">All Orders</h2>
            <div className="admin-panel">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600, color: "var(--ltn__heading-color)" }}>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.product}</td>
                      <td style={{ fontWeight: 600 }}>{order.amount}</td>
                      <td>{order.date}</td>
                      <td><span className={`order-status ${order.status}`}>{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Admin;

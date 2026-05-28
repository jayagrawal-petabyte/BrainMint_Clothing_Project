import React, { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { mockProducts } from "../data/products";

const Wishlist = () => {
  // Temporary mock wishlist items
  const [wishlistItems, setWishlistItems] = useState(
    mockProducts.slice(0, 4)
  );

  const removeFromWishlist = (id) => {
    setWishlistItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div
      style={{
        background: "var(--section-bg-1)",
        minHeight: "100vh",
        padding: "70px 8%",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              background:
                "var(--ltn__secondary-color)",
            }}
          />

          <span
            style={{
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily:
                "var(--ltn__heading-font)",
            }}
          >
            Saved Collection
          </span>
        </div>

        <h1
          style={{
            fontSize: "58px",
            fontWeight: "400",
            color:
              "var(--ltn__heading-color)",
            marginBottom: "12px",
          }}
        >
          My Wishlist
        </h1>

        <p
          style={{
            color:
              "var(--ltn__paragraph-color)",
            fontSize: "16px",
            fontWeight: "300",
          }}
        >
          Your curated collection of
          favorite UrbanWear styles.
        </p>
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "80px 30px",
            textAlign: "center",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <Heart
            size={55}
            strokeWidth={1.5}
            style={{
              color:
                "var(--ltn__secondary-color)",
              marginBottom: "20px",
            }}
          />

          <h2
            style={{
              fontSize: "32px",
              fontWeight: "400",
              marginBottom: "12px",
            }}
          >
            Your Wishlist is Empty
          </h2>

          <p
            style={{
              color:
                "var(--ltn__paragraph-color)",
              marginBottom: "30px",
            }}
          >
            Save styles you love and
            revisit them anytime.
          </p>

          <Link
            to="/shop"
            style={{
              background:
                "var(--ltn__primary-color)",
              color: "#fff",
              border:
                "1px solid var(--ltn__primary-color)",
              padding: "16px 36px",
              textDecoration: "none",
              letterSpacing: "1px",
              transition: "0.4s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.background =
                "transparent";
              e.target.style.color =
                "#111";
            }}
            onMouseLeave={(e) => {
              e.target.style.background =
                "#111";
              e.target.style.color =
                "#fff";
            }}
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(270px, 1fr))",
            gap: "35px",
          }}
        >
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#fff",
                overflow: "hidden",
                boxShadow:
                  "0 12px 30px rgba(0,0,0,0.05)",
                transition:
                  "transform 0.3s ease",
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "360px",
                    objectFit: "cover",
                  }}
                />

                <button
                  onClick={() =>
                    removeFromWishlist(
                      item.id
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "18px",
                    border: "none",
                    background: "#fff",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    cursor: "pointer",
                    boxShadow:
                      "0 8px 20px rgba(0,0,0,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <Heart
                    size={18}
                    fill="#f24c5c"
                    color="#f24c5c"
                  />
                </button>
              </div>

              {/* Content */}
              <div
                style={{
                  padding: "28px",
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "400",
                    marginBottom: "10px",
                  }}
                >
                  {item.name}
                </h3>

                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    color: "#111",
                    marginBottom: "24px",
                  }}
                >
                  ₹
                  {item.price.toLocaleString(
                    "en-IN"
                  )}
                </p>

                <button
                  style={{
                    width: "100%",
                    background:
                      "var(--ltn__primary-color)",
                    color: "#fff",
                    border:
                      "1px solid var(--ltn__primary-color)",
                    padding:
                      "15px 20px",
                    cursor: "pointer",
                    letterSpacing:
                      "1px",
                    transition:
                      "0.4s ease",
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    gap: "10px",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background =
                      "transparent";
                    e.target.style.color =
                      "#111";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "#111";
                    e.target.style.color =
                      "#fff";
                  }}
                >
                  <ShoppingCart size={18} />
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition: "all 0.3s ease",
          zIndex: 999,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: isOpen ? 0 : "-450px",
          width: "420px",
          height: "100vh",
          background: "#fff",
          boxShadow: "-10px 0 40px rgba(0,0,0,0.1)",
          transition: "all 0.35s ease",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "28px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: "400",
                marginBottom: "4px",
              }}
            >
              Your Cart
            </h2>

            <p
              style={{
                fontSize: "14px",
                color: "#777",
              }}
            >
              {cartItems.length} item(s)
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            <X size={28} />
          </button>
        </div>

        {/* Empty Cart */}
        {cartItems.length === 0 ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                fontSize: "26px",
                fontWeight: "400",
                marginBottom: "12px",
              }}
            >
              Your cart is empty
            </h3>

            <p
              style={{
                color: "#777",
                lineHeight: "1.8",
              }}
            >
              Looks like you haven’t added
              anything yet.
            </p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "18px",
                    marginBottom: "28px",
                    borderBottom:
                      "1px solid #f2f2f2",
                    paddingBottom: "22px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "90px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "18px",
                        marginBottom: "8px",
                      }}
                    >
                      {item.name}
                    </h4>

                    <p
                      style={{
                        fontWeight: "500",
                        marginBottom: "18px",
                      }}
                    >
                      ₹{item.price}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        style={qtyBtn}
                      >
                        <Minus size={16} />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        style={qtyBtn}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        style={{
                          border: "none",
                          background:
                            "transparent",
                          marginLeft: "auto",
                          cursor: "pointer",
                        }}
                      >
                        <Trash2
                          size={18}
                          color="#d11a2a"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                borderTop: "1px solid #eee",
                padding: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  marginBottom: "24px",
                }}
              >
                <h3>Subtotal</h3>

                <h3>
                  ₹
                  {cartTotal.toLocaleString(
                    "en-IN"
                  )}
                </h3>
              </div>

              <Link
                to="/checkout"
                onClick={onClose}
                style={{
                  background:
                    "var(--ltn__primary-color)",
                  color: "#fff",
                  width: "100%",
                  padding: "16px",
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  transition:
                    "all 0.4s ease",
                  border:
                    "1px solid var(--ltn__primary-color)",
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
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const qtyBtn = {
  border: "1px solid #ddd",
  background: "#fff",
  width: "32px",
  height: "32px",
  cursor: "pointer",
};

export default CartDrawer;
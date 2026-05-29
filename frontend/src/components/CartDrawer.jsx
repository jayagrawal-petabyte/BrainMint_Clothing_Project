import React from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 999,
            }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeOut" }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              width: "420px",
              height: "100vh",
              background: "var(--white-7)",
              boxShadow: "-10px 0 40px rgba(0,0,0,0.1)",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              color: "var(--ltn__heading-color)"
            }}
          >
        <div
          style={{
            padding: "28px",
            borderBottom: "1px solid var(--border-color-1)",
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
                color: "var(--ltn__paragraph-color)",
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
              color: "var(--ltn__heading-color)",
            }}
          >
            <X size={28} />
          </button>
        </div>

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
                color: "var(--ltn__paragraph-color)",
                lineHeight: "1.8",
              }}
            >
              Looks like you haven’t added
              anything yet.
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
              }}
            >
              {cartItems.map((item) => {
                const itemId = item._id || item.id;
                return (
                <div
                  key={itemId}
                  style={{
                    display: "flex",
                    gap: "18px",
                    marginBottom: "28px",
                    borderBottom:
                      "1px solid var(--border-color-1)",
                    paddingBottom: "22px",
                  }}
                >
                  <img
                    src={item.images ? item.images[0]?.url || item.images[0] : item.image}
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
                      ₹{item.discountPrice || item.price}
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
                            itemId,
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
                            itemId,
                            item.quantity + 1
                          )
                        }
                        style={qtyBtn}
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        onClick={() =>
                          removeFromCart(itemId)
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
              )})}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border-color-1)",
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link
                  to="/cart"
                  onClick={onClose}
                  style={{
                    background: "var(--ltn__heading-color)",
                    color: "var(--white-7)",
                    width: "100%",
                    padding: "16px",
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    transition: "all 0.4s ease",
                    border: "1px solid var(--ltn__heading-color)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--ltn__heading-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--ltn__heading-color)";
                    e.target.style.color = "var(--white-7)";
                  }}
                >
                  View Cart
                </Link>

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
                      "var(--ltn__heading-color)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background =
                      "var(--ltn__primary-color)";
                    e.target.style.color =
                      "var(--white-7)";
                  }}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </>
        )}
        </motion.div>
      </>
      )}
    </AnimatePresence>
  );
};

const qtyBtn = {
  border: "1px solid var(--border-color-1)",
  background: "var(--section-bg-1)",
  color: "var(--ltn__heading-color)",
  width: "32px",
  height: "32px",
  cursor: "pointer",
};

export default CartDrawer;

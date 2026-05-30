
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Contact = () => {
  return (
    <div
      style={{
        backgroundColor: "var(--section-bg-1)",
        minHeight: "100vh",
        padding: "50px 20px 80px",
      }}
    >
      {/* Contact Info Section */}
      <section
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "1px",
              background:
                "var(--ltn__secondary-color)",
            }}
          />

          <span
            style={{
              fontSize: "15px",
              fontWeight: "400",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color:
                "var(--ltn__heading-color)",
              fontFamily:
                "var(--ltn__heading-font)",
            }}
          >
            Contact Us
          </span>
        </div>

        <h1
          style={{
            fontFamily:
              "var(--ltn__heading-font)",
            fontSize: "58px",
            fontWeight: "400",
            color:
              "var(--ltn__heading-color)",
            marginBottom: "18px",
          }}
        >
          We'd Love To Hear <br />
          From You.
        </h1>

        <p
          style={{
            maxWidth: "600px",
            fontSize: "16px",
            color:
              "var(--ltn__paragraph-color)",
            lineHeight: "1.9",
            fontWeight: "300",
            marginBottom: "60px",
          }}
        >
          Have questions about products,
          orders, or collaborations? Reach
          out to us and our team will get
          back to you as soon as possible.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              icon: <FaPhoneAlt />,
              title: "Phone Number",
              value: "+91 9876543210",
            },
            {
              icon: <FaEnvelope />,
              title: "Email Address",
              value: "support@urbanwear.com",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Office Address",
              value:
                "Bhubaneswar, Odisha, India",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "var(--white-7)",
                padding: "40px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  color:
                    "var(--ltn__secondary-color)",
                  marginBottom: "22px",
                }}
              >
                {item.icon}
              </div>

              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: "500",
                  marginBottom: "12px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color:
                    "var(--ltn__paragraph-color)",
                  fontSize: "15px",
                }}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section
        style={{
          maxWidth: "1250px",
          margin: "100px auto 0",
          background: "var(--white-7)",
          padding: "60px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "50px",
          }}
        >
          <p
            style={{
              color:
                "var(--ltn__secondary-color)",
              fontSize: "14px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "10px",
              fontWeight: "600",
            }}
          >
            Have A Doubt?
          </p>

          <h2
            style={{
              fontSize: "44px",
              fontWeight: "400",
            }}
          >
            Send Us A Message
          </h2>
        </div>

        <form>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            <input
              type="text"
              placeholder="Your Name"
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email Address"
              style={inputStyle}
            />

            <select style={inputStyle}>
              <option>
                Select Query Type
              </option>
              <option>Order Issue</option>
              <option>Return</option>
              <option>Payment</option>
              <option>Product Query</option>
              <option>Other</option>
            </select>

            <input
              type="tel"
              placeholder="Phone Number"
              style={inputStyle}
            />
          </div>

          <textarea
            rows="6"
            placeholder="Describe your query..."
            style={{
              ...inputStyle,
              marginTop: "24px",
              width: "100%",
              resize: "none",
            }}
          />

          {/* <button
            type="submit"
            style={{
              marginTop: "28px",
              background:
                "var(--ltn__primary-color)",
              color: "#fff",
              border:
                "1px solid var(--ltn__primary-color)",
              padding: "16px 38px",
              fontSize: "14px",
              cursor: "pointer",
              letterSpacing: "1px",
              transition: "0.3s ease",
            }}
          >
            Send Message
          </button> */}
          <button
  type="submit"
  style={{
    marginTop: "28px",
    background: "var(--ltn__primary-color)",
    color: "var(--white-7)",
    border: "1px solid var(--ltn__primary-color)",
    padding: "16px 38px",
    fontSize: "14px",
    fontWeight: "500",
    letterSpacing: "1px",
    cursor: "pointer",
    transition: "all 0.4s ease",
    display: "inline-block",
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "transparent";
    e.target.style.color = "var(--ltn__heading-color)";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "var(--ltn__primary-color)";
    e.target.style.color = "var(--white-7)";
  }}
>
  Send Message
</button>
        </form>
      </section>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "18px 20px",
  border: "1px solid var(--border-color-1)",
  outline: "none",
  fontSize: "15px",
  fontFamily: "var(--ltn__body-font)",
  background: "var(--section-bg-1)",
  color: "var(--ltn__heading-color)",
};

export default Contact;

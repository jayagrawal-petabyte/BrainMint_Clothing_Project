const sendEmail = async (to, subject, text) => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || "test@example.com";
  const senderName = process.env.BREVO_SENDER_NAME || "BrainMint Store";

  if (!apiKey) {
    console.error("BREVO_API_KEY is not defined in the environment variables");
    return;
  }

  const payload = {
    sender: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject: subject,
    textContent: text
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("BREVO ERROR:", data);
    } else {
      console.log("BREVO SUCCESS:", data);
    }
  } catch (error) {
    console.error("FAILED TO SEND EMAIL VIA BREVO:", error);
  }
};

module.exports = sendEmail;
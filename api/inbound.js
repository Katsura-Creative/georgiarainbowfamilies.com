const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = req.body.data || req.body;
    const from = email.from;
    const subject = email.subject;
    const html = email.html || email.body;
    const text = email.text;

    const sendPayload = {
      from: "info@georgiarainbowfamilies.com",
      to: "ben@katsuracreative.com",
      subject: `[GRF] ${subject || "(no subject)"}`,
      replyTo: from,
    };

    if (html) sendPayload.html = html;
    else if (text) sendPayload.text = text;
    else sendPayload.text = "(empty message)";

    await resend.emails.send(sendPayload);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to forward email:", error);
    return res.status(500).json({ error: "Failed to forward email" });
  }
};

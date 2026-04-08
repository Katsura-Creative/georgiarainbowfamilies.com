const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { from, subject, html, text, attachments } = req.body;

    await resend.emails.send({
      from: "info@georgiarainbowfamilies.com",
      to: "ben@katsuracreative.com",
      subject: `[GRF] ${subject || "(no subject)"}`,
      replyTo: from,
      html: html || undefined,
      text: text || undefined,
      attachments: attachments || undefined,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Failed to forward email:", error);
    return res.status(500).json({ error: "Failed to forward email" });
  }
};

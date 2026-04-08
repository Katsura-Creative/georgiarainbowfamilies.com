const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const email = req.body.data || req.body;
    const to = email.to;
    const toAddress = Array.isArray(to) ? to.join(', ') : (to || '');

    if (!toAddress.includes('georgiarainbowfamilies.com')) {
      return res.status(200).json({ success: true, skipped: true });
    }

    // Fetch the full email content via the Receiving API
    const fullEmail = await resend.emails.receiving.get(email.email_id);
    const from = email.from;
    const subject = email.subject;
    const html = fullEmail.data?.html;
    const text = fullEmail.data?.text;

    const sendPayload = {
      from: "info@georgiarainbowfamilies.com",
      to: "ben@katsuracreative.com",
      subject: `[info@georgiarainbowfamilies.com] ${subject || "(no subject)"}`,
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

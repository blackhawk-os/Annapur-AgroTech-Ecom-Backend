// esewaController.js
const generateEsewaURL = (req, res) => {
  const { amount, productId } = req.body;

  const totalAmount = amount || 100; // Default to 100 if no amount provided
  if (isNaN(totalAmount) || totalAmount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  const successURL = `http://localhost:3001/api/payment/esewa/success`;
  const failureURL = `http://localhost:3001/api/payment/esewa/failure`;

  const params = new URLSearchParams({
    amt: totalAmount,
    psc: "0",
    pdc: "0",
    txAmt: "0",
    tAmt: totalAmount,
    pid: productId || "ABC123",
    scd: "EPAYTEST", // Use 'EPAYTEST' for test, replace with your merchant code later
    su: successURL,
    fu: failureURL,
  });

  const redirectUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form?${params}`;
  res.json({ redirectUrl });
};
const handleEsewaSuccess = (req, res) => {
  const { amt, pid, refId } = req.query;

  // ✅ Optionally, verify transaction with eSewa's verification API
  console.log("✅ eSewa Success", { amt, pid, refId });

  // 👇 Redirect to frontend success page
  res.redirect(`/payment-success?refId=${refId}`);
};

const handleEsewaFailure = (req, res) => {
  console.log("❌ eSewa Payment Failed");
  res.redirect("/payment-failed");
};

module.exports = { generateEsewaURL, handleEsewaSuccess, handleEsewaFailure };

export const productPaymentEmail = (userName, amount, orderId, paymentId) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd;">
      <h2 style="color: #4CAF50;">Payment Successful 🎉</h2>
      <p>Dear <strong>${userName}</strong>,</p>
      <p>Thank you for your purchase! Your payment has been successfully processed.</p>
      
      <h3>Order Details:</h3>
      <ul style="list-style-type: none; padding: 0;">
        <li><strong>Order ID:</strong> ${orderId}</li>
        <li><strong>Payment ID:</strong> ${paymentId}</li>
        <li><strong>Amount Paid:</strong> ₹${amount}</li>
      </ul>

      <p>Your order will be processed shortly. If you have any questions, feel free to contact our support team.</p>
      
      <p style="margin-top: 20px;">Best regards,</p>
      <p><strong>Education Mart</strong></p>
    </div>
  `;
};

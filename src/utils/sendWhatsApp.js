export const sendWhatsApp = (member) => {
  if (!member?.phone) {
    console.log("Phone number not found");
    return;
  }

  const phone = String(member.phone).replace(/\D/g, ""); // remove spaces/symbols

  const message = `Dear ${member.name},

Your payment of ₹${member.due_amount} is due on ${member.expiry_date}.

Please make the payment on time.`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
};
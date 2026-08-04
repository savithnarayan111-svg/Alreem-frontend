import React, { forwardRef } from "react";

const Invoice = forwardRef(({ sale }, ref) => {
    if (!sale) return null;

    const items = sale?.items || [];

    const format = (n) => Number(n || 0).toFixed(2);

    // =========================================================
    // 💰 PAYMENT BREAKDOWN
    // =========================================================
    const cashSales = items.filter(i => i.payment_method === "cash");
    const cardSales = items.filter(i => i.payment_method === "card");
    const upiSales = items.filter(i => i.payment_method === "upi");

    const paymentSummary = {
        cash_count: cashSales.length,
        card_count: cardSales.length,
        upi_count: upiSales.length,

        cash_total: cashSales.reduce((a, b) => a + Number(b.subtotal || 0), 0),
        card_total: cardSales.reduce((a, b) => a + Number(b.subtotal || 0), 0),
        upi_total: upiSales.reduce((a, b) => a + Number(b.subtotal || 0), 0),
    };

    // =========================================================
    // 📈 PRODUCT PERFORMANCE (TOP SELLING)
    // =========================================================
    const productMap = {};

    items.forEach(i => {
        const name = i.product_name || i.product;

        if (!productMap[name]) {
            productMap[name] = { name, qty: 0, sales: 0 };
        }

        productMap[name].qty += Number(i.quantity || 0);
        productMap[name].sales += Number(i.subtotal || 0);
    });

    const topProducts = Object.values(productMap)
        .sort((a, b) => b.qty - a.qty);

    // =========================================================
    // 👤 CUSTOMER INSIGHTS
    // =========================================================
    const uniqueCustomers = new Set(
        items.map(i => i.member_id || i.phone || i.customer_id)
    );

    const customerCount = uniqueCustomers.size;

    return (
        <div
            ref={ref}
            style={{
                width: "800px",
                backgroundColor: "#ffffff",
                color: "#000",
                padding: "24px",
                fontFamily: "Arial, sans-serif"
            }}
        >

            {/* ================= HEADER ================= */}
            <div style={{
                borderBottom: "2px solid #ddd",
                paddingBottom: "12px",
                marginBottom: "16px"
            }}>
                <h1 style={{
                    margin: 0,
                    fontSize: "25px",
                    fontWeight: "bold",
                    textAlign: "center"
                }}>
                    SALES INVOICE REPORT (ADMIN)
                </h1>

                <p style={{ margin: "6px 0", color: "#666", textAlign: "center" }}>
                    Invoice No: {sale.invoice_no}
                </p>
            </div>

            {/* ================= SUMMARY ================= */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "10px",
                marginBottom: "20px"
            }}>
                <Card title="Total Sales" value={sale.total_amount} />
                <Card title="Total Items" value={items.length} />
                <Card title="Products Sold" value={items.reduce((a, b) => a + Number(b.quantity || 0), 0)} />
                <Card title="Customers" value={customerCount} />
            </div>

            {/* ================= TABLE ================= */}
            <table style={{
                width: "100%",
                fontSize: "14px",
                borderCollapse: "collapse",
                border: "1px solid #ddd"
            }}>
                <thead>
                    <tr style={{ background: "#f3f3f3" }}>
                        <th style={thStyle}>Product</th>
                        <th style={thStyle}>Qty</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, i) => (
                        <tr key={i}>
                            <td style={tdStyle}>{item.product_name}</td>
                            <td style={tdCenter}>{item.quantity}</td>
                            <td style={tdCenter}>₹{format(item.price)}</td>
                            <td style={tdCenter}>₹{format(item.subtotal)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* =========================================================
                💰 PAYMENT BREAKDOWN (NEW)
            ========================================================= */}
            <div style={{
                marginTop: "20px",
                borderTop: "2px solid #ddd",
                paddingTop: "12px"
            }}>
                <h3 className="font-bold py-3"> Payment Breakdown</h3>

                <p>Cash Payments: {paymentSummary.cash_count}  - ₹{paymentSummary.cash_total}</p>
                <p>UPI Payments: {paymentSummary.upi_count}  - ₹{paymentSummary.upi_total}</p>
                <p>Card Payments: {paymentSummary.card_count}  - ₹{paymentSummary.card_total}</p>
                <p>Due Payments: ₹{sale.due_amount || 0}</p>
            </div>

            {/* =========================================================
                📈 PRODUCT PERFORMANCE (NEW)
            ========================================================= */}
            <div style={{
                marginTop: "20px",
                borderTop: "2px solid #ddd",
                paddingTop: "12px"
            }}>
                <h3 className="font-bold py-3">Top Selling Products</h3>

                {/* <p style={{ fontWeight: "bold" }}></p> */}

                <ol>
                    {topProducts.slice(0, 5).map((p, i) => (
                        <li key={i}>
                            {p.name} - {p.qty} sales
                        </li>
                    ))}
                </ol>
            </div>

            {/* =========================================================
                FOOTER
            ========================================================= */}
            <div style={{
                marginTop: "20px",
                borderTop: "2px solid #ddd",
                paddingTop: "12px",
                textAlign: "center",
                fontSize: "12px",
                color: "#666"
            }}>
                Generated by Admin Panel • Gym Management System
            </div>

        </div>
    );
});

// ================= CARD =================
const Card = ({ title, value }) => (
    <div style={{
        border: "1px solid #ddd",
        padding: "10px",
        textAlign: "center",
        background: "#fafafa"
    }}>
        <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{title}</p>
        <h3 style={{ margin: 0 }}>₹{value || 0}</h3>
    </div>
);

// ================= STYLES =================
const thStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left"
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd"
};

const tdCenter = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center"
};

export default Invoice;
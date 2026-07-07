import React, { forwardRef } from "react";

const thStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "left",
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
};

const tdCenter = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
};

const Invoice = forwardRef(({ sale }, ref) => {
    if (!sale) return null;

    const items = sale?.items || [];

    return (
        <div
            ref={ref}
            style={{
                width: "800px",
                backgroundColor: "#fff",
                color: "#000",
                padding: "30px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "20px",
                }}
            >
                SALES INVOICE
            </h1>

            <div style={{ marginBottom: "20px" }}>
                <p>
                    <strong>Sale ID:</strong> {sale.id}
                </p>

                <p>
                    <strong>Invoice No:</strong> {sale.invoice_no}
                </p>

                <p>
                    <strong>Member ID:</strong> {sale.member_id}
                </p>

                <p>
                    <strong>Member Name:</strong> {sale.member_name}
                </p>

                <p>
                    <strong>Payment Method:</strong> {sale.payment_method}
                </p>

                <p>
                    <strong>Sold At:</strong>{" "}
                    {sale.sold_at
                        ? new Date(sale.sold_at).toLocaleString()
                        : ""}
                </p>
            </div>

            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                }}
            >
                <thead>
                    <tr>
                        <th style={thStyle}>Product Name</th>
                        <th style={thStyle}>Quantity</th>
                        <th style={thStyle}>Unit Price</th>
                        <th style={thStyle}>Total Price</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item, index) => (
                        <tr key={index}>
                            <td style={tdStyle}>{item.product_name}</td>
                            <td style={tdCenter}>{item.quantity}</td>
                            <td style={tdCenter}>₹{item.price}</td>
                            <td style={tdCenter}>₹{item.subtotal}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div
                style={{
                    marginTop: "20px",
                    textAlign: "right",
                    fontSize: "18px",
                    fontWeight: "bold",
                }}
            >
                Total Amount: ₹{sale.total_amount}
            </div>
        </div>
    );
});

export default Invoice;
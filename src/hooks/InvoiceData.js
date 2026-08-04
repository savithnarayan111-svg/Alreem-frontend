export const createInvoiceData = (sales) => ({
    invoice_no: `INV-${Date.now()}`,
    customer_name: "Daily Sales",
    phone: "-",

    items: sales.map((sale) => ({
        product_name: sale.product,
        quantity: sale.quantity,
        payment_method: sale.payment_method,
        price: sale.unit_price,
        subtotal: sale.total_amount,
        member_id: sale.member_id,
    })),

    total_amount: sales.reduce(
        (sum, sale) => sum + Number(sale.total_amount || 0),
        0
    ),

    due_amount: 0,
});
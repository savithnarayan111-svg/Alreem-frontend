import React, { useRef, useState } from "react";
import { useSales, useTodaySales } from "../hooks/useSales";
import { ArrowDownToLine } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Invoice from "./Invoice";

const Sales = () => {
    const { todaySales, loading: todayLoading } = useTodaySales();
    const { sales, loading } = useSales();

    const invoiceRef = useRef();
    const [selectedSale, setSelectedSale] = useState(null);

    if (loading) return <p>Loading...</p>;

    // ================= INVOICE DATA =================
    const invoiceData = {
        invoice_no: "INV-" + Date.now(),
        customer_name: "Daily Sales",
        phone: "-",
        items: sales.map(s => ({
            product_name: s.product,
            quantity: s.quantity,
            payment_method: s.payment_method,
            price: s.unit_price,
            subtotal: s.total_amount,
            member_id: s.member_id,
        })),
        total_amount: sales.reduce((a, b) => a + Number(b.total_amount || 0), 0),
        due_amount: 0,
    };

    // ================= PDF GENERATION =================
    const generatePDF = async () => {
        const element = invoiceRef.current;
        if (!element) return;

        await new Promise(resolve => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => resolve());
            });
        });

        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position -= pdf.internal.pageSize.getHeight();
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        pdf.save(`invoice_${Date.now()}.pdf`);
    };

    return (
        <div className="flex flex-col gap-8">

            {/* HEADER (UNCHANGED UI) */}
            <div className="flex justify-between items-end">
                <h1 className="text-2xl font-bold text-slate-900">
                    Sales Management
                </h1>
            </div>

            {/* TODAY SALES (UNCHANGED UI) */}
            {todaySales.map((sale) => (
                <div key={sale.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg flex flex-col justify-between">

                        <p className="text-sm text-slate-500">Sales Overview</p>

                        <h2 className="text-2xl font-bold mt-2">
                            {sale.today_sales}
                        </h2>

                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between">
                                <p className="text-xs text-slate-400">products sold</p>
                                <p className="text-xs font-bold">{sale.products_sold}</p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-xs text-slate-400">sales count</p>
                                <p className="text-xs font-bold">{sale.sales_count}</p>
                            </div>
                        </div>
                    </div>

                    {/* DOWNLOAD BUTTON (FIXED) */}
                    <div className="flex items-center">
                        <button
                            onClick={async () => {
                                setSelectedSale(invoiceData);

                                await new Promise(resolve => {
                                    requestAnimationFrame(() => {
                                        requestAnimationFrame(() => resolve());
                                    });
                                });

                                await generatePDF();
                            }}
                        >
                            <ArrowDownToLine size={18} className="text-green-600" />
                        </button>
                    </div>
                </div>
            ))}

            {/* TABLE (UNCHANGED UI) */}
            <div className="bg-white rounded-xl shadow border border-slate-100 shadow-lg overflow-visible">
                <table className="w-full">
                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Sale ID</th>
                            <th className="px-4 py-3 text-left">Member</th>
                            <th className="px-4 py-3 text-left">Product</th>
                            <th className="px-4 py-3 text-left">Qty</th>
                            <th className="px-4 py-3 text-left">Payment</th>
                            <th className="px-4 py-3 text-left">Price</th>
                            <th className="px-4 py-3 text-left">Total</th>
                            <th className="px-4 py-3 text-left">Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-50">
                                <td className="px-4 py-3">{sale.id}</td>
                                <td className="px-4 py-3">{sale.member_id}/{sale.member_name}</td>
                                <td className="px-4 py-3">{sale.product}</td>
                                <td className="px-4 py-3">{sale.quantity}</td>
                                <td className="px-4 py-3">{sale.payment_method}</td>
                                <td className="px-4 py-3">₹{sale.unit_price}</td>
                                <td className="px-4 py-3 font-bold">₹{sale.total_amount}</td>
                                <td className="px-4 py-3">{sale.sold_at}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* HIDDEN INVOICE (IMPORTANT FIX - MUST BE VISIBLE IN DOM) */}
            {selectedSale && (
                <div
                    style={{
                        position: "absolute",
                        left: "-9999px",
                        top: 0,
                        width: "800px",
                        background: "#fff"
                    }}
                >
                    <Invoice ref={invoiceRef} sale={selectedSale} />
                </div>
            )}

        </div>
    );
};

export default Sales;
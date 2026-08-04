import React, { useRef, useState } from "react";
import { ArrowDownToLine } from "lucide-react";

import { useSales, useTodaySales } from "../hooks/useSales";

import Invoice from "../Components/Sales/Invoice";
import SalesHeader from "../Components/Sales/SalesHeader";
import SalesFilter from "../Components/Sales/SalesFilter";
import SalesTable from "../Components/Sales/SalesTable";

import { createInvoiceData } from "../hooks/InvoiceData";
import { generateInvoicePDF } from "../hooks/InvoiceDownload";

const Sales = () => {
    const { todaySales } = useTodaySales();

    const [period, setPeriod] = useState("daily");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const { sales, loading } = useSales(
        period,
        selectedDate
    );

    const invoiceRef = useRef();

    const [selectedSale, setSelectedSale] =
        useState(null);

    if (loading) return <p>Loading...</p>;

    const invoiceData = createInvoiceData(sales);

    const handleDownload = async () => {
        setSelectedSale(invoiceData);

        await new Promise((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(resolve);
            });
        });

        await generateInvoicePDF(invoiceRef);
    };

    return (
        <div className="flex flex-col gap-8">
            <SalesHeader onDownload={handleDownload} />

            <SalesFilter
                period={period}
                setPeriod={setPeriod}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />

            {todaySales.map((sale) => (
                <div
                    key={sale.id}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg flex flex-col justify-between">
                        <p className="text-sm text-slate-500">
                            Sales Overview
                        </p>

                        <h2 className="text-2xl font-bold mt-2">
                            {sale.today_sales}
                        </h2>

                        <div className="mt-3 space-y-2">
                            <div className="flex justify-between">
                                <p className="text-xs text-slate-400">
                                    Products Sold
                                </p>

                                <p className="text-xs font-bold">
                                    {sale.products_sold}
                                </p>
                            </div>

                            <div className="flex justify-between">
                                <p className="text-xs text-slate-400">
                                    Sales Count
                                </p>

                                <p className="text-xs font-bold">
                                    {sale.sales_count}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 border-2 border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-100 transition"
                        >
                            <span className="text-sm font-semibold">
                                Print Report
                            </span>

                            <ArrowDownToLine
                                size={18}
                                className="text-blue-600"
                            />
                        </button>
                    </div>
                </div>
            ))}

            <SalesTable sales={sales} />

            {selectedSale && (
                <div
                    style={{
                        position: "absolute",
                        left: "-9999px",
                        top: 0,
                        width: "800px",
                        background: "#fff",
                    }}
                >
                    <Invoice
                        ref={invoiceRef}
                        sale={selectedSale}
                    />
                </div>
            )}
        </div>
    );
};

export default Sales;
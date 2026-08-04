// import React, { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useRef, useState } from "react";
import Income_members from "../Components/Profit_Loss/Income_members";
import Expense_category from "../Components/Profit_Loss/Expense_category";
import Kpis from "../Components/Profit_Loss/Kpis";
import Sales_category from "../Components/Profit_Loss/Sales_category";
import ProfitLossReport from "../Components/ProfitLossReport";
import { handleDownload } from "../hooks/reportdownloads";

const Profit_loss = () => {

    const pdfRef = useRef(null);

    const [reportData, setReportData] = useState(null);

    const [period, setPeriod] = useState("daily");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const buttons = [
        "daily",
        "weekly",
        "monthly",
        "yearly",
        "custom",
    ];

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between gap-3">

                {/* Period Buttons */}
                <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-100 p-1 shadow-sm">

                    {buttons.map((item) => (
                        <button
                            key={item}
                            onClick={() => setPeriod(item)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition
                            ${period === item
                                    ? "bg-blue-500 text-white"
                                    : "text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}

                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">

                    {period === "custom" ? (

                        <div className="flex items-center gap-2">

                            <input
                                type="date"
                                value={fromDate}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setFromDate(e.target.value)
                                }
                                className="border border-slate-200 rounded-lg px-3 py-2"
                            />

                            <span className="text-slate-500">
                                to
                            </span>

                            <input
                                type="date"
                                value={toDate}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setToDate(e.target.value)
                                }
                                className="border border-slate-200 rounded-lg px-3 py-2"
                            />

                        </div>

                    ) : (

                        <div className="relative">

                            <input
                                type="date"
                                value={selectedDate}
                                max={new Date().toISOString().split("T")[0]}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />

                            <button
                                type="button"
                                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm text-slate-500"
                            >
                                <CalendarDays size={18} />
                            </button>

                        </div>

                    )}

                    <button
                        onClick={() =>
                            handleDownload(
                                period,
                                selectedDate,
                                fromDate,
                                toDate,
                                pdfRef,
                                setReportData
                            )
                        }
                        className="bg-blue-500 rounded-lg px-3 py-2 text-xs text-white"
                    >
                        DOWNLOAD PDF
                    </button>

                </div>

            </div>

            <Kpis
                period={period}
                selectedDate={selectedDate}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

                <Sales_category
                    period={period}
                    selectedDate={selectedDate}
                />

                <Income_members
                    period={period}
                    selectedDate={selectedDate}
                />

                <Expense_category
                    period={period}
                    selectedDate={selectedDate}
                />

            </div>

            {/* Hidden PDF Component */}
            <div
                style={{
                    position: "absolute",
                    left: "-9999px",
                    top: 0,
                    width: "800px"
                }}
            >
                <ProfitLossReport
                    ref={pdfRef}
                    report={reportData}
                />
            </div>

        </div>
    );
};

export default Profit_loss;
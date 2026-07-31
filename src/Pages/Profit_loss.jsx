import React, { useState } from "react";
import { CalendarDays } from "lucide-react";

import Income_members from "../Components/Profit_Loss/Income_members";
import Expense_category from "../Components/Profit_Loss/Expense_category";
import Kpis from "../Components/Profit_Loss/Kpis";
import Sales_category from "../Components/Profit_Loss/Sales_category";

const Profit_loss = () => {
    const [period, setPeriod] = useState("daily");
    const buttons = [
        "daily",
        "weekly",
        "monthly",
        "yearly",
    ];
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold text-slate-900">
                    Profit & Loss
                </h1>
            </div>
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 rounded-xl bg-white border border-slate-100 p-1 shadow-sm">
                    {buttons.map((item) => (
                        <button
                            key={item}
                            onClick={() => setPeriod(item)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${period === item
                                ? "bg-blue-500 text-white"
                                : "text-slate-500 hover:text-slate-900"
                                }`}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                        </button>
                    ))}

                </div>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                    Export PDF
                </button>
                {/* <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-100 shadow-sm text-slate-500">
                    <CalendarDays size={18} />
                </button> */}
            </div>
            <Kpis period={period} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Sales_category period={period} />
                <Income_members period={period} />
                <Expense_category period={period} />
            </div>
        </div>
    );
};

export default Profit_loss;


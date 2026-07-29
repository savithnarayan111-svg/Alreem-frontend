import React from "react";
import Income_members from "../Components/Profit_Loss/Income_members";
import Expense_category from "../Components/Profit_Loss/Expense_category";
import Kpis from "../Components/Profit_Loss/Kpis";
import Sales_category from "../Components/Profit_Loss/Sales_category";

const Profit_loss = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Profit & Loss
                </h1>

                <button className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                    Export PDF
                </button>
            </div>
            <Kpis />
            <div className="flex gap-5">
                <Sales_category />
                <Income_members />
                <Expense_category />
            </div>
        </div>
    );
};

export default Profit_loss;
import React from "react";
import { ArrowDownToLine } from "lucide-react";

const SalesHeader = ({ onDownload }) => {
    return (
        <div className="flex justify-between items-end">
            <h1 className="text-2xl font-bold text-slate-900">
                Sales Management
            </h1>

            <button
                onClick={onDownload}
                className="flex items-center bg-blue-500 text-white gap-2 rounded-lg px-4 py-2"
            >
                <span className="text-sm">
                    Print Report
                </span>

                <ArrowDownToLine
                    size={18}
                    className="text-white"
                />
            </button>
        </div>
    );
};

export default SalesHeader;
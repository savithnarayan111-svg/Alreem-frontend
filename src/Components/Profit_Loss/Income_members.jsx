import React, { useEffect } from "react";
import useAdditionalIncomes from "../../hooks/useIncomes"

const Income_members = () => {
    const {
        memberIncome,
        fetchMemberIncome,
        loading,
    } = useAdditionalIncomes();

    useEffect(() => {
        fetchMemberIncome();
    }, []);

    const maxAmount =
        Math.max(...memberIncome.map((item) => item.amount), 0);

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-md p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-10">
                Income by Members
            </h2>

            <div className="flex">
                {/* Y Axis */}
                <div className="flex flex-col justify-between h-64 pr-4 text-right text-gray-700 text-sm">
                    <span>₹{maxAmount.toLocaleString()}</span>
                    <span>₹{Math.round(maxAmount * 0.75).toLocaleString()}</span>
                    <span>₹{Math.round(maxAmount * 0.5).toLocaleString()}</span>
                    <span>₹{Math.round(maxAmount * 0.25).toLocaleString()}</span>
                    <span>₹0</span>
                </div>

                {/* Bars */}
                <div className="flex-1 flex items-end justify-around h-64 border-l border-gray-200 pl-6">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        memberIncome.map((item) => {
                            const height = (item.amount / maxAmount) * 240;

                            return (
                                <div
                                    key={item.name}
                                    className="flex flex-col items-center"
                                >
                                    <span className="text-sm text-gray-800 mb-2">
                                        ₹{item.amount.toLocaleString()}
                                    </span>

                                    <div
                                        className="w-16 bg-blue-500 rounded-t-md transition-all"
                                        style={{
                                            height: `${height}px`,
                                        }}
                                    ></div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* X Axis */}
            <div className="flex justify-around pl-24 mt-4 text-center text-sm text-gray-800">
                {memberIncome.map((item) => (
                    <span
                        key={item.name}
                        className="w-20 break-words"
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Income_members;
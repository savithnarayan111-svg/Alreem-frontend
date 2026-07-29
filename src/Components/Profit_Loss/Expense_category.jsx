import React from "react";
import useDashboard from "../../hooks/useDashboard";

const Expense_category = () => {
    const { expenseCategories, loading } = useDashboard();

    const maxAmount = Math.max(
        ...expenseCategories.map((item) => Number(item.amount)),
        1
    );

    if (loading) {
        return (
            <div className="w-80 rounded-2xl bg-white shadow-md p-5">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-md p-8">

            <h2 className="text-xl font-bold text-gray-900 mb-10">
                Expense by Category
            </h2>

            <div className="space-y-6">
                {expenseCategories.length > 0 ? (
                    expenseCategories.map((item, index) => {
                        const width = (Number(item.amount) / maxAmount) * 100;

                        return (
                            <div
                                key={index}
                                className="flex items-center gap-3"
                            >
                                <span className="w-24 text-sm text-gray-600 capitalize">
                                    {item.category}
                                </span>

                                <div className="flex-1">
                                    <div
                                        className="h-6 rounded-md bg-red-500"
                                        style={{
                                            width: `${width}%`,
                                        }}
                                    />
                                </div>

                                <span className="text-sm font-medium text-gray-700">
                                    ₹{Number(item.amount).toLocaleString("en-US")}
                                </span>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500">
                        No expense data available
                    </p>
                )}
            </div>
        </div>
    );
};

export default Expense_category;
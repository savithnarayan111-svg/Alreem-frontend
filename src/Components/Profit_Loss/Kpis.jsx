import React, { useEffect } from "react";
import {
    ShoppingCart,
    Wallet,
    IndianRupee,
    TrendingUp,
} from "lucide-react";
import useDashboard from "../../hooks/useDashboard"

const Kpis = () => {
    const {
        stats,
        loading,
        fetchDashboardStats,
    } = useDashboard();

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* Total Sales */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-blue-500 text-white p-2 rounded-full">
                    <ShoppingCart size={28} />
                </div>

                <div>
                    <p className="text-sm text-slate-500">Total Sales</p>
                    <h2 className="text-2xl font-bold">
                        ₹{Number(stats?.total_sales || 0).toLocaleString("en-US")}
                    </h2>
                    {/* <p className="text-green-600 text-sm">
                        +{Number(stats?.sales_growth || 0).toFixed(1)}%
                    </p> */}
                </div>
            </div>

            {/* Total Expense */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-red-500 text-white p-2 rounded-full">
                    <Wallet size={28} />
                </div>

                <div>
                    <p className="text-sm text-slate-500">Total Expense</p>
                    <h2 className="text-2xl font-bold">
                        ₹{Number(stats?.total_expense || 0).toLocaleString("en-US")}
                    </h2>
                    {/* <p className="text-red-600 text-sm">
                        {Number(stats?.expense_growth || 0).toFixed(1)}%
                    </p> */}
                </div>
            </div>

            {/* Total Income */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-emerald-500 text-white p-2 rounded-full">
                    <IndianRupee size={28} />
                </div>

                <div>
                    <p className="text-sm text-slate-500">Total Income</p>
                    <h2 className="text-2xl font-bold">
                        ₹{Number(stats?.total_income || 0).toLocaleString("en-US")}
                    </h2>
                    {/* <p className="text-green-600 text-sm">
                        +{Number(stats?.revenue_growth || 0).toFixed(1)}%
                    </p> */}
                </div>
            </div>

            {/* Total Profit */}
            <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4">
                <div className="bg-violet-500 text-white p-2 rounded-full">
                    <TrendingUp size={28} />
                </div>

                <div>
                    <p className="text-sm text-slate-500">Total Profit</p>
                    <h2 className="text-2xl font-bold">
                        ₹{Number(stats?.total_profit || 0).toLocaleString("en-US")}
                    </h2>
                    {/* <p className="text-green-600 text-sm">
                        +{Number(stats?.profit_growth || 0).toFixed(1)}%
                    </p> */}
                </div>
            </div>

        </div>
    );
};

export default Kpis;
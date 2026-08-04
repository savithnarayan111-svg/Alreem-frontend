import React from "react";
import {
    ShoppingCart,
    Wallet,
    IndianRupee,
    TrendingUp,
} from "lucide-react";
import useDashboard from "../../hooks/useDashboard";
const Kpis = ({
    period = "daily",
    selectedDate,
}) => {
    const {
        stats,
        loading,
    } = useDashboard(
        period,
        selectedDate
    );
    const formatAmount = (value) => {

        return Number(
            value || 0
        ).toLocaleString("en-IN");

    };
    const periodLabel =
        period.charAt(0).toUpperCase()
        +
        period.slice(1);
    const getPeriodKey = (type) => {

        if (period === "daily") {
            return `today_${type}`;
        }

        if (period === "weekly") {

            return `total_${type}`;

        }
        if (period === "monthly") {

            return `monthly_${type}`;
        }
        if (period === "yearly") {

            return `yearly_${type}`;

        }
        return `total_${type}`;

    };
    const cards = [

        {
            title: `${periodLabel} Sales`,
            value: stats?.[getPeriodKey("sales")],
            icon: ShoppingCart,
            iconStyle:
                "bg-blue-50 text-blue-500",
        },

        {
            title: `${periodLabel} Income`,
            value: stats?.[getPeriodKey("income")],
            icon: IndianRupee,
            iconStyle:
                "bg-emerald-50 text-emerald-500",
        },

        {
            title: `${periodLabel} Expense`,
            value: stats?.[getPeriodKey("expense")],
            icon: Wallet,
            iconStyle:
                "bg-red-50 text-red-500",
        },

        {
            title: `${periodLabel} Profit`,
            value: stats?.[getPeriodKey("profit")],
            icon: TrendingUp,
            iconStyle:
                "bg-violet-50 text-violet-500",
        },
    ];
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {
                    cards.map((card) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={card.title}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-5">
                                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center 
                                        ${card.iconStyle}`}>
                                        <Icon size={22} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">
                                            {card.title}
                                        </p>
                                        {
                                            loading ?
                                                (
                                                    <div className="mt-2 h-8 w-32 rounded-lg bg-slate-100 animate-pulse" />
                                                ) : (
                                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                                        ₹{formatAmount(card.value)}
                                                    </h2>
                                                )
                                        }
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
};

export default Kpis;
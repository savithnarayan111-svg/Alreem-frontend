import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { useSales } from "../../hooks/useSales";


const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#6B7280",
];


const CATEGORY_LABELS = {
    supplements: "Supplements",
    equipment: "Equipment",
    accessories: "Gym Accessories",
    apparel: "Gym Apparel",
    nutrition: "Nutrition & Drinks",
    other: "Other",
};


const Sales_category = ({
    period = "daily",
    selectedDate,
}) => {


    const {
        sales = [],
        loading,
    } = useSales(
        period,
        selectedDate
    );


    const categoryMap = {};


    sales.forEach((sale) => {

        const category =
            sale.category || "other";


        const amount =
            Number(
                sale.total_amount || 0
            );


        categoryMap[category] =
            (categoryMap[category] || 0)
            +
            amount;

    });



    const totalSales =
        Object.values(categoryMap).reduce(
            (sum, amount) =>
                sum + amount,
            0
        );



    const data = Object.entries(categoryMap)

        .map(([name, amount]) => ({

            name,

            amount,

            value:
                totalSales > 0
                    ?
                    Number(
                        (
                            (amount / totalSales)
                            *
                            100
                        ).toFixed(1)
                    )
                    :
                    0

        }))

        // highest sales first
        .sort(
            (a, b) =>
                b.amount - a.amount
        );



    const periodLabel =
        period.charAt(0).toUpperCase()
        +
        period.slice(1);



    return (

        <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm p-6">


            <div className="mb-6">

                <h2 className="text-lg font-semibold text-slate-900">
                    Sales by Category
                </h2>


                <p className="text-sm text-slate-400 mt-1">
                    {periodLabel} sales distribution
                </p>

            </div>




            {
                loading ? (

                    <div className="h-72 flex items-center justify-center">

                        <p className="text-sm text-slate-400">
                            Loading sales...
                        </p>

                    </div>


                )

                    :

                    data.length === 0 ? (

                        <div className="h-72 flex items-center justify-center">

                            <p className="text-sm text-slate-400">
                                No sales available
                            </p>

                        </div>


                    )

                        :

                        (

                            <>


                                {/* Donut Chart */}

                                <div className="relative w-full h-64">


                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >

                                        <PieChart>


                                            <Pie

                                                data={data}

                                                dataKey="value"

                                                innerRadius={75}

                                                outerRadius={105}

                                                stroke="none"

                                                paddingAngle={2}

                                            >


                                                {
                                                    data.map(
                                                        (_, index) => (

                                                            <Cell

                                                                key={index}

                                                                fill={
                                                                    COLORS[
                                                                    index %
                                                                    COLORS.length
                                                                    ]
                                                                }

                                                            />

                                                        )
                                                    )
                                                }


                                            </Pie>


                                        </PieChart>


                                    </ResponsiveContainer>



                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">


                                        <p className="text-xs text-slate-400">
                                            Total Sales
                                        </p>


                                        <h2 className="text-3xl font-bold text-slate-900 mt-1">

                                            ₹
                                            {
                                                totalSales.toLocaleString(
                                                    "en-IN"
                                                )
                                            }

                                        </h2>


                                    </div>


                                </div>





                                {/* Category List */}

                                <div className="mt-6 space-y-4">


                                    {
                                        data.map(
                                            (item, index) => (

                                                <div

                                                    key={item.name}

                                                    className="flex items-center justify-between"

                                                >



                                                    <div className="flex items-center gap-3 min-w-0">


                                                        <div

                                                            className="w-3 h-3 rounded-full flex-shrink-0"

                                                            style={{

                                                                backgroundColor:
                                                                    COLORS[
                                                                    index %
                                                                    COLORS.length
                                                                    ]

                                                            }}

                                                        />



                                                        <div className="min-w-0">


                                                            <p className="text-sm font-medium text-slate-700 truncate">

                                                                {
                                                                    CATEGORY_LABELS[
                                                                    item.name
                                                                    ]
                                                                    ||
                                                                    item.name
                                                                }

                                                            </p>


                                                            <p className="text-xs text-slate-400 mt-0.5">

                                                                ₹
                                                                {
                                                                    item.amount.toLocaleString(
                                                                        "en-IN"
                                                                    )
                                                                }

                                                            </p>


                                                        </div>


                                                    </div>





                                                    <span className="text-sm font-semibold text-slate-700">

                                                        {
                                                            item.value
                                                        }%

                                                    </span>


                                                </div>

                                            )
                                        )
                                    }


                                </div>


                            </>

                        )

            }


        </div>

    );

};


export default Sales_category;
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
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

const Sales_category = () => {
    const { sales, loading } = useSales();

    const categoryMap = {};

    sales.forEach((sale) => {
        const category = sale.category || "other";
        const amount = Number(sale.total_amount || 0);

        categoryMap[category] =
            (categoryMap[category] || 0) + amount;
    });

    const totalSales = Object.values(categoryMap).reduce(
        (sum, amount) => sum + amount,
        0
    );

    const data = Object.entries(categoryMap).map(([name, amount]) => ({
        name,
        amount,
        value:
            totalSales > 0
                ? Number(((amount / totalSales) * 100).toFixed(1))
                : 0,
    }));

    return (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-md p-8">

            <h2 className="text-xl font-bold text-gray-900 mb-10">
                Sales by Category
            </h2>

            {loading ? (
                <p className="text-center text-gray-500">
                    Loading sales...
                </p>
            ) : data.length === 0 ? (
                <p className="text-center text-gray-500">
                    No sales available
                </p>
            ) : (
                <>
                    <div className="relative w-full h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    innerRadius={80}
                                    outerRadius={120}
                                    stroke="none"
                                >
                                    {data.map((_, index) => (
                                        <Cell
                                            key={index}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-lg text-gray-600">
                                Total Sales
                            </p>

                            <h2 className="text-4xl font-bold text-slate-800">
                                ₹{totalSales.toLocaleString("en-US")}
                            </h2>
                        </div>
                    </div>

                    <div className="space-y-5 mt-6">
                        {data.map((item, index) => (
                            <div
                                key={item.name}
                                className="flex justify-between items-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{
                                            backgroundColor:
                                                COLORS[index % COLORS.length],
                                        }}
                                    />

                                    <div>
                                        <h3 className="font-medium">
                                            {CATEGORY_LABELS[item.name] ||
                                                item.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            ₹{item.amount.toLocaleString("en-US")}
                                        </p>
                                    </div>
                                </div>

                                <span className="font-semibold text-slate-700">
                                    {item.value}%
                                </span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sales_category;
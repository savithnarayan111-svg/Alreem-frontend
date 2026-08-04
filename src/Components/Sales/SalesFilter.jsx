import React from "react";

const SalesFilter = ({
    period,
    setPeriod,
    selectedDate,
    setSelectedDate,
}) => {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-2 rounded-xl shadow">

            <div className="flex gap-2">
                {["daily", "weekly", "monthly", "yearly"].map((item) => (
                    <button
                        key={item}
                        onClick={() => setPeriod(item)}
                        className={`px-4 py-2 rounded-lg shadow-lg ${period === item
                            ? "bg-blue-600 text-white"
                            : "bg-white"
                            }`}
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                ))}
            </div>

            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="shadow-lg rounded-lg p-3"
            />

        </div>
    );
};

export default SalesFilter;
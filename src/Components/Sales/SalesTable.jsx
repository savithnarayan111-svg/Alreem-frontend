import React from "react";

const SalesTable = ({ sales }) => {
    return (
        <div className="bg-white rounded-xl shadow border border-slate-100 shadow-lg overflow-visible">
            <table className="w-full">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-4 text-left text-xs font-bold">
                            SALE ID
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            MEMBER
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            PRODUCT
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            CATEGORY
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            QTY
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            PAYMENT
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            PRICE
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            TOTAL
                        </th>

                        <th className="px-4 py-4 text-left text-xs font-bold">
                            DATE
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {sales.map((sale) => (
                        <tr
                            key={sale.id}
                            className="hover:bg-slate-50"
                        >
                            <td className="px-4 py-3">
                                {sale.id}
                            </td>

                            <td className="px-4 py-3">
                                {sale.member_id}/{sale.member_name}
                            </td>

                            <td className="px-4 py-3">
                                {sale.product}
                            </td>

                            <td className="px-4 py-3">
                                {sale.category}
                            </td>

                            <td className="px-4 py-3">
                                {sale.quantity}
                            </td>

                            <td className="px-4 py-3">
                                {sale.payment_method}
                            </td>

                            <td className="px-4 py-3">
                                ₹{sale.unit_price}
                            </td>

                            <td className="px-4 py-3 font-bold">
                                ₹{sale.total_amount}
                            </td>

                            <td className="px-4 py-3">
                                {sale.sold_at}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;
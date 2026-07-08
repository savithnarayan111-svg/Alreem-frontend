import React, { useEffect, useState } from "react";
import api from "../api/api";
import Pagination from "../Components/Pagination";

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await api.get("admin/api/transactions/");
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    const paginatedTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="flex flex-col gap-8">
            <div className="flex justify-between items-end">
                <h1 className="text-2xl font-bold text-slate-900">
                    Transactions
                </h1>
            </div>

            <div className="overflow-x-auto rounded-xl bg-white border border-slate-100 shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                NAME
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                FOR
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                PHONE
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                AMOUNT
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                TYPE
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                METHOD
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                DATE
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {paginatedTransactions.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="8"
                                    className="text-center py-12 text-slate-500"
                                >
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            paginatedTransactions.map((transaction) => (
                                <tr
                                    key={transaction.id}
                                    className="hover:bg-gray-100 transition-colors duration-200 even:bg-slate-50"
                                >
                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                        #{transaction.id}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {transaction.name}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-slate-800">
                                        {transaction.transaction_for}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600">
                                        {transaction.phone}
                                    </td>

                                    <td
                                        className={`px-6 py-4 font-bold ${transaction.transaction_for === "Member"
                                            ? "text-green-600"
                                            : "text-red-600"
                                            }`}
                                    >
                                        {transaction.transaction_for === "Member"
                                            ? "+"
                                            : "-"}
                                        ₹{transaction.amount}
                                    </td>

                                    <td className="px-6 py-4 text-slate-700">
                                        {transaction.payment_type}
                                    </td>

                                    <td className="px-6 py-4 text-slate-700">
                                        {transaction.payment_method}
                                    </td>

                                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                                        {transaction.payment_date}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <Pagination
                    currentPage={currentPage}
                    totalItems={transactions.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default Transactions;
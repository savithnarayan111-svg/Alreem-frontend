import React, { useEffect, useState } from "react";
import useAdditionalExpenses from "../../hooks/useExpenses";
import Pagination from "../Pagination";

const Expense = () => {

    const {
        expenses,
        loading,
        fetchAdditionalExpenses,
    } = useAdditionalExpenses();


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    useEffect(() => {
        fetchAdditionalExpenses();
    }, []);

    const filteredExpense = expenses;


    const paginatedExpense = filteredExpense.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (
        <div className="w-full overflow-x-auto rounded-xl shadow-sm">


            {loading ? (

                <p className="py-10 text-center text-slate-500">
                    Loading expenses...
                </p>

            ) : (

                <>

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    ID
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    TITLE
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    NAME
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    PHONE
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    CATEGORY
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    DESCRIPTION
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    AMOUNT
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    METHOD
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                    DATE
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {paginatedExpense.length > 0 ? (

                                paginatedExpense.map((expense) => (

                                    <tr
                                        key={expense.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            {expense.id}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.title}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.name || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.phone || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.category || "-"}
                                        </td>

                                        <td className="px-6 py-4 min-w-[250px]">
                                            {expense.description || "-"}
                                        </td>

                                        <td className="px-6 py-4 font-semibold whitespace-nowrap">
                                            ₹{expense.amount}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.payment_method || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {expense.date}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="py-10 text-center text-slate-500"
                                    >
                                        No expenses found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>


                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredExpense.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />

                </>

            )}

        </div>
    );
};

export default Expense;
import React, { useEffect, useState } from "react";
import useAdditionalIncomes from "../../hooks/useIncomes";
import Pagination from "../Pagination";

const Income = () => {

    const {
        incomes,
        loading,
        fetchAdditionalIncomes,
    } = useAdditionalIncomes();


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    useEffect(() => {
        fetchAdditionalIncomes();
    }, []);


    const paginatedIncome = incomes.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    return (

        <div className="w-full overflow-x-auto rounded-xl shadow-sm">

            {loading ? (

                <p className="py-10 text-center text-slate-500">
                    Loading incomes...
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

                            {paginatedIncome.length > 0 ? (

                                paginatedIncome.map((income) => (

                                    <tr
                                        key={income.id}
                                        className="hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-4">
                                            {income.id}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {income.title}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {income.name || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {income.phone || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {income.category || "-"}
                                        </td>

                                        <td className="px-6 py-4 min-w-[250px]">
                                            {income.description || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap font-semibold">
                                            ₹{income.amount}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {income.payment_method || "-"}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {income.date}
                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>
                                    <td
                                        colSpan="9"
                                        className="py-10 text-center text-slate-500"
                                    >
                                        No income found
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>


                    <Pagination
                        currentPage={currentPage}
                        totalItems={incomes.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />

                </>

            )}

        </div>

    );
};

export default Income;
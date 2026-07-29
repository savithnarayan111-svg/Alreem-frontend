import React, { useState } from "react";
import Income from "../Components/Transactions/Income";
import Expense from "../Components/Transactions/Expense";
import Add_expense from "../Components/Transactions/Add_expense";
import Add_Income from "../Components/Transactions/Add_income";
import useAdditionalExpenses from "../hooks/useExpenses";
import useAdditionalIncomes from "../hooks/useIncomes";

const Transaction = () => {

    const [active, setActive] = useState("Income");

    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [showIncomeModal, setShowIncomeModal] = useState(false);

    const {
        createIncome
    } = useAdditionalIncomes();
    const {
        createExpense
    } = useAdditionalExpenses();



    const tabs = ["Income", "Expense"];


    const handleAdd = () => {

        if (active === "Income") {
            setShowIncomeModal(true);
        } else {
            setShowExpenseModal(true);
        }

    };


    const handleExpenseSubmit = async (data) => {

        try {

            await createExpense(data);

            setShowExpenseModal(false);

        } catch (error) {

            console.error(
                "Expense adding failed:",
                error
            );

        }
    };


    const handleIncomeSubmit = async (data) => {

        try {

            await createIncome(data);

            setShowIncomeModal(false);

        } catch (error) {

            console.error(
                "Income adding failed:",
                error
            );

        }

    };


    return (
        <div className="flex flex-col gap-8">

            {/* <div className="flex justify-between items-end">

                <h1 className="text-2xl font-bold text-slate-900">
                    Transactions
                </h1>

            </div> */}


            <div className="flex items-center justify-between">

                <div className="inline-flex rounded-xl bg-slate-100 p-1 shadow-sm gap-1">

                    {tabs.map((tab) => (

                        <button
                            key={tab}
                            onClick={() => setActive(tab)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${active === tab
                                ? "bg-blue-600 text-white shadow"
                                : "text-slate-500 hover:bg-white hover:text-slate-900"
                                }`}
                        >
                            {tab}
                        </button>

                    ))}

                </div>


                <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
                >
                    {active === "Income"
                        ? "Add Income +"
                        : "Add Expense +"
                    }

                </button>

            </div>


            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

                {active === "Income"
                    ? <Income />
                    : <Expense />
                }

            </div>


            {showExpenseModal && (

                <Add_expense
                    onClose={() => setShowExpenseModal(false)}
                    onSubmit={handleExpenseSubmit}
                />

            )}


            {showIncomeModal && (

                <Add_Income
                    onClose={() => setShowIncomeModal(false)}
                    onSubmit={handleIncomeSubmit}
                />

            )}

        </div>
    );
};

export default Transaction;
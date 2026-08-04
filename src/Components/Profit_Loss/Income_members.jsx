import React from "react";
import useAdditionalIncomes from "../../hooks/useIncomes";

const Income_members = ({
    period = "daily",
    selectedDate,
}) => {

    const {
        memberIncome = [],
        loading,
    } = useAdditionalIncomes(
        period,
        selectedDate
    );


    const sortedIncome = [...memberIncome].sort(
        (a, b) =>
            Number(b.amount || 0) -
            Number(a.amount || 0)
    );


    const maxAmount = Math.max(
        ...sortedIncome.map(
            (item) => Number(item.amount) || 0
        ),
        0
    );


    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6">


            <h2 className="text-lg font-semibold text-slate-900 mb-8">
                Income by Members
            </h2>



            {loading ? (

                <div className="h-64 flex items-center justify-center">

                    <p className="text-sm text-slate-400">
                        Loading...
                    </p>

                </div>


            ) : sortedIncome.length === 0 ? (

                <div className="h-64 flex items-center justify-center">

                    <p className="text-sm text-slate-400">
                        No income data available
                    </p>

                </div>


            ) : (

                <>

                    <div className="flex overflow-x-auto">


                        {/* Y Axis */}

                        <div className="flex flex-col justify-between h-64 pr-4 text-right text-xs text-slate-400">


                            <span>
                                ₹{maxAmount.toLocaleString("en-IN")}
                            </span>


                            <span>
                                ₹{Math.round(
                                    maxAmount * 0.75
                                ).toLocaleString("en-IN")}
                            </span>


                            <span>
                                ₹{Math.round(
                                    maxAmount * 0.5
                                ).toLocaleString("en-IN")}
                            </span>


                            <span>
                                ₹{Math.round(
                                    maxAmount * 0.25
                                ).toLocaleString("en-IN")}
                            </span>


                            <span>
                                ₹0
                            </span>


                        </div>




                        {/* Chart */}

                        <div className="flex-1 flex items-end justify-around h-64 border-l border-b border-slate-100 pl-6 min-w-max">


                            {sortedIncome.map(
                                (item, index) => {


                                    const amount =
                                        Number(item.amount) || 0;


                                    const height =
                                        maxAmount > 0
                                            ? (amount / maxAmount) * 240
                                            : 0;



                                    return (

                                        <div
                                            key={`${item.name}-${index}`}
                                            className="flex flex-col items-center mx-3"
                                        >


                                            <span className="text-xs text-slate-600 mb-2">

                                                ₹{amount.toLocaleString(
                                                    "en-IN"
                                                )}

                                            </span>



                                            <div
                                                className="w-14 bg-blue-500 rounded-t-md transition-all duration-300"
                                                style={{
                                                    height: `${height}px`
                                                }}
                                            />


                                        </div>

                                    );
                                }
                            )}

                        </div>

                    </div>




                    {/* Member Names */}

                    <div className="flex justify-around pl-20 mt-4 text-center text-xs text-slate-600 overflow-x-auto">


                        {sortedIncome.map(
                            (item, index) => (

                                <span
                                    key={`${item.name}-${index}`}
                                    className="w-20 break-words mx-3"
                                >

                                    {item.name}

                                </span>

                            )
                        )}


                    </div>


                </>

            )}

        </div>
    );
};


export default Income_members;
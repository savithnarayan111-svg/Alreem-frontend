import React, { forwardRef } from "react";


const ProfitLossReport = forwardRef(
    ({ report }, ref) => {

        if (!report) return null;


        return (

            <div
                ref={ref}
                style={{
                    width: "800px",
                    padding: "35px",
                    background: "#fff",
                    color: "#111",
                    fontFamily: "Arial, sans-serif"
                }}
            >


                {/* HEADER */}

                <div
                    style={{
                        textAlign: "center",
                        borderBottom: "2px solid #222",
                        paddingBottom: "15px",
                        marginBottom: "25px"
                    }}
                >

                    <h1
                        style={{
                            margin: 0,
                            fontSize: "28px"
                        }}
                    >
                        PROFIT & LOSS REPORT
                    </h1>


                    <p>
                        Period :
                        <b> {report.period}</b>
                    </p>


                    <p>
                        {report.start_date}
                        {" "}
                        -
                        {" "}
                        {report.end_date}
                    </p>


                </div>





                {/* KPI CARDS */}


                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "12px",
                        marginBottom: "25px"
                    }}
                >

                    <Card
                        title="Membership Income"
                        value={
                            report.kpis?.membership_income
                        }
                    />


                    <Card
                        title="Product Sales"
                        value={
                            report.kpis?.product_sales
                        }
                    />


                    <Card
                        title="Total Income"
                        value={
                            report.kpis?.total_income
                        }
                    />


                    <Card
                        title="Total Expense"
                        value={
                            report.kpis?.total_expense
                        }
                    />


                    <Card
                        title="Net Profit"
                        value={
                            report.kpis?.net_profit
                        }
                    />


                </div>






                {/* SALES CATEGORY */}


                <Section title="Sales Category">


                    {
                        Object.entries(
                            report.sales_category || {}
                        )
                            .map(
                                ([category, amount], index) => (

                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "8px",
                                            borderBottom:
                                                "1px solid #eee"
                                        }}
                                    >

                                        <span>
                                            {category}
                                        </span>


                                        <b>
                                            ₹ {amount}
                                        </b>


                                    </div>

                                )
                            )
                    }


                </Section>








                {/* SALES DETAILS */}


                <Section title="Sales Details">


                    <table style={table}>

                        <thead>

                            <tr>

                                <th style={th}>
                                    Product
                                </th>


                                <th style={th}>
                                    Member
                                </th>


                                <th style={th}>
                                    Qty
                                </th>


                                <th style={th}>
                                    Amount
                                </th>


                            </tr>

                        </thead>



                        <tbody>


                            {
                                report.sales?.map(
                                    (sale, index) => (

                                        <tr key={index}>


                                            <td style={td}>
                                                {sale.product}
                                            </td>


                                            <td style={td}>
                                                {sale.member}
                                            </td>


                                            <td style={td}>
                                                {sale.quantity}
                                            </td>


                                            <td style={td}>
                                                ₹ {sale.amount}
                                            </td>


                                        </tr>

                                    )
                                )
                            }


                        </tbody>


                    </table>


                </Section>









                {/* INCOME MEMBERS */}


                <Section title="Income Members">


                    {
                        report.income_members?.map(
                            (item, index) => (


                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        padding: "8px",
                                        borderBottom:
                                            "1px solid #eee"
                                    }}
                                >

                                    <span>
                                        {item.member}
                                    </span>


                                    <b>
                                        ₹ {item.amount}
                                    </b>


                                </div>


                            )
                        )
                    }


                </Section>









                {/* EXPENSE CATEGORY */}



                <Section title="Expense Category">


                    {
                        Object.entries(
                            report.expense_category || {}
                        )
                            .map(
                                ([category, amount], index) => (


                                    <div
                                        key={index}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            padding: "8px",
                                            borderBottom:
                                                "1px solid #eee"
                                        }}
                                    >

                                        <span>
                                            {category}
                                        </span>


                                        <b>
                                            ₹ {amount}
                                        </b>


                                    </div>


                                )
                            )
                    }


                </Section>









                {/* EXPENSE DETAILS */}



                <Section title="Expense Details">


                    <table style={table}>

                        <thead>

                            <tr>


                                <th style={th}>
                                    Category
                                </th>


                                <th style={th}>
                                    Description
                                </th>


                                <th style={th}>
                                    Amount
                                </th>


                            </tr>

                        </thead>



                        <tbody>


                            {
                                report.expenses?.map(
                                    (expense, index) => (

                                        <tr key={index}>


                                            <td style={td}>
                                                {expense.category}
                                            </td>


                                            <td style={td}>
                                                {
                                                    expense.description
                                                    ||
                                                    "-"
                                                }
                                            </td>


                                            <td style={td}>
                                                ₹ {expense.amount}
                                            </td>


                                        </tr>


                                    )
                                )
                            }


                        </tbody>


                    </table>


                </Section>









                {/* FOOTER */}



                <div
                    style={{
                        marginTop: "30px",
                        borderTop: "1px solid #ddd",
                        paddingTop: "15px",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#666"
                    }}
                >

                    Generated by Gym Management System

                </div>



            </div>

        );

    }
);






const Card = ({
    title,
    value
}) => (

    <div
        style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "10px",
            background: "#fafafa",
            textAlign: "center"
        }}
    >

        <p
            style={{
                margin: 0,
                fontSize: "12px",
                color: "#666"
            }}
        >
            {title}
        </p>


        <h3
            style={{
                marginTop: "8px"
            }}
        >
            ₹ {value || 0}
        </h3>


    </div>

);






const Section = ({
    title,
    children
}) => (

    <div
        style={{
            marginTop: "25px"
        }}
    >

        <h3
            style={{
                borderBottom: "2px solid #222",
                paddingBottom: "8px"
            }}
        >
            {title}
        </h3>


        {children}


    </div>

);







const table = {

    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"

};



const th = {

    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    background: "#f5f5f5"

};



const td = {

    border: "1px solid #ddd",
    padding: "8px"

};




export default ProfitLossReport;
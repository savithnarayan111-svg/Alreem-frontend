import { useEffect, useState } from "react";

import {
    getDashboardStats,
    getExpensecategory,
} from "../api/dashboard";


const useDashboard = (
    period = "daily",
    selectedDate = null
) => {


    const [stats, setStats] = useState({});

    const [expenseCategories, setExpenseCategories] = useState([]);

    const [loading, setLoading] = useState(false);



    const fetchDashboardStats = async (
        selectedPeriod = period,
        date = selectedDate
    ) => {

        try {

            const res = await getDashboardStats(
                selectedPeriod,
                date
            );

            setStats(
                res.data || {}
            );


        } catch (error) {

            console.error(
                "Dashboard Error:",
                error
            );

            setStats({});

        }

    };




    const fetchExpenseCategories = async (
        selectedPeriod = period,
        date = selectedDate
    ) => {

        try {

            const res = await getExpensecategory(
                selectedPeriod,
                date
            );


            setExpenseCategories(
                res.data?.expenses || []
            );


        } catch (error) {

            console.error(
                "Expense Category Error:",
                error
            );


            setExpenseCategories([]);

        }

    };





    useEffect(() => {


        const loadDashboard = async () => {

            try {

                setLoading(true);


                await Promise.all([

                    fetchDashboardStats(
                        period,
                        selectedDate
                    ),

                    fetchExpenseCategories(
                        period,
                        selectedDate
                    )

                ]);


            } finally {

                setLoading(false);

            }

        };


        loadDashboard();


    }, [
        period,
        selectedDate
    ]);





    return {

        stats,

        expenseCategories,

        loading,

        fetchDashboardStats,

        fetchExpenseCategories,

    };

};


export default useDashboard;
import { useEffect, useState } from "react";

import {
    getDashboardStats,
    getExpensecategory,
} from "../api/dashboard";

const useDashboard = (period = "daily") => {

    const [stats, setStats] = useState({});
    const [expenseCategories, setExpenseCategories] = useState([]);

    const [loading, setLoading] = useState(false);

    // ================================
    // DASHBOARD / KPI
    // ================================

    const fetchDashboardStats = async (
        selectedPeriod = period
    ) => {
        try {
            setLoading(true);

            const res = await getDashboardStats(
                selectedPeriod
            );

            setStats(res.data);

        } catch (error) {

            console.error(
                "Failed to fetch dashboard stats:",
                error
            );

            setStats({});

        } finally {
            setLoading(false);
        }
    };

    // ================================
    // EXPENSE CATEGORY
    // ================================

    const fetchExpenseCategories = async (
        selectedPeriod = period
    ) => {
        try {
            setLoading(true);

            const res = await getExpensecategory(
                selectedPeriod
            );

            setExpenseCategories(
                res.data.expenses || []
            );

        } catch (error) {

            console.error(
                "Failed to fetch expense categories:",
                error
            );

            setExpenseCategories([]);

        } finally {
            setLoading(false);
        }
    };

    // ================================
    // PERIOD CHANGE
    // ================================

    useEffect(() => {
        fetchDashboardStats(period);
        fetchExpenseCategories(period);
    }, [period]);

    return {
        stats,
        expenseCategories,
        loading,
        fetchDashboardStats,
        fetchExpenseCategories,
    };
};

export default useDashboard;
import { useEffect, useState } from "react";
import {
    getDashboardStats,
    getExpensecategory,
} from "../api/dashboard";

const useDashboard = () => {
    const [stats, setStats] = useState({});
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchDashboardStats = async () => {
        try {
            const res = await getDashboardStats();
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch dashboard stats:", error);
            setStats({});
        }
    };

    const fetchExpenseCategories = async () => {
        try {
            const res = await getExpensecategory();
            setExpenseCategories(res.data.expenses || []);
        } catch (error) {
            console.error("Failed to fetch expense categories:", error);
            setExpenseCategories([]);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            await Promise.all([
                fetchDashboardStats(),
                fetchExpenseCategories(),
            ]);

            setLoading(false);
        };

        fetchData();
    }, []);

    return {
        stats,
        expenseCategories,
        loading,
        fetchDashboardStats,
        fetchExpenseCategories,
    };
};

export default useDashboard;
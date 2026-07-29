import { useEffect, useState } from "react";
import { getSales, Saleslist } from "../api/getSales";

export const useSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSales = async () => {
        try {
            setLoading(true);

            const data = await getSales();

            setSales(data?.sales || []);
        } catch (error) {
            console.error("Error fetching sales:", error);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return {
        sales,
        loading,
        fetchSales,
    };
};

export const useTodaySales = () => {
    const [todaySales, setTodaySales] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTodaySales = async () => {
        try {
            setLoading(true);

            const res = await Saleslist();

            setTodaySales(res?.data?.sales || []);
        } catch (error) {
            console.error("Error fetching today's sales:", error);
            setTodaySales([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodaySales();
    }, []);

    return {
        todaySales,
        loading,
        fetchTodaySales,
    };
};
import { useEffect, useState } from "react";
import { getSales, Saleslist } from "../api/getSales";

export const useSales = () => {
    const [sales, setSales] = useState([]);

    const fetchSales = async () => {
        const data = await getSales();
        setSales(data.sales || []);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    return { sales };
};

export const useTodaySales = () => {
    const [todaySales, setTodaySales] = useState([]);

    const fetchTodaySales = async () => {
        const res = await Saleslist();
        setTodaySales(res.data.sales || []);
    };

    useEffect(() => {
        fetchTodaySales();
    }, []);

    return { todaySales };
};
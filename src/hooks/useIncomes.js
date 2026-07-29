import { useState, useEffect } from "react";
import {
    getIncome,
    addIncome,
    getMembersIncome,
} from "../api/income";

const useAdditionalIncomes = () => {
    const [incomes, setIncomes] = useState([]);
    const [memberIncome, setMemberIncome] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAdditionalIncomes = async () => {
        try {
            setLoading(true);

            const res = await getIncome();

            setIncomes(res.data);
        } catch (error) {
            console.error("Failed to fetch incomes:", error);
            setIncomes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchMemberIncome = async () => {
        try {
            const res = await getMembersIncome();

            setMemberIncome(res.data.income || []);
        } catch (error) {
            console.error("Failed to fetch member income:", error);
            setMemberIncome([]);
        }
    };

    const createIncome = async (data) => {
        try {
            const res = await addIncome(data);

            await fetchAdditionalIncomes();
            await fetchMemberIncome();

            return res.data;
        } catch (error) {
            console.error("Failed to add income:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchAdditionalIncomes();
        fetchMemberIncome();
    }, []);

    return {
        incomes,
        memberIncome,
        loading,
        fetchAdditionalIncomes,
        fetchMemberIncome,
        createIncome,
    };
};

export default useAdditionalIncomes;
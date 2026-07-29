import { useState } from "react";
import { getExpenses, addExpense } from "../api/expenses";

const useAdditionalExpenses = () => {

    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);


    const fetchAdditionalExpenses = async () => {

        try {

            setLoading(true);

            const res = await getExpenses();

            setExpenses(res.data);

        } catch (error) {

            console.error(
                "Failed to fetch expenses:",
                error
            );

            setExpenses([]);

        } finally {

            setLoading(false);
        }
    };


    const createExpense = async (data) => {

        try {

            const res = await addExpense(data);

            // refresh list after adding
            await fetchAdditionalExpenses();

            return res.data;

        } catch (error) {

            console.error(
                "Failed to add expense:",
                error
            );

            throw error;
        }
    };


    return {
        expenses,
        loading,
        fetchAdditionalExpenses,
        createExpense,
    };
};

export default useAdditionalExpenses;
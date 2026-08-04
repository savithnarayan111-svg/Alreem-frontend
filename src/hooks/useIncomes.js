import { useState, useEffect } from "react";

import {
    getIncome,
    addIncome,
    getMembersIncome,
} from "../api/income";


const useAdditionalIncomes = (
    period = "daily",
    selectedDate = null
) => {

    const [incomes, setIncomes] = useState([]);

    const [memberIncome, setMemberIncome] = useState([]);

    const [loading, setLoading] = useState(false);



    // =========================================
    // ALL INCOMES
    // =========================================

    const fetchAdditionalIncomes = async () => {

        try {

            setLoading(true);

            const res = await getIncome();

            setIncomes(
                res.data || []
            );


        } catch (error) {

            console.error(
                "Failed to fetch incomes:",
                error
            );

            setIncomes([]);

        } finally {

            setLoading(false);

        }

    };




    // =========================================
    // MEMBER INCOME
    // =========================================

    const fetchMemberIncome = async (
        selectedPeriod = period,
        date = selectedDate
    ) => {

        try {

            setLoading(true);


            const res = await getMembersIncome(
                selectedPeriod,
                date
            );


            setMemberIncome(
                res.data?.income || []
            );


        } catch (error) {

            console.error(
                "Failed to fetch member income:",
                error
            );


            setMemberIncome([]);

        } finally {

            setLoading(false);

        }

    };




    // =========================================
    // CREATE INCOME
    // =========================================

    const createIncome = async (data) => {

        try {

            const res = await addIncome(data);


            await fetchAdditionalIncomes();


            await fetchMemberIncome(
                period,
                selectedDate
            );


            return res.data;


        } catch (error) {

            console.error(
                "Failed to add income:",
                error
            );

            throw error;

        }

    };




    // =========================================
    // PERIOD / DATE CHANGE
    // =========================================

    useEffect(() => {

        fetchAdditionalIncomes();

        fetchMemberIncome(
            period,
            selectedDate
        );


    }, [
        period,
        selectedDate
    ]);




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
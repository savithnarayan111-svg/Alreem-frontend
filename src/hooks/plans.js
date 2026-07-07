import { useEffect, useState } from "react";
import {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
} from "../api/plans";

export default function usePlans() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);

    // FETCH
    const fetchPlans = async () => {
        setLoading(true);
        try {
            const res = await getPlans();
            setPlans(res.data);
        } catch (err) {
            console.error("Fetch plans error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // CREATE
    const addPlan = async (data) => {
        await createPlan(data);
        await fetchPlans();
    };

    // UPDATE
    const editPlan = async (id, data) => {
        await updatePlan(id, data);
        await fetchPlans();
    };

    // DELETE
    const removePlan = async (id) => {
        await deletePlan(id);
        setPlans((prev) => prev.filter((p) => p.id !== id));
    };

    return {
        plans,
        loading,
        addPlan,
        editPlan,
        removePlan,
    };
}
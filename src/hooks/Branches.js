import { useEffect, useState } from "react";
import {
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch,
} from "../api/branches";

export default function useBranches() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);

    // FETCH
    const fetchBranches = async () => {
        setLoading(true);
        try {
            const res = await getBranches();
            setBranches(res.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    // CREATE
    const addBranch = async (data) => {
        await createBranch(data);
        await fetchBranches();
    };

    // UPDATE (FIXED)
    const editBranch = async (id, data) => {
        await updateBranch(id, data);
        await fetchBranches();
    };

    // DELETE
    const removeBranch = async (id) => {
        await deleteBranch(id);
        setBranches((prev) => prev.filter((b) => b.id !== id));
    };

    return {
        branches,
        loading,
        addBranch,
        editBranch,
        removeBranch,
    };
}
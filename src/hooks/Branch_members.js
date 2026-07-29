import { useState } from "react";
import { getBranchMembers } from "../api/branch_members"

export default function useBranchMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchBranchMembers = async (branchId) => {
        try {
            setLoading(true);

            const res = await getBranchMembers(branchId);

            setMembers(res.data.customers || []);
        } catch (error) {
            console.error("Failed to fetch branch members:", error);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    return {
        members,
        loading,
        fetchBranchMembers,
    };
}
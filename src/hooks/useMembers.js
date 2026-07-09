import { useEffect, useState } from "react";
import {
    getMembers,
    createMember,
    updateMember,
    deleteMember,
    memberpayment,
    renewMember
} from "../api/members";

export default function useMembers() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await getMembers();
            setMembers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const addMember = async (data) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        await createMember(formData);
        await fetchMembers();
    };

    const editMember = async (id, data) => {
        await updateMember(id, data);
        await fetchMembers();
    };

    const removeMember = async (id) => {
        await deleteMember(id);
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    const payMember = async (id, data) => {
        await memberpayment(id, data);
        await fetchMembers();
    };

    const renewMemberPlan = async (id, data) => {
        await renewMember(id, data);
        await fetchMembers();
    };

    return {
        members,
        loading,
        fetchMembers,
        addMember,
        editMember,
        removeMember,
        payMember,
        renewMemberPlan,
    };
}
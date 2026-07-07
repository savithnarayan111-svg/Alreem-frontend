import { useEffect, useState } from "react";
import {
    getStaffs,
    getStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    staffPayment,
} from "../api/staffs";

// GET ALL STAFFS
export const useStaffs = () => {
    const [staffs, setStaffs] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchStaffs = () => {
        setLoading(true);
        getStaffs()
            .then((res) => setStaffs(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    return { staffs, loading, fetchStaffs };
};

// GET SINGLE STAFF
export const useStaff = (id) => {
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        getStaff(id)
            .then((res) => setStaff(res.data))
            .finally(() => setLoading(false));
    }, [id]);

    return { staff, loading };
};

// CREATE STAFF
export const useCreateStaff = () => {
    const [loading, setLoading] = useState(false);

    const create = async (data) => {
        setLoading(true);
        try {
            const res = await createStaff(data);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    return { create, loading };
};

// UPDATE 

export const useUpdateStaff = () => {
    const [loading, setLoading] = useState(false);

    const update = async (id, data) => {
        setLoading(true);

        try {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                formData.append(key, data[key] || "");
            });

            const res = await updateStaff(id, formData);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading };
};

// DELETE STAFF
export const useDeleteStaff = () => {
    const [loading, setLoading] = useState(false);

    const remove = async (id) => {
        setLoading(true);
        try {
            const res = await deleteStaff(id);
            return res.data;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading };
};

export const useStaffPayment = () => {
    const addPayment = async (id, data) => {
        try {
            const res = await staffPayment(id, data);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    return { addPayment };
};
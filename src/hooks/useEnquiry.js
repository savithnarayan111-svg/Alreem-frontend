import { useEffect, useState } from "react";
import {
    getEnquiry,
    createEnquiry,
    deleteEnquiry,
} from "../api/enquiry";

export default function useEnquiry() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchEnquiries = async () => {
        setLoading(true);
        try {
            const res = await getEnquiry();
            setEnquiries(res.data);
        } catch (err) {
            console.error("Fetch enquiries error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const addEnquiries = async (data) => {
        try {
            await createEnquiry(data);
            await fetchEnquiries();
        } catch (err) {
            console.error("Add enquiry error:", err);
            throw err;
        }
    };

    const removeEnquiries = async (id) => {
        try {
            await deleteEnquiry(id);

            setEnquiries((prev) =>
                prev.filter((enquiry) => enquiry.id !== id)
            );
        } catch (err) {
            console.error("Delete enquiry error:", err);
            throw err; // <-- Add this
        }
    };

    return {
        enquiries,
        loading,
        addEnquiries,
        removeEnquiries,
        fetchEnquiries,
    };
}
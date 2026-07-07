import { useState } from "react";
import {
    loginAdmin as loginAdminApi,
    getAdminProfile,
    changePassword,
} from "../api/Login";

const useAdminSettings = () => {
    const [admin, setAdmin] = useState({
        full_name: "",
        email: "",
        username: "",
    });

    const [loading, setLoading] = useState(false);

    const fetchAdminProfile = async () => {
        try {
            setLoading(true);
            const res = await getAdminProfile();
            setAdmin(res.data);
            return res.data;
        } catch (error) {
            console.error("Failed to load admin profile:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateAdminPassword = async (passwordData) => {
        try {
            setLoading(true);

            const res = await changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password,
            });

            return res.data;
        } catch (error) {
            console.error("Failed to update password:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const adminLogin = async (loginData) => {
        try {
            setLoading(true);

            const res = await loginAdminApi({
                username: loginData.username,
                password: loginData.password,
            });

            return res.data;
        } catch (error) {
            console.error("Admin login failed:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        admin,
        loading,
        fetchAdminProfile,
        updateAdminPassword,
        adminLogin,
    };
};

export default useAdminSettings;
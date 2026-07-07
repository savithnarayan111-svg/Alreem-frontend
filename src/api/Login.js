import api from "./api";

export const loginAdmin = async (data) => {
    return await api.post("admin/api/admin_login/", data);
};

export const changePassword = async (data) => {
    return await api.post("admin/api/change_password/", data);
};

export const getAdminProfile = async () => {
    return await api.get("admin/api/admin_profile_view/");
};
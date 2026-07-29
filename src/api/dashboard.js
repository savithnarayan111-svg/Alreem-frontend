import api from "./api";

export const getDashboardStats = () => {
    return api.get("admin/api/dashboard/");
};

export const getExpensecategory = () => {
    return api.get("admin/api/expense_by_category/");
};
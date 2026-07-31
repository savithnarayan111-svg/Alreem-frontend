import api from "./api";

export const getDashboardStats = (period = "daily") => {
    return api.get(
        `admin/api/dashboard/?period=${period}`
    );
};

export const getExpensecategory = (period = "daily") => {
    return api.get(
        `admin/api/expense_by_category/?period=${period}`
    );
};
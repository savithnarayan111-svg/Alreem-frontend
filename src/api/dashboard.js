import api from "./api";


export const getDashboardStats = (
    period = "daily",
    selectedDate = null
) => {

    return api.get(
        "admin/api/dashboard/",
        {
            params: {
                period,
                date: selectedDate,
            },
        }
    );

};



export const getExpensecategory = (
    period = "daily",
    selectedDate = null
) => {

    return api.get(
        "admin/api/expense_by_category/",
        {
            params: {
                period,
                date: selectedDate,
            },
        }
    );

};
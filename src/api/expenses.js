import api from "./api";

export const getExpenses = () => {
    return api.get("admin/api/all_expenses/");
};


export const addExpense = (data) => {
    return api.post(
        "admin/api/add_expense/",
        data
    );
};
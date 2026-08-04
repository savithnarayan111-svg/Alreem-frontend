import api from "./api";


export const getIncome = () => {
    return api.get("admin/api/all_incomes/");
};


export const addIncome = (data) => {
    return api.post(
        "admin/api/add_income/",
        data
    );
};


// export const getMembersIncome = () => {
//     return api.get("admin/api/income_by_members/");
// };

export const getMembersIncome = (
    period = "daily",
    selectedDate = null
) => {

    let url = `admin/api/income_by_members/?period=${period}`;

    if (selectedDate) {
        url += `&date=${selectedDate}`;
    }

    return api.get(url);
};

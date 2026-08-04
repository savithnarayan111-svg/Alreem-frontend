import api from "./api";


export const getProfitLossReport = (
    period,
    selectedDate,
    fromDate,
    toDate
) => {

    return api.get(
        "admin/api/profit_loss_report/",
        {
            params: {
                period,
                date: selectedDate,
                from_date: fromDate,
                to_date: toDate,
            }
        }
    );

};
import api from "./api";

export const getSales = async (
    period = "daily",
    selectedDate = null
) => {

    const res = await api.get(
        "admin/api/sales_list/",
        {
            params: {
                period,
                date: selectedDate,
            },
        }
    );

    return res.data;
};

export const Saleslist = () => api.get("admin/api/today_sales/");

export const sellProduct = (data) =>
    api.post("admin/api/sell_product/", data);

export const validateMember = (memberId) =>
    api.get(`admin/api/validate_member/${memberId}/`);


export const One_sale = (saleId) =>
    api.get(`admin/api/one_sale/${saleId}/`);
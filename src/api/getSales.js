import api from "./api";

export const getSales = async (period = "daily") => {
    const res = await api.get(`admin/api/sales_list/?period=${period}`);
    return res.data;
};

export const sellProduct = (data) =>
    api.post("admin/api/sell_product/", data);

export const validateMember = (memberId) =>
    api.get(`admin/api/validate_member/${memberId}/`);

export const Saleslist = () => api.get("admin/api/today_sales/");

export const One_sale = (saleId) =>
    api.get(`admin/api/one_sale/${saleId}/`);
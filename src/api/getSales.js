import api from "./api";

export const getSales = async () => {
    const response = await api.get("admin/api/sales_list/");
    return response.data.results || response.data;
};

export const sellProduct = (data) =>
    api.post("admin/api/sell_product/", data);


export const validateMember = (memberId) =>
    api.get(`admin/api/validate_member/${memberId}/`);

export const Saleslist = (data) =>
    api.get("admin/api/today_sales/", data);

export const One_sale = (saleId) =>
    api.get(`admin/api/one_sale/${saleId}/`); 
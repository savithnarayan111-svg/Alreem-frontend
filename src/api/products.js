import api from "./api";

export const getProducts = () =>
    api.get("admin/api/products/");

export const createProduct = (formData) =>
    api.post("admin/api/products/create/", formData);

export const getSingleProduct = (id) =>
    api.get(`admin/api/products/${id}/`);

export const updateProduct = (id, formData) =>
    api.post(`admin/api/products/update/${id}/`, formData);

export const deleteProduct = (id) =>
    api.delete(`admin/api/products/delete/${id}/`);

export const sellProduct = (data) =>
    api.post("admin/api/sell_product/", data);
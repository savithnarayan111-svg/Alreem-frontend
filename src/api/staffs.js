import api from "./api";

// GET all staffs
export const getStaffs = () => {
    return api.get("admin/api/staff/get/");
};

// GET single staff
export const getStaff = (id) => {
    return api.get(`admin/api/staff/get/${id}/`);
};

// CREATE staff
export const createStaff = (data) => {
    return api.post("admin/api/staff/create/", data);
};

// UPDATE staff
export const updateStaff = (id, data) => {
    return api.post(`admin/api/staff/update/${id}/`, data);
};

// DELETE staff
export const deleteStaff = (id) => {
    return api.delete(`admin/api/staff/delete/${id}/`);
};


export const staffPayment = (id, data) => {
    return api.post(`admin/api/staff/${id}/payments/add/`, data);
};
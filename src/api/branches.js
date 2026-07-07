import api from "./api";

// GET
export const getBranches = () => {
    return api.get("admin/api/branches/");
};

// CREATE
export const createBranch = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("manager_name", data.manager_name);
    formData.append("phone", data.phone);
    formData.append("capacity", data.capacity);

    return api.post("admin/api/branches/create/", formData);
};

// UPDATE (FIXED)
export const updateBranch = (id, data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("manager_name", data.manager_name);
    formData.append("phone", data.phone);
    formData.append("capacity", data.capacity);

    return api.post(`admin/api/branches/${id}/update/`, formData);
};

// DELETE
export const deleteBranch = (id) => {
    return api.delete(`admin/api/branches/${id}/delete/`);
};
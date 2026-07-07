import api from "./api";

// GET ALL PLANS
export const getPlans = () => {
    return api.get("admin/api/plans/");
};

// CREATE PLAN
export const createPlan = (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("description", data.description);

    return api.post("admin/api/plans/create/", formData);
};

// UPDATE PLAN
export const updatePlan = (id, data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("duration", data.duration);
    formData.append("description", data.description);

    return api.post(`admin/api/plans/${id}/update/`, formData);
};

// DELETE PLAN
export const deletePlan = (id) => {
    return api.delete(`admin/api/plans/${id}/delete/`);
};
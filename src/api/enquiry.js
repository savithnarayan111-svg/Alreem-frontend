import api from "./api";

export const getEnquiry = () => {
    return api.get("admin/api/enquiries/");
};

export const createEnquiry = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("plan", data.plan);
    formData.append("date", data.date);


    return api.post("admin/api/add_enquiries/", formData);
};

export const deleteEnquiry = (id) => {
    return api.delete(`admin/api/enquiries/${id}/delete/`);
};
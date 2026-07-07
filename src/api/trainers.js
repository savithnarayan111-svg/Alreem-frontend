import api from "./api";

// GET trainers
export const getTrainers = () => {
    return api.get("admin/api/trainers/");
};

// DELETE trainer
export const deleteTrainer = (id) => {
    return api.delete(`admin/api/trainers/${id}/delete/`);
};

// UPDATE trainer
export const updateTrainer = (id, data) => {
    return api.post(`admin/api/trainers/${id}/update/`, data);
};
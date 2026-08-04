import api from "./api";


// GET ALL MEMBERS
export const getMembers = () => {
    return api.get("admin/api/members/");
};


// CREATE MEMBER
export const createMember = (formData) =>
    api.post(
        "admin/api/members/create/",
        formData
    );


// UPDATE MEMBER
export const updateMember = (id, data) => {

    const formData = new FormData();

    Object.entries(data).forEach(([k, v]) => {

        if (v !== null && v !== undefined) {

            formData.append(k, v);

        }

    });


    return api.post(
        `admin/api/members/${id}/update/`,
        formData
    );

};


// DELETE MEMBER
export const deleteMember = (id) => {

    return api.delete(
        `admin/api/members/${id}/delete/`
    );

};


// MEMBER PAYMENT
export const memberpayment = (id, data) => {

    return api.post(
        `admin/api/member/${id}/payments/add/`,
        data
    );

};


// RENEW MEMBER
export const renewMember = (id, data) => {

    const formData = new FormData();


    Object.entries(data).forEach(([k, v]) => {

        if (v !== null && v !== undefined) {

            formData.append(k, v);

        }

    });


    return api.post(
        `admin/api/members/${id}/renew/`,
        formData
    );

};
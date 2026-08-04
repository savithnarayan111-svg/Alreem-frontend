import api from "./api";

export const pauseMember = (
    memberId,
    freezeDate
) => {

    return api.post(
        `admin/api/members/pause/${memberId}/`,
        {
            freeze_date: freezeDate,
        }
    );
};


export const resumeMember = (
    memberId,
    resumeDate
) => {

    return api.post(`admin/api/members/resume/${memberId}/`,
        {
            resume_date: resumeDate,
        }
    );
};
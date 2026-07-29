import api from "./api";

export const getBranchMembers = (branchId) => {
    return api.get(`admin/api/get_branch_members/${branchId}/`);
};
import { useState } from "react";
import {
    pauseMember,
    resumeMember,
} from "../api/memberPause"

export const useMemberPause = () => {
    const [loading, setLoading] = useState(false);

    const handlePause = async (
        memberId,
        freezeDate
    ) => {
        try {
            setLoading(true);

            const res = await pauseMember(
                memberId,
                freezeDate
            );

            return res.data;
        } finally {
            setLoading(false);
        }
    };

    const handleResume = async (
        memberId,
        resumeDate
    ) => {
        try {
            setLoading(true);

            const res = await resumeMember(
                memberId,
                resumeDate
            );

            return res.data;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        handlePause,
        handleResume,
    };
};
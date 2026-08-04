import React from "react";
import { CirclePlay } from "lucide-react";

const Pausememberview = ({ memberData }) => {
    return (
        <>
            {memberData?.is_paused && (
                <div className="relative overflow-hidden bg-blue-900 p-5 rounded-lg">

                    <CirclePlay
                        size={120}
                        className="absolute right-2 top-2 text-white/10 blur-[2px]"
                    />

                    <div className="relative z-10">

                        <div className="flex items-center gap-2 mb-3">
                            <b className="text-white">
                                LEAVE STATUS
                            </b>
                        </div>

                        <div className="flex justify-between gap-7 text-white mb-2">
                            <p>Paused On:</p>

                            <b>
                                {memberData?.pause_start_date || "-"}
                            </b>
                        </div>

                        <div className="flex justify-between gap-7 text-white mb-2">
                            <p>Used:</p>

                            <b>
                                {memberData?.pause_days_used || 0} Days
                            </b>
                        </div>

                        <div className="flex justify-between gap-7 text-white mb-2">
                            <p>Remaining:</p>

                            <b>
                                {memberData?.pause_days_remaining || 0} Days
                            </b>
                        </div>

                        <div className="flex justify-between gap-7 text-white">
                            <p>Count:</p>

                            <b>
                                {memberData?.pause_count || 0}
                            </b>
                        </div>

                    </div>

                </div>
            )}
        </>
    );
};

export default Pausememberview;
import React, { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useMemberPause } from "../../hooks/usememberpause"

const ResumeMember = ({ member, onClose, onSuccess }) => {
    const {
        handleResume,
        loading,
    } = useMemberPause();

    const [resumeDate, setResumeDate] = useState("");
    const [alert, setAlert] = useState("");

    const handleResumeClick = async () => {
        if (!resumeDate) {
            setAlert("Please select a resume date");

            setTimeout(() => setAlert(""), 3000);
            return;
        }

        try {
            const data = await handleResume(
                member.id,
                resumeDate
            );

            console.log("API Response:", data);

            onSuccess?.(data);

            setAlert("Member resumed successfully");

            setTimeout(() => {
                setAlert("");
                onClose();
            }, 1500);
        } catch (error) {
            setAlert("Failed to resume member");

            setTimeout(() => setAlert(""), 3000);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            {alert && (
                <div className="fixed right-5 z-50">
                    <div className="bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg">
                        {alert}
                    </div>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-15 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <TriangleAlert size={24} className="text-blue-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Resume Membership
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Select the date this member returned to the gym. Expiry will be extended accordingly.
                        </p>
                    </div>
                </div>

                <div className="mt-4 mb-3 p-3 bg-slate-50 rounded-lg border">
                    <p className="text-sm text-slate-600">
                        Paused from:
                        <span className="font-semibold text-slate-900 ml-2">
                            {member?.pause_start_date || "Not available"}
                        </span>
                    </p>
                </div>

                <div className="mt-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        RETURNED ON
                    </label>

                    <input
                        type="date"
                        value={resumeDate}
                        onChange={(e) => setResumeDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2" />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600">
                        Cancel
                    </button>
                    <button
                        onClick={handleResumeClick}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading ? "Resuming..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResumeMember;
import React, { useState } from "react";
import { TriangleAlert } from "lucide-react"
import { useMemberPause } from "../../hooks/usememberpause"

const PauseMember = ({ member, onClose, onSuccess }) => {

    const {
        handlePause,
        loading
    } = useMemberPause();

    const [freezeDate, setFreezeDate] = useState("");
    const [alert, setAlert] = useState("");
    const handlePauseClick = async () => {

        if (!freezeDate) {

            setAlert("Please select a freeze date");

            setTimeout(() => {
                setAlert("");
            }, 3000);

            return;
        }


        try {

            const data = await handlePause(
                member.id,
                freezeDate
            );


            onSuccess?.(data);


            setAlert(
                "Member paused successfully"
            );


            setTimeout(() => {

                setAlert("");

                onClose();

            }, 1500);


        } catch (error) {

            setAlert(
                "Failed to pause member"
            );


            setTimeout(() => {

                setAlert("");

            }, 3000);

        }

    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            {alert && (
                <div className="fixed right-5 z-50 ">
                    <div className="bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg">
                        {alert}
                    </div>
                </div>
            )}
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <TriangleAlert size={24} className="text-yellow-600" />
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Pause Membership
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Select the date this membership should be frozen.
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        FREEZE FROM
                    </label>

                    <input
                        type="date"
                        value={freezeDate}
                        onChange={(e) => setFreezeDate(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600">
                        Cancel
                    </button>

                    <button
                        onClick={handlePauseClick}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                        {loading ? "Pausing..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PauseMember;
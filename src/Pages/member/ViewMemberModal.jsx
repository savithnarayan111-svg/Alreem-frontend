import React from "react";
import { X, Pause, CirclePlay } from "lucide-react";
import { useState } from "react";
import PauseMember from "./PauseMember";
import ResumeMember from "./ResumeMember";
import Pausememberview from "./Pausememberview";

const ViewMemberModal = ({ member, onClose }) => {
    const [memberData, setMemberData] = useState(member);
    const [showPauseModal, setShowPauseModal] = useState(false);
    const [showResumeModal, setShowResumeModal] = useState(false);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-700";
            case "Blocked":
                return "bg-red-100 text-red-700";
            case "Expired":
                return "bg-yellow-100 text-yellow-700";
            case "Paused":
                return "bg-blue-100 text-blue-700";
            default:
                return "bg-slate-100 text-slate-700";
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            {showPauseModal && (
                <PauseMember
                    member={memberData}
                    onClose={() => setShowPauseModal(false)}
                    onSuccess={(data) => {

                        setMemberData(prev => ({
                            ...prev,

                            status: data.status,

                            is_paused: data.is_paused,

                            pause_start_date: data.paused_date,

                            pause_days_used:
                                data.used_days_this_month,

                            pause_days_remaining:
                                data.remaining_days_this_month,

                            pause_count:
                                data.pause_count_this_month,

                        }));

                        setShowPauseModal(false);
                    }}
                />
            )}

            {showResumeModal && (
                <ResumeMember
                    member={memberData}
                    onClose={() => setShowResumeModal(false)}
                    onSuccess={(newExpiryDate) => {
                        setMemberData(prev => ({
                            ...prev,

                            status: "Active",

                            is_paused: false,

                            pause_start_date: null,

                            pause_days_used: 0,

                            pause_days_remaining: 15,

                            pause_count: prev.pause_count,

                            expiry_date: newExpiryDate,

                        }));

                        setShowResumeModal(false);
                    }}
                />
            )}
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Member Profile
                        </h2>
                        <p className="text-sm text-slate-500">
                            View member information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Profile */}
                        <div className="w-full lg:w-64 flex flex-col items-center">
                            <div className="w-44 h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                {member?.photo ? (
                                    <img
                                        src={member.photo}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-400">
                                        {member?.name?.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <h3 className="mt-4 text-lg font-bold">
                                {member?.name}
                            </h3>

                            <span
                                className={`mt-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(memberData?.status)}`}>
                                {memberData?.status}
                            </span>

                            <button
                                onClick={() =>
                                    memberData?.is_paused
                                        ? setShowResumeModal(true)
                                        : setShowPauseModal(true)
                                }
                                className={`flex items-center gap-2 rounded-full my-5 px-5 py-1 text-white ${memberData?.is_paused
                                    ? "bg-green-600"
                                    : "bg-yellow-500"
                                    }`}
                            >
                                {memberData?.is_paused ? (
                                    <CirclePlay size={16} />
                                ) : (
                                    <Pause size={16} />
                                )}

                                {memberData?.is_paused
                                    ? "Resume Membership"
                                    : "Pause Membership"}
                            </button>

                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-8">

                            {/* Personal Details */}
                            <section>
                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                                    Personal Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <DetailCard label="Member ID" value={member?.id} />
                                    <DetailCard label="Phone" value={member?.phone} />
                                    <DetailCard label="Email" value={member?.email} />
                                    <DetailCard label="Age" value={member?.age} />
                                    <DetailCard label="Gender" value={member?.gender} />
                                    <DetailCard label="Blood Group" value={member?.blood_group} />
                                    <DetailCard label="Location" value={member?.location} />
                                    <DetailCard label="Aadhaar" value={member?.adhaar_number} />

                                </div>
                            </section>

                            {/* Body Stats */}
                            <section>
                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                                    Body Statistics
                                </h3>

                                <div className="grid grid-cols-3 gap-4">
                                    <DetailCard
                                        label="Height"
                                        value={`${member?.height} cm`}
                                    />
                                    <DetailCard
                                        label="Weight"
                                        value={`${member?.weight} kg`}
                                    />
                                    <DetailCard
                                        label="BMI"
                                        value={member?.bmi || "-"}
                                    />
                                </div>
                            </section>

                            <section>
                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                                    Membership Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4">

                                    <DetailCard
                                        label="Join Date"
                                        value={memberData?.join_date}
                                    />

                                    <DetailCard
                                        label="Expiry Date"
                                        value={memberData?.expiry_date}
                                    />

                                </div>


                                {/* Pause Status */}
                                <div className="mt-5">

                                    <Pausememberview
                                        memberData={memberData}
                                    />

                                </div>

                            </section>

                            {/* Payments */}
                            <section>
                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                                    Payment Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <DetailCard
                                        label="Paid Amount"
                                        value={`₹${member?.paid_amount}`}
                                    />

                                    <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                                        <p className="text-xs font-semibold text-slate-500 uppercase">
                                            Due Amount
                                        </p>
                                        <h4 className="text-lg font-bold text-red-600 mt-1">
                                            ₹{member?.due_amount}
                                        </h4>
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
};

const DetailCard = ({ label, value }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-500 uppercase">
            {label}
        </p>
        <h4 className="text-sm font-bold text-slate-900 mt-1">
            {value || "-"}
        </h4>
    </div>
);

export default ViewMemberModal;
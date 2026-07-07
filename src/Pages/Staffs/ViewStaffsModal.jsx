import React from "react";
import { X } from "lucide-react";

const ViewStaffsModal = ({ staff, onClose }) => {

    if (!staff) return null; // ✅ safety fix

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">
                            Staff Profile
                        </h2>
                        <p className="text-sm text-slate-500">
                            View staff information
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

                                {staff?.photo ? (
                                    <img
                                        src={staff.photo}
                                        alt={staff.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-400">
                                        {staff?.name?.charAt(0)}
                                    </div>
                                )}

                            </div>

                            <h3 className="mt-4 text-lg font-bold">
                                {staff?.name}
                            </h3>

                            <span className={`mt-2 px-3 py-1 rounded-full text-xs font-bold
                                ${staff?.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                            >
                                {staff?.status}
                            </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-8">

                            {/* Personal Details */}
                            <section>
                                <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                                    Personal Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <DetailCard label="Staff ID" value={staff?.id} />
                                    <DetailCard label="Name" value={staff?.name} />
                                    <DetailCard label="Phone" value={staff?.phone} />
                                    <DetailCard label="Role" value={staff?.role} />
                                    <DetailCard label="Join Date" value={staff?.joining_date} />
                                    <DetailCard label="Salary" value={staff?.salary} />


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

export default ViewStaffsModal;
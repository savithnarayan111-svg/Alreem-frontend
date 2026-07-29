import React from "react";

export default function Branch_members({
    isOpen,
    onClose,
    branch,
    members,
}) {
    if (!isOpen || !branch) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-6">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">
                        {branch.name} Members
                    </h2>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-bold rounded-lg"
                    >
                        X
                    </button>
                </div>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">Name</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">Phone</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">Plan</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">Email</th>
                            </tr>
                        </thead>

                        <tbody>
                            {members && members.length > 0 ? (
                                members.map((member) => (
                                    <tr key={member.id} className="border-t border-slate-100">
                                        <td className="px-6 py-4">{member.name}</td>
                                        <td className="px-6 py-4">{member.phone}</td>
                                        <td className="px-6 py-4">{member.plan}</td>
                                        <td className="px-6 py-4">{member.email}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center p-6 text-slate-500">
                                        No members found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div >
    );
}
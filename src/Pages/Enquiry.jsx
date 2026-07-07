import React from "react";
import useEnquiry from "../hooks/useEnquiry";
import { Plus, Trash2 } from "lucide-react";
import AlertMessage from "../Components/AlertMessage";
import ConfirmActionModal from "../Components/ConfirmActionModal";

const Enquiry = () => {
    const { enquiries, loading, removeEnquiries, addEnquiries } = useEnquiry();

    const [showAddCard, setShowAddCard] = React.useState(false);
    const [formData, setFormData] = React.useState({
        name: "",
        phone: "",
        plan: "",
        date: "",
    });

    const [alertState, setAlertState] = React.useState({
        show: false,
        message: "",
        type: "success",
    });

    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);

    const [confirmConfig, setConfirmConfig] = React.useState({
        title: "",
        message: "",
        confirmText: "Confirm",
        type: "default",
        successMessage: "",
        action: null,
    });

    const openConfirmModal = ({
        title,
        message,
        confirmText = "Confirm",
        type = "default",
        successMessage = "Operation completed successfully",
        action,
    }) => {
        setConfirmConfig({
            title,
            message,
            confirmText,
            type,
            successMessage,
            action,
        });
        setConfirmOpen(true);
    };

    const handleConfirmAction = async () => {
        if (!confirmConfig.action) return;

        try {
            setConfirmLoading(true);
            await confirmConfig.action();

            setAlertState({
                show: true,
                message: confirmConfig.successMessage,
                type: "success",
            });

            setConfirmOpen(false);
        } catch (error) {
            console.error(error);
            setAlertState({
                show: true,
                message:
                    error?.response?.data?.error ||
                    error?.response?.data?.message ||
                    "Operation failed",
                type: "error",
            });
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleDelete = (enquiry) => {
        openConfirmModal({
            title: "Delete Enquiry",
            message: `Are you sure you want to delete ${enquiry.name}?`,
            confirmText: "Delete",
            type: "delete",
            successMessage: "Enquiry deleted successfully",
            action: async () => {
                await removeEnquiries(enquiry.id);
            },
        });
    };

    const handleAddEnquiry = (formData) => {
        openConfirmModal({
            title: "Add Enquiry",
            message: `Are you sure you want to add ${formData.name || "this enquiry"}?`,
            confirmText: "Save",
            type: "add",
            successMessage: "Enquiry added successfully",
            action: async () => {
                await addEnquiries(formData);

                setShowAddCard(false);
                setFormData({
                    name: "",
                    phone: "",
                    plan: "",
                    date: "",
                });
            },
        });
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Enquiries</h1>

                <button
                    onClick={() => setShowAddCard(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                    <Plus size={18} />
                    Add Enquiry
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-slate-100 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">NAME</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">PHONE</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">PLAN</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">DATE</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : enquiries.length > 0 ? (
                            enquiries.map((enquiry) => (
                                <tr key={enquiry.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4">{enquiry.name}</td>
                                    <td className="px-6 py-4">{enquiry.phone}</td>
                                    <td className="px-6 py-4">{enquiry.plan}</td>
                                    <td className="px-6 py-4">{enquiry.date}</td>

                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => handleDelete(enquiry)}
                                            className="p-2 rounded-md hover:bg-red-100"
                                        >
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-slate-500">
                                    No enquiries found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddCard && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-8">
                        <h2 className="text-lg font-semibold mb-5">Add Enquiry</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({ ...formData, name: e.target.value })
                                    }
                                    className="w-full border border-slate-200 shadow-lg rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Phone</label>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value.replace(/\D/g, ""),
                                        })
                                    }
                                    className="w-full border border-slate-200 shadow-lg rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {formData.phone.length > 0 && formData.phone.length < 10 && (
                                    <p className="text-blue-500 text-sm mt-1">
                                        Phone number must be 10 digits.
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Plan</label>
                                <select
                                    value={formData.plan}
                                    onChange={(e) =>
                                        setFormData({ ...formData, plan: e.target.value })
                                    }
                                    className="w-full border border-slate-200 shadow-lg rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select Plan</option>
                                    <option value="Silver">Silver</option>
                                    <option value="Premium">Premium</option>
                                    <option value="Gold">Gold</option>
                                    <option value="Platinum">Platinum</option>
                                    <option value="Diamond">Diamond</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) =>
                                        setFormData({ ...formData, date: e.target.value })
                                    }
                                    className="w-full border border-slate-200 shadow-lg rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowAddCard(false);
                                    setFormData({
                                        name: "",
                                        phone: "",
                                        plan: "",
                                        date: "",
                                    });
                                }}
                                className="px-5 py-2 rounded-lg border"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleAddEnquiry(formData)}
                                className="bg-blue-500 text-white px-5 py-2 rounded-lg"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AlertMessage
                show={alertState.show}
                message={alertState.message}
                type={alertState.type}
                onClose={() =>
                    setAlertState((prev) => ({
                        ...prev,
                        show: false,
                    }))
                }
            />

            <ConfirmActionModal
                isOpen={confirmOpen}
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                type={confirmConfig.type}
                loading={confirmLoading}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};

export default Enquiry;
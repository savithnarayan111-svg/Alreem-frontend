import React from "react";

export default function ConfirmActionModal({
    isOpen,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    type = "default",
}) {
    if (!isOpen) return null;

    const getButtonStyle = () => {
        switch (type) {
            case "delete":
                return "bg-red-600";

            case "update":
            case "edit":
                return "bg-blue-600 ";

            case "add":
            case "create":
                return "bg-blue-600 ";

            case "payment":
                return "bg-purple-600 ";

            default:
                return "bg-slate-800 hover:bg-slate-900";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 p-6 animate-fadeIn">
                <h2 className="text-xl font-bold text-slate-800 mb-3">{title}</h2>
                <p className="text-slate-600 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 rounded-lg text-white transition ${getButtonStyle()} disabled:opacity-60`}>
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
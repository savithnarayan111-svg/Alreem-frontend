import React, { useEffect, useState } from "react";
import ConfirmActionModal from "../../Components/ConfirmActionModal"

const ProductFormModal = ({
    open,
    onClose,
    onSubmit,
    editing = null,
}) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
    });

    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (editing) {
            setFormData({
                name: editing.name || "",
                description: editing.description || "",
                price: editing.price || "",
                stock: editing.stock || "",
                category: editing.category || "",
                image: null,
            });
        } else {
            setFormData({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                image: null,
            });
        }
    }, [editing, open]);

    if (!open) return null;

    const handleMainSubmit = () => {
        setShowConfirm(true);
    };

    const handleConfirm = async () => {
        await onSubmit(formData);
        setShowConfirm(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
                    <h2 className="text-2xl font-semibold mb-6">
                        {editing ? "Update Product" : "Add Product"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {["name", "description", "category", "price", "stock"].map((field) => (
                            <input
                                key={field}
                                placeholder={field.toUpperCase()}
                                value={formData[field]}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        [field]: e.target.value,
                                    })
                                }
                                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        ))}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    image: e.target.files[0],
                                })
                            }
                            className="w-full border border-slate-300 rounded-lg px-4 py-3"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 rounded-lg border border-slate-300"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleMainSubmit}
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white"
                        >
                            {editing ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <ConfirmActionModal
                    isOpen={showConfirm}
                    title={editing ? "Update Product" : "Add Product"}
                    message={
                        editing
                            ? "Are you sure you want to update this product?"
                            : "Are you sure you want to add this product?"
                    }
                    confirmText={editing ? "Update" : "Save"}
                    cancelText="Cancel"
                    type={editing ? "update" : "add"}
                    onConfirm={handleConfirm}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default ProductFormModal;
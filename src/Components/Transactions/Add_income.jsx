import React, { useState } from "react";
import ConfirmActionModal from "../ConfirmActionModal";

const Add_income = ({ onClose, onSubmit }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        name: "",
        phone: "",
        category: "membership",
        description: "",
        amount: "",
        payment_method: "cash",
        date: "",
    });


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true);
    };

    const confirmSubmit = async () => {
        try {
            setSubmitting(true);

            await onSubmit(formData);

            setFormData({
                title: "",
                name: "",
                phone: "",
                category: "membership",
                description: "",
                amount: "",
                payment_method: "cash",
                date: "",
            });

            setShowConfirm(false);
            onClose();

        } catch (error) {
            console.error("Failed to add income:", error);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">

            <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg p-8">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">
                        Add Income
                    </h2>

                    <button
                        onClick={() => {
                            setShowConfirm(false);
                            onClose();
                        }}
                        className="text-xl"
                    >
                        ✕
                    </button>
                </div>


                <form onSubmit={handleSubmit} className="space-y-4">


                    <div>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                            placeholder="title"
                            required
                        />
                    </div>


                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                                placeholder="name"
                            />
                        </div>


                        <div>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                                placeholder="phone"
                            />
                        </div>

                    </div>


                    <div className="grid grid-cols-2 gap-4">

                        <div>
                            <label className="text-sm font-medium">
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full mt-1 shadow-sm rounded-lg px-3 py-3">
                                <option value="membership">
                                    Membership Fee
                                </option>

                                <option value="product_sale">
                                    Product Sale
                                </option>

                                <option value="registration">
                                    Registration Fee
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Amount
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                                required
                            />

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                Payment Method
                            </label>

                            <select
                                name="payment_method"
                                value={formData.payment_method}
                                onChange={handleChange}
                                className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                            >

                                <option value="cash">
                                    Cash
                                </option>

                                <option value="upi">
                                    UPI
                                </option>

                                <option value="card">
                                    Card
                                </option>

                                <option value="bank">
                                    Bank Transfer
                                </option>

                            </select>

                        </div>


                        <div>
                            <label className="text-sm font-medium">
                                Date
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                                required
                            />

                        </div>
                    </div>


                    <div>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full mt-1 shadow-lg rounded-lg px-3 py-3"
                            placeholder="description"
                        />

                    </div>


                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowConfirm(false);
                                onClose();
                            }}
                            className="px-5 py-2 rounded-lg border text-slate-600">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {submitting ? "Adding..." : "Add Income"}
                        </button>

                    </div>
                </form>

            </div>
            <ConfirmActionModal
                isOpen={showConfirm}
                type="add"
                title="Add Income"
                message="Are you sure you want to add this income?"
                confirmText="Add Income"
                cancelText="Cancel"
                loading={submitting}
                onCancel={() => setShowConfirm(false)}
                onConfirm={confirmSubmit}
            />
        </div >
    );
};

export default Add_income;
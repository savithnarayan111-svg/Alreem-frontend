import React, { useState } from "react";

const AddStaffs = ({
    onClose,
    onSubmit,
    staff = null,
    isEdit = false,
}) => {
    const [form, setForm] = useState({
        name: staff?.name || "",
        role: staff?.role || "",
        specialization: staff?.specialization || "",
        experience: staff?.experience || "",
        phone: staff?.phone || "",
        joining_date: staff?.joining_date || "",
        salary: staff?.salary || "",
        status: staff?.status || "Active",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
            <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                    {isEdit ? "Update Staff" : "Add Staff"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        placeholder="Name"
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="text"
                        name="role"
                        value={form.role}
                        placeholder="Role"
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        name="specialization"
                        value={form.specialization}
                        placeholder="Specialization"
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        placeholder="Phone"
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    {form.phone.length > 0 && form.phone.length < 10 && (
                        <p className="text-blue-500 text-sm mt-1">
                            Phone number must be 10 digits.
                        </p>
                    )}

                    <input
                        type="number"
                        name="experience"
                        value={form.experience}
                        placeholder="Experience"
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="date"
                        name="joining_date"
                        value={form.joining_date}
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="number"
                        name="salary"
                        value={form.salary}
                        placeholder="Salary"
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full border p-2 rounded border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Blocked">Blocked</option>
                    </select>

                    <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                        >
                            {isEdit ? "Update Staff" : "Save Staff"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaffs;
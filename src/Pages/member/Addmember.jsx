import React, { useState, useEffect, useRef } from "react";
import { X, Camera, Upload } from "lucide-react";
import api from "../../api/api";
import ConfirmActionModal from "../../Components/ConfirmActionModal";
import AlertMessage from "../../Components/AlertMessage";
import Webcam from "react-webcam";

const Addmember = ({ member, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: member?.name || "",
        phone: member?.phone || "",
        email: member?.email || "",
        age: member?.age || "",
        gender: member?.gender || "",
        blood_group: member?.blood_group || "",
        location: member?.location || "",
        height: member?.height || "",
        weight: member?.weight || "",
        bmi: member?.bmi || "",
        join_date: member?.join_date || "",
        expiry_date: member?.expiry_date || "",
        plan: member?.plan?.id || member?.plan || "",
        branch: member?.branch?.id || member?.branch || "",
        paid_amount: member?.paid_amount || "",
        due_amount: member?.due_amount || 0,
        photo: null,
    });

    const webcamRef = useRef(null);

    const [showCamera, setShowCamera] = useState(false);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState()
    const [plans, setPlans] = useState([]);
    const [branches, setBranches] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [confirmConfig, setConfirmConfig] = useState({
        title: "",
        message: "",
        confirmText: "Confirm",
        type: "default",
    });

    const [alertState, setAlertState] = useState({
        show: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await api.get("admin/api/plans/");
            setPlans(res.data);
        } catch (error) {
            console.error("Error fetching plans:", error);
        }
    };

    useEffect(() => {
        const selectedPlan = plans.find(
            (plan) => String(plan.id) === String(formData.plan)
        );

        const total = parseFloat(selectedPlan?.price) || 0;
        const paid = parseFloat(formData.paid_amount) || 0;

        setFormData((prev) => ({
            ...prev,
            due_amount: Math.max(total - paid, 0),
        }));
    }, [formData.plan, formData.paid_amount, plans]);

    useEffect(() => {
        const selectedPlan = plans.find(
            (plan) => String(plan.id) === String(formData.plan)
        );

        const duration = parseInt(selectedPlan?.duration) || 0;

        if (formData.join_date && duration > 0) {
            const d = new Date(formData.join_date);
            d.setDate(d.getDate() + duration);
            const expiryDate = d.toISOString().split("T")[0];

            setFormData((prev) => ({
                ...prev,
                expiry_date: expiryDate,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                expiry_date: "",
            }));
        }
    }, [formData.join_date, formData.plan, plans]);

    useEffect(() => {
        const height = parseFloat(formData.height);
        const weight = parseFloat(formData.weight);

        if (height > 0 && weight > 0) {
            const heightM = height / 100;
            const bmi = (weight / (heightM * heightM)).toFixed(2);

            setFormData((prev) => ({
                ...prev,
                bmi: bmi,
            }));
        }
    }, [formData.height, formData.weight]);

    const openConfirmModal = () => {
        setConfirmConfig({
            title: member ? "Update Member" : "Add Member",
            message: member
                ? `Are you sure you want to update ${formData.name || "this member"}?`
                : `Are you sure you want to add ${formData.name || "this member"}?`,
            confirmText: member ? "Update" : "Save",
            type: member ? "edit" : "create",
        });
        setConfirmOpen(true);
    };


    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            const res = await api.get("admin/api/branches/");
            setBranches(res.data);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };


    const handleConfirmSubmit = async () => {
        try {
            setConfirmLoading(true);

            const payload = new FormData();

            Object.keys(formData).forEach((key) => {
                payload.append(key, formData[key] || "");
            });

            if (member) {
                await api.post(`admin/api/members/${member.id}/update/`, payload);

                setAlertState({
                    show: true,
                    message: "Member updated successfully",
                    type: "success",
                });
            } else {
                await api.post("admin/api/members/create/", payload);

                setAlertState({
                    show: true,
                    message: "Member added successfully",
                    type: "success",
                });
            }

            setConfirmOpen(false);

            if (onSuccess) {
                await onSuccess();
            }

            setTimeout(() => {
                onClose();
            }, 800);
        } catch (error) {
            console.error(error.response?.data || error);
            setAlertState({
                show: true,
                message: "Something went wrong",
                type: "error",
            });
        } finally {
            setConfirmLoading(false);
        }
    };

    const capture = async () => {

        const imageSrc = webcamRef.current.getScreenshot();

        setPreview(imageSrc);

        const blob = await (await fetch(imageSrc)).blob();

        const file = new File(
            [blob],
            "member.jpg",
            {
                type: "image/jpeg",
            }
        );

        setFormData(prev => ({
            ...prev,
            photo: file,
        }));

        setShowCamera(false);
    };

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
                <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border border-slate-200">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {member ? "Edit Member" : "Add New Member"}
                            </h2>
                            <div className="flex gap-2 items-center mt-0.5">
                                <p className="text-xs text-slate-500">
                                    Update existing member information
                                </p>
                            </div>
                        </div>

                        <button
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 overflow-y-auto">
                        <div className="flex flex-col lg:flex-row gap-8">

                            {/* Photo */}

                            <div className="flex flex-col items-center gap-3">
                                <div className="w-48 h-48 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden relative group">

                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <Camera size={40} />
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity">

                                        <button
                                            type="button"
                                            onClick={() => setShowCamera(true)}
                                            className="bg-blue-600 text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-blue-700 w-32 flex items-center justify-center gap-2"
                                        >
                                            <Camera size={14} />
                                            Webcam
                                        </button>

                                        <label className="cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];

                                                    if (file) {
                                                        setFormData({
                                                            ...formData,
                                                            photo: file,
                                                        });

                                                        setPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />

                                            <div className="bg-white text-slate-900 text-[10px] font-bold px-4 py-2 rounded-full hover:bg-slate-100 w-32 flex items-center justify-center gap-2">
                                                <Upload size={14} />
                                                Upload
                                            </div>
                                        </label>

                                    </div>
                                </div>

                                {showCamera && (
                                    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

                                        <div className="bg-white rounded-xl p-5 w-[500px]">

                                            <Webcam
                                                ref={webcamRef}
                                                audio={false}
                                                screenshotFormat="image/jpeg"
                                                className="rounded-lg w-full"
                                            />

                                            <div className="flex justify-end gap-3 mt-4">

                                                <button
                                                    onClick={() => setShowCamera(false)}
                                                    className="px-4 py-2 bg-gray-300 rounded"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    onClick={capture}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                                >
                                                    Capture
                                                </button>

                                            </div>

                                        </div>

                                    </div>
                                )}


                            </div>

                            {/* Form */}
                            <div className="flex-1 space-y-6">
                                {/* Personal Details */}
                                <section>
                                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b border-blue-50 pb-1">
                                        Personal Details
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                FULL NAME
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        name: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                PHONE
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {formData.phone.length > 0 &&
                                                formData.phone.length < 10 && (
                                                    <p className="text-blue-500 text-sm mt-1">
                                                        Phone number must be 10 digits.
                                                    </p>
                                                )}
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                EMAIL
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        email: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                LOCATION
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        location: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                AGE
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.age}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        age: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                GENDER
                                            </label>

                                            <select
                                                value={formData.gender}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        gender: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                BLOOD GROUP
                                            </label>

                                            <select
                                                value={formData.blood_group}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        blood_group: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>

                                        <div className="grid">
                                            <label className="text-xs font-medium text-slate-600 ">
                                                JOINING DATE
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.join_date}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        join_date: e.target.value,
                                                    })
                                                }
                                                className="border border-slate-200 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                PLAN
                                            </label>
                                            <select
                                                value={formData.plan}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        plan: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Plan</option>
                                                {plans.map((plan) => (
                                                    <option key={plan.id} value={plan.id}>
                                                        {plan.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                BRANCH
                                            </label>
                                            <select
                                                value={formData.branch}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        branch: e.target.value,
                                                    })
                                                }
                                                className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Branch</option>
                                                {branches.map((branch) => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>







                                        <div>
                                            <label className="text-xs font-medium text-slate-600">
                                                EXPIRY DATE
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.expiry_date}
                                                readOnly
                                                className="w-full mt-1 px-3 py-2 font-bold text-sm border border-slate-200 rounded-lg bg-slate-100 "
                                            />
                                        </div>
                                    </div>
                                </section>

                                {/* Body Stats */}
                                <div>
                                    <section>
                                        <div className="flex gap-4">
                                            <div>
                                                <label className="text-xs font-medium text-slate-600">
                                                    HEIGHT (CM)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.height}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            height: e.target.value,
                                                        })
                                                    }
                                                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-medium text-slate-600">
                                                    WEIGHT (KG)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.weight}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            weight: e.target.value,
                                                        })
                                                    }
                                                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-medium text-slate-600">
                                                    BMI
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.bmi || "—"}
                                                    readOnly
                                                    className="w-full mt-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 font-bold text-slate-700"
                                                />
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                        <button
                            className="px-5 py-2 text-sm font-bold text-slate-400 hover:text-slate-600"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={openConfirmModal}
                            className="px-8 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {member ? "Update Member" : "Save Member"}
                        </button>
                    </div>
                </div>
            </div>

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
                onConfirm={handleConfirmSubmit}
            />
        </>
    );
};

export default Addmember;
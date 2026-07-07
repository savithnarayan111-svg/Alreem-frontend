import React, { useState, useEffect } from "react";
import {
    Trash,
    Pencil,
    ShieldCheck,
    CircleDollarSign,
} from "lucide-react";
import {
    useStaffs,
    useDeleteStaff,
    useStaffPayment,
    useCreateStaff,
    useUpdateStaff,
} from "../../hooks/staffs";
import AddStaff from "./AddStaffs";
import ViewStaffsModal from "./ViewStaffsModal";
import Pagination from "../../Components/Pagination";
import AlertMessage from "../../Components/AlertMessage";
import ConfirmActionModal from "../../Components/ConfirmActionModal";

const Staffs = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);

    const [paymentData, setPaymentData] = useState({
        amount: "",
        payment_date: "",
        payment_method: "",
    });

    const { addPayment } = useStaffPayment();
    const { staffs, fetchStaffs } = useStaffs();
    const { remove } = useDeleteStaff();
    const { create } = useCreateStaff();
    const { update } = useUpdateStaff();

    const [showUpdate, setShowUpdate] = useState(false);
    const [editStaff, setEditStaff] = useState(null);

    const [search, setSearch] = useState("");
    const [active, setActive] = useState("All");
    const [showAdd, setShowAdd] = useState(false);
    const [showStaff, setshowStaff] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const [alertState, setAlertState] = useState({
        show: false,
        message: "",
        type: "success",
    });

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);

    const [confirmConfig, setConfirmConfig] = useState({
        title: "",
        message: "",
        confirmText: "Confirm",
        type: "default",
        successMessage: "",
        action: null,
    });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [active, search]);

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

    const filteredStaffs = staffs.filter((staff) => {
        const matchesStatus =
            active === "All" ||
            staff.status?.toLowerCase() === active.toLowerCase();

        const query = search.toLowerCase();

        const matchesSearch =
            staff.name?.toLowerCase().includes(query) ||
            staff.phone?.includes(search);

        return matchesStatus && matchesSearch;
    });

    const paginatedStaffs = filteredStaffs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (staff) => {
        openConfirmModal({
            title: "Delete Staff",
            message: `Are you sure you want to delete ${staff.name}?`,
            confirmText: "Delete",
            type: "delete",
            successMessage: "Staff deleted successfully",
            action: async () => {
                await remove(staff.id);
                await fetchStaffs();
            },
        });
    };

    const handleSavePayment = async () => {
        try {
            await addPayment(selectedStaff.id, paymentData);

            setAlertState({
                show: true,
                message: `₹${paymentData.amount} salary paid to ${selectedStaff.name}`,
                type: "success",
            });

            setShowPaymentForm(false);

            setPaymentData({
                amount: "",
                payment_date: "",
                payment_method: "",
            });

            fetchStaffs();
        } catch (error) {
            console.error(error);
            setAlertState({
                show: true,
                message:
                    error?.response?.data?.error || "Failed to record payment",
                type: "error",
            });
        }
    };

    const handleAddStaff = (formData) => {
        openConfirmModal({
            title: "Add Staff",
            message: `Are you sure you want to add ${formData.name || "this staff"}?`,
            confirmText: "Save",
            type: "add",
            successMessage: "Staff added successfully",
            action: async () => {
                const payload = new FormData();

                Object.keys(formData).forEach((key) => {
                    payload.append(key, formData[key]);
                });

                await create(payload);
                await fetchStaffs();
                setShowAdd(false);
            },
        });
    };

    const handleUpdateStaff = (formData) => {
        if (!editStaff) return;

        openConfirmModal({
            title: "Update Staff",
            message: `Are you sure you want to update ${formData.name || "this staff"}?`,
            confirmText: "Update",
            type: "update",
            successMessage: "Staff updated successfully",
            action: async () => {
                await update(editStaff.id, formData);
                await fetchStaffs();

                setSelectedStaff((prev) =>
                    prev?.id === editStaff.id
                        ? { ...prev, ...formData }
                        : prev
                );

                setShowUpdate(false);
                setEditStaff(null);
            },
        });
    };
    return (
        <div className="flex flex-col gap-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold text-xl">Staff Management</h1>
                </div>

                <button
                    onClick={() => setShowAdd(true)}
                    className="px-4 py-2 rounded-md text-sm bg-blue-500 font-semibold text-white hover:bg-blue-600 transition"
                >
                    + ADD STAFF
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center justify-between w-full">
                        <p className="text-sm text-slate-500 tracking-wide">
                            ACTIVE STAFFS
                        </p>
                        <ShieldCheck size={25} className="text-green-500" />
                    </div>
                    <h2 className="text-3xl font-bold mt-3 text-slate-900">
                        {staffs.filter((s) => s.status === "Active").length}
                    </h2>
                </div>
            </div>

            {/* SEARCH */}
            <div className="flex items-center justify-between gap-4 py-2 px-2 rounded-lg border border-slate-100 shadow-sm">
                <input
                    type="text"
                    placeholder="Search Staffs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-72 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                STAFF_ID
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                NAME
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                PHONE
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                ROLE
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                JOIN DATE
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                SALARY
                            </th>
                            {/* <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                PAID
                            </th> */}
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-600">
                                STATUS
                            </th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>

                    <tbody>
                        {staffs.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-slate-500">
                                    Loading staffs...
                                </td>
                            </tr>
                        ) : filteredStaffs.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-10 text-slate-500">
                                    No staffs found
                                </td>
                            </tr>
                        ) : (
                            paginatedStaffs.map((staff) => (
                                <tr
                                    key={staff.id}
                                    className="hover:bg-slate-50 transition cursor-pointer"
                                    onClick={() => {
                                        setSelectedStaff(staff);
                                        setshowStaff(true);
                                    }}
                                >
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {staff.id}
                                    </td>

                                    <td className="px-6 py-4">
                                        <p className="font-semibold text-slate-800">
                                            {staff.name}
                                        </p>
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {staff.phone}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {staff.role}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {staff.joining_date}
                                    </td>

                                    <td className="px-6 py-4 text-sm">
                                        {staff.salary}
                                    </td>

                                    {/* <td className="px-6 py-4 text-sm">
                                        {staff.paid_amount}
                                    </td> */}

                                    <td className="px-6 py-4 text-sm">
                                        {staff.status}
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedStaff(staff);
                                                    setShowPaymentForm(true);
                                                }}
                                            >
                                                <CircleDollarSign
                                                    size={25}
                                                    className="text-green-600"
                                                />
                                            </button>

                                            <button
                                                className="p-2 rounded-md hover:bg-blue-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditStaff(staff);
                                                    setShowUpdate(true);
                                                }}
                                            >
                                                <Pencil
                                                    size={18}
                                                    className="text-blue-600"
                                                />
                                            </button>

                                            <button
                                                className="p-2 rounded-md hover:bg-red-100"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(staff);
                                                }}
                                            >
                                                <Trash
                                                    size={18}
                                                    className="text-red-600"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalItems={filteredStaffs.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            {/* ADD MODAL */}
            {showAdd && (
                <AddStaff
                    onClose={() => setShowAdd(false)}
                    onSubmit={handleAddStaff}
                    isEdit={false}
                />
            )}

            {/* VIEW MODAL */}
            {showStaff && selectedStaff && (
                <ViewStaffsModal
                    staff={selectedStaff}
                    onClose={() => {
                        setshowStaff(false);
                        setSelectedStaff(null);
                    }}
                />
            )}

            {/* UPDATE MODAL */}
            {showUpdate && (
                <AddStaff
                    staff={editStaff}
                    isEdit={true}
                    onClose={() => {
                        setShowUpdate(false);
                        setEditStaff(null);
                    }}
                    onSubmit={handleUpdateStaff}
                />
            )}

            {/* PAYMENT MODAL */}
            {showPaymentForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
                        <h3 className="text-lg font-semibold mb-4">
                            Staff Salary Payment
                        </h3>

                        <p className="mb-4">
                            {selectedStaff?.id} / {selectedStaff?.name}
                        </p>

                        <input
                            type="number"
                            placeholder="Amount"
                            value={paymentData.amount}
                            onChange={(e) =>
                                setPaymentData({
                                    ...paymentData,
                                    amount: e.target.value,
                                })
                            }
                            className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <input
                            type="date"
                            value={paymentData.payment_date}
                            onChange={(e) =>
                                setPaymentData({
                                    ...paymentData,
                                    payment_date: e.target.value,
                                })
                            }
                            className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        <select
                            value={paymentData.payment_method}
                            onChange={(e) =>
                                setPaymentData({
                                    ...paymentData,
                                    payment_method: e.target.value,
                                })
                            }
                            className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Payment Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Wallet</option>
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowPaymentForm(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSavePayment}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Pay Salary
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ALERT */}
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

            {/* CONFIRM MODAL */}
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

export default Staffs;
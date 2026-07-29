import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Trash,
  Pencil,
  ShieldCheck,
  CircleCheckBig,
  X,
  Bolt
} from "lucide-react";
import Addmember from "../../Pages/member/Addmember";
import ViewMemberModal from "../member/ViewMemberModal";
import { getMembers, deleteMember, memberpayment, renewMember } from "../../api/members";
import Pagination from "../../Components/Pagination";
import ConfirmActionModal from "../../Components/ConfirmActionModal";
import AlertMessage from "../../Components/AlertMessage";

const Members = () => {
  const [stats, setStats] = useState({
    active_members: 0,
    blocked_members: 0,
    paused_members: 0,
    expired_members: 0,

    total_expense: 0,
    today_expense: 0,
    monthly_expense: 0,
    profit_growth: 0,
    revenue_growth: 0,
    expense_growth: 0,
  });

  const [members, setMembers] = useState([]);
  const [active, setActive] = useState("All");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showMember, setshowMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showEditMember, setShowEditMember] = useState(false);
  const [search, setSearch] = useState("");

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

  const [alertState, setAlertState] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [paymentData, setPaymentData] = useState({
    amount: "",
    payment_type: "",
    payment_method: "",
    payment_date: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showRenewForm, setShowRenewForm] = useState(false);
  const [plans, setPlans] = useState([]);

  const [renewForm, setRenewForm] = useState({
    plan: "",
    expiry_date: "",
  });

  const buttons = ["All", "Active", "Expired", "Paused", "Blocked"];

  useEffect(() => {
    fetchMembers();
    fetchDashboardStats();
    fetchPlans();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [active, search]);

  const fetchMembers = async () => {
    try {
      const res = await getMembers();
      setMembers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("admin/api/dashboard/");
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("admin/api/plans/");
      setPlans(res.data || []);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleMemberSuccess = async () => {
    await fetchMembers();
    await fetchDashboardStats();
  };

  const closePaymentForm = () => {
    setShowPaymentForm(false);
    setPaymentData({
      amount: "",
      payment_type: "",
      payment_method: "",
      payment_date: "",
    });
  };

  const closeRenewForm = () => {
    setShowRenewForm(false);
    setRenewForm({
      plan: "",
      expiry_date: "",
    });
  };

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
        message: "Operation failed",
        type: "error",
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleViewMember = async (id) => {
    try {
      const res = await api.get(`admin/api/members/${id}/`);
      setSelectedMember(res.data);
      setshowMember(true);
    } catch (error) {
      console.error("Error fetching member:", error);
    }
  };

  const handleDeleteMember = (id, name) => {
    openConfirmModal({
      title: "Delete Member",
      message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
      confirmText: "Delete",
      type: "delete",
      successMessage: "Member deleted successfully",
      action: async () => {
        await deleteMember(id);

        setMembers((prev) => prev.filter((member) => member.id !== id));

        await fetchDashboardStats();
      },
    });
  };

  const handleSavePayment = () => {
    const amount = Number(paymentData.amount);
    const dueAmount = Number(selectedMember?.due_amount);

    if (!amount || amount <= 0) {
      setAlertState({
        show: true,
        message: "Please enter a valid payment amount",
        type: "warning",
      });
      return;
    }

    if (amount > dueAmount) {
      setAlertState({
        show: true,
        message: `Amount cannot exceed due amount (₹${dueAmount})`,
        type: "warning",
      });
      return;
    }

    openConfirmModal({
      title: "Confirm Payment",
      message: `Are you sure you want to add ₹${amount} payment for ${selectedMember?.name}?`,
      confirmText: "Confirm Payment",
      type: "payment",
      successMessage: `₹${amount} payment added successfully for ${selectedMember?.name}`,
      action: async () => {
        await memberpayment(selectedMember.id, paymentData);

        await fetchMembers();
        await fetchDashboardStats();

        const res = await api.get(`admin/api/members/${selectedMember.id}/`);
        setSelectedMember(res.data);

        closePaymentForm();
      },
    });
  };

  const handleOpenRenewForm = (member) => {
    setSelectedMember(member);
    setRenewForm({
      plan: member.plan || "",
      expiry_date: "",
    });
    setShowRenewForm(true);
  };

  const handleRenewPlanChange = (e) => {
    const selectedPlanName = e.target.value;

    const selectedPlan = plans.find((p) => p.name === selectedPlanName);

    if (!selectedPlan) {
      setRenewForm({
        plan: selectedPlanName,
        expiry_date: "",
      });
      return;
    }

    const duration = Number(
      selectedPlan.duration ??
      selectedPlan.days ??
      selectedPlan.duration_in_days ??
      0
    );

    const today = new Date();

    let baseDate = today;

    if (selectedMember?.expiry_date) {
      const memberExpiry = new Date(selectedMember.expiry_date);
      if (!isNaN(memberExpiry.getTime()) && memberExpiry >= today) {
        baseDate = memberExpiry;
      }
    }

    const expiry = new Date(baseDate);
    expiry.setDate(expiry.getDate() + duration);

    setRenewForm({
      plan: selectedPlanName,
      expiry_date: expiry.toISOString().split("T")[0],
    });
  };

  const handleRenewSubmit = () => {
    if (!renewForm.plan) {
      setAlertState({
        show: true,
        message: "Please select a plan",
        type: "warning",
      });
      return;
    }

    openConfirmModal({
      title: "Renew Membership",
      message: `Are you sure you want to renew membership for ${selectedMember?.name} with ${renewForm.plan} plan?`,
      confirmText: "Confirm Renew",
      type: "default",
      successMessage: `${selectedMember?.name}'s membership renewed successfully`,
      action: async () => {
        await renewMember(selectedMember.id, {
          plan: renewForm.plan,
        });

        await fetchMembers();
        await fetchDashboardStats();

        const res = await api.get(`admin/api/members/${selectedMember.id}/`);
        setSelectedMember(res.data);

        closeRenewForm();
      },
    });
  };

  const filteredMembers = members
    .filter((member) => {
      const matchesStatus =
        active === "All" ||
        member.status?.toLowerCase() === active.toLowerCase();

      const matchesSearch =
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.phone?.includes(search) ||
        String(member.id).includes(search);

      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (active === "Expired") {
        if (!a.expiry_date && !b.expiry_date) return 0;
        if (!a.expiry_date) return 1;
        if (!b.expiry_date) return -1;

        return new Date(a.expiry_date) - new Date(b.expiry_date);
      }

      return a.id - b.id;
    });

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Expired":
        return "bg-yellow-100 text-yellow-700";
      case "Blocked":
        return "bg-red-100 text-red-700";
      case "Paused":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">Members Management</h1>
        </div>

        <button
          className="px-4 py-2 rounded-md text-sm bg-blue-500 font-semibold text-white hover:bg-blue-600 transition"
          onClick={() => setShowAddMember(true)}
        >
          + ADD MEMBER
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs sm:text-sm text-slate-500 tracking-wide">
              ACTIVE MEMBERS
            </p>
            <ShieldCheck size={22} className="text-green-500 shrink-0" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900">
            {stats?.active_members ?? 0}
          </h2>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs sm:text-sm text-slate-500 tracking-wide">
              PAUSED MEMBERS
            </p>
            <ShieldCheck size={22} className="text-blue-500 shrink-0" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900">
            {stats?.paused_members ?? 0}
          </h2>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs sm:text-sm text-slate-500 tracking-wide">
              EXPIRED MEMBERS
            </p>
            <ShieldCheck size={22} className="text-yellow-500 shrink-0" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900">
            {stats?.expired_members ?? 0}
          </h2>
        </div>

        <div className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between w-full">
            <p className="text-xs sm:text-sm text-slate-500 tracking-wide">
              BLOCKED MEMBERS
            </p>
            <ShieldCheck size={22} className="text-red-500 shrink-0" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mt-3 text-slate-900">
            {stats?.blocked_members ?? 0}
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 py-2 px-2 rounded-lg border border-slate-100 shadow-sm">
        <div className="flex gap-3 flex-wrap">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => setActive(btn)}
              className={`px-4 py-1 rounded-md transition text-sm ${active === btn
                ? "bg-blue-500 font-semibold text-white"
                : "bg-white text-slate-400 font-bold hover:text-black"
                }`}
            >
              {btn}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-slate-50">
            <tr>
              <th className="w-[70px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                ID
              </th>
              <th className="w-[90px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                PHOTO
              </th>
              <th className="w-[220px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                NAME
              </th>
              <th className="w-[150px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                PHONE
              </th>
              <th className="w-[110px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                PLAN
              </th>
              <th className="w-[110px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                BRANCH
              </th>
              <th className="w-[140px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                JOIN DATE
              </th>
              <th className="w-[140px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                EXPIRY DATE
              </th>
              <th className="w-[110px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                PAID
              </th>
              <th className="w-[110px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                DUE
              </th>
              <th className="w-[120px] px-6 py-4 text-left text-xs font-bold text-slate-600">
                STATUS
              </th>
              <th className="w-[140px] px-6 py-4"></th>
            </tr>
          </thead>

          <tbody>
            {paginatedMembers.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-slate-50 transition"
                onClick={() => handleViewMember(member.id)}
              >
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  #{member.id}
                </td>

                <td className="px-6 py-4">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-6 py-4 overflow-hidden">
                  <p className="font-semibold text-slate-800 truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {member.email}
                  </p>
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  {member.phone}
                </td>

                <td className="px-6 py-4 text-sm truncate">
                  {member.plan}
                </td>

                <td className="px-6 py-4 text-sm truncate">
                  {member.branch}
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  {member.join_date}
                </td>

                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  {member.expiry_date}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{member.paid_amount}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{member.due_amount}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(
                      member.status
                    )}`}
                  >
                    {member.status}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-3 whitespace-nowrap">
                    <button
                      className="p-2 rounded-md hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenRenewForm(member);
                      }}
                    >
                      <Bolt size={20} className="text-purple-600" />
                    </button>

                    {member.due_amount <= 0 ? (
                      <span className="pt-2 px-2 bg-blue-100 rounded-full text-xs">
                        <CircleCheckBig size={18} className="text-blue-600" />
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          if (member.status === "Blocked") {
                            setAlertState({
                              show: true,
                              message: "Blocked members cannot make payments",
                              type: "warning",
                            });
                            return;
                          }

                          setSelectedMember(member);
                          setShowPaymentForm(true);
                        }}
                      >
                        <X
                          size={25}
                          className={
                            member.status === "Blocked"
                              ? "text-red-600"
                              : "text-green-600"
                          }
                        />
                      </button>
                    )}

                    <button
                      className="p-2 rounded-md hover:bg-blue-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMember(member);
                        setShowEditMember(true);
                      }}
                    >
                      <Pencil size={18} className="text-blue-600" />
                    </button>

                    <button
                      className="p-2 rounded-md hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(member.id, member.name);
                      }}
                    >
                      <Trash size={18} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedMembers.length === 0 && (
              <tr>
                <td colSpan="11" className="text-center py-10 text-slate-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={filteredMembers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {showAddMember && (
        <Addmember
          onClose={() => setShowAddMember(false)}
          onSuccess={handleMemberSuccess}
        />
      )}

      {showEditMember && (
        <Addmember
          member={selectedMember}
          onClose={() => {
            setShowEditMember(false);
            setSelectedMember(null);
          }}
          onSuccess={handleMemberSuccess}
        />
      )}

      {showMember && selectedMember && (
        <ViewMemberModal
          member={selectedMember}
          onClose={() => {
            setshowMember(false);
            setSelectedMember(null);
          }}
        />
      )}

      {showPaymentForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Add Payment</h3>

            <div className="flex justify-between">
              <p className="text-sm text-black mb-4">
                Member:{" "}
                <span className="font-semibold">
                  {selectedMember?.id}/{selectedMember?.name}
                </span>
              </p>

              <p className="text-sm text-black mb-4">
                Due:{" "}
                <span className="font-semibold text-red-500">
                  {selectedMember?.due_amount}
                </span>
              </p>
            </div>

            <input
              type="number"
              max={selectedMember?.due_amount}
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

            {/* <input
              type="text"
              placeholder="Payment Type"
              value={paymentData.payment_type}
              onChange={(e) =>
                setPaymentData({
                  ...paymentData,
                  payment_type: e.target.value,
                })
              }
              className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> */}

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

            <div className="flex justify-end gap-2">
              <button
                onClick={closePaymentForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSavePayment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showRenewForm && selectedMember && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Renew Membership</h3>

            <div className="space-y-4">
              <input
                value={`${selectedMember?.id}/${selectedMember?.name}`}
                readOnly
                className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 bg-slate-50"
              />

              <select
                value={renewForm.plan}
                onChange={handleRenewPlanChange}
                className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={renewForm.expiry_date}
                readOnly
                className="w-full border border-slate-300 shadow-md rounded-lg px-3 py-2 bg-slate-50"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeRenewForm}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRenewSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Renew
                </button>
              </div>
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

export default Members;
import React, { useEffect, useState } from "react";
import { sendWhatsApp } from "../utils/sendWhatsApp";
import {
  DollarSign,
  Percent,
  Landmark
} from "lucide-react";
import api from "../api/api";

const Dashboard = () => {
  const [blockedMembers, setBlockedMembers] = useState([]);
  const [expiredMembers, setExpiredMembers] = useState([]);
  const [plans, setPlans] = useState([]);

  const [showRenewForm, setShowRenewForm] = useState(false);
  const [showRenewConfirm, setShowRenewConfirm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [renewLoading, setRenewLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [renewForm, setRenewForm] = useState({
    plan: "",
    expiry_date: "",
  });

  const [stats, setStats] = useState({
    total_members: 0,
    active_members: 0,
    blocked_members: 0,
    expired_members: 0,
    paused_members: 0,
    pending_payments: 0,
    recent_registrations: [],
    upcoming_expiries_list: [],
    total_income: 0,
    today_income: 0,
    monthly_income: 0,
    total_expense: 0,
    today_expense: 0,
    monthly_expense: 0,
    revenue_growth: 0,
    expense_growth: 0,
    profit_growth: 0,
  });

  useEffect(() => {
    fetchDashboard();
    fetchExpiringMembers();
    fetchBlockedMembers();
    fetchPlans();
  }, []);

  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("admin/api/dashboard/");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchExpiringMembers = async () => {
    try {
      const res = await api.get("admin/api/expiring_soon_members/");
      setExpiredMembers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBlockedMembers = async () => {
    try {
      const res = await api.get("admin/api/blocked_members/");
      setBlockedMembers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("admin/api/plans/");
      setPlans(res.data || []);
    } catch (err) {
      console.log("Failed to fetch plans", err);
    }
  };

  const openRenewModal = (member) => {
    setSelectedMember(member);
    setRenewForm({
      plan: "",
      expiry_date: "",
    });
    setShowRenewForm(true);
  };

  const closeRenewModal = () => {
    setShowRenewForm(false);
    setShowRenewConfirm(false);
    setSelectedMember(null);
    setRenewForm({
      plan: "",
      expiry_date: "",
    });
  };

  const handlePlanChange = (e) => {
    const selectedPlanName = e.target.value;

    const selectedPlan = plans.find(
      (p) => p.name === selectedPlanName
    );

    if (!selectedPlan) {
      setRenewForm({
        plan: selectedPlanName,
        expiry_date: "",
      });
      return;
    }

    const duration = Number(selectedPlan.duration || 0);

    const today = new Date();
    let baseDate = today;

    if (
      selectedMember?.expiry_date &&
      new Date(selectedMember.expiry_date) > today
    ) {
      baseDate = new Date(selectedMember.expiry_date);
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
      alert("Please select a plan");
      return;
    }
    setShowRenewConfirm(true);
  };

  const confirmRenewMember = async () => {
    if (!selectedMember || !renewForm.plan) return;

    try {
      setRenewLoading(true);

      const formData = new FormData();
      formData.append("plan", renewForm.plan);

      await api.post(
        `admin/api/members/${selectedMember.id}/renew/`,
        formData
      );

      setSuccessMsg("Membership renewed successfully");
      closeRenewModal();

      fetchBlockedMembers();
      fetchExpiringMembers();
      fetchDashboard();
    } catch (err) {
      console.log(err);
      alert("Failed to renew membership");
    } finally {
      setRenewLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-slate-50 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

      {successMsg && (
        <div className="rounded-lg bg-green-100 border border-green-300 text-green-700 px-4 py-3">
          {successMsg}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Income */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <Landmark className="text-black" />
            <p className="text-sm text-slate-500">Income Overview</p>
          </div>

          <h2 className="text-2xl font-bold mt-2">
            <b className="text-black">₹{stats.total_income}</b>
          </h2>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Today Income</p>
              <p className="text-xs text-black">
                <b>₹{stats.today_income}</b>
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Monthly Income</p>
              <p className="text-xs text-black">
                <b>₹{stats.monthly_income}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Expense */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="text-black" />
            <p className="text-sm text-slate-500">Expense Overview</p>
          </div>

          <h2 className="text-2xl font-bold mt-2">
            <b className="text-black">₹{stats.total_expense}</b>
          </h2>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Today Expense</p>
              <p className="text-xs text-black">
                <b>₹{stats.today_expense}</b>
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Monthly Expense</p>
              <p className="text-xs text-black">
                <b>₹{stats.monthly_expense}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Growth */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <Percent className="text-black" />
            <p className="text-sm text-slate-500">Growth Overview</p>
          </div>

          <h2 className="text-2xl font-bold mt-2">
            <b className="text-black">{stats.profit_growth}%</b>
          </h2>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Revenue growth</p>
              <p className="text-xs text-black">
                <b>{stats.revenue_growth}%</b>
              </p>
            </div>

            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Expense growth</p>
              <p className="text-xs text-black">
                <b>{stats.expense_growth}%</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Recent Registrations</h2>
          </div>

          <table className="w-full text-left bg-white border rounded-xl border-slate-200 shadow-md shadow-slate-100/60">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500">MEMBER</th>
                <th className="p-4 text-xs font-semibold text-slate-500">PHONE</th>
                <th className="p-4 text-xs font-semibold text-slate-500">EMAIL</th>
                <th className="p-4 text-xs font-semibold text-slate-500">PLAN</th>
                <th className="p-4 text-xs font-semibold text-slate-500 text-right">JOIN DATE</th>
              </tr>
            </thead>

            <tbody>
              {(stats.recent_registrations || []).map((m, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{m.name}</td>
                  <td className="p-4 text-sm text-slate-600">{m.phone}</td>
                  <td className="p-4 text-sm text-slate-600">{m.email}</td>
                  <td className="p-4 text-sm text-slate-600">{m.plan}</td>
                  <td className="p-4 text-sm text-right text-slate-500">{m.join_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Expiries */}
        <div className="lg:col-span-2">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Upcoming Expiries</h2>
          </div>

          <table className="w-full text-left bg-white border rounded-xl border-slate-200 shadow-md shadow-slate-100/60">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500">MEMBER</th>
                <th className="p-4 text-xs font-semibold text-slate-500">PHONE</th>
                <th className="p-4 text-xs font-semibold text-slate-500">EXPIRY DATE</th>
                <th className="p-4 text-xs font-semibold text-slate-500">DUE AMOUNT</th>
                <th className="p-4 text-xs font-semibold text-slate-500">ACTION</th>
              </tr>
            </thead>

            <tbody>
              {(expiredMembers || []).map((m, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-sm font-semibold text-slate-800 whitespace-nowrap">{m.name}</td>
                  <td className="p-4 text-sm text-slate-600">{m.phone}</td>
                  <td className="p-4 text-sm text-slate-600">{m.expiry_date}</td>
                  <td className="p-4 text-sm text-slate-600">₹{m.due_amount}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      className="px-4 py-1 bg-blue-500 text-white text-[10px] rounded font-bold"
                      onClick={() => sendWhatsApp(m)}
                    >
                      SEND
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blocked Members */}
      <div className="grid gap-6">
        <div className="w-full">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">Blocked Members</h2>
          </div>

          <table className="w-full bg-white border rounded-xl border-slate-200 shadow-md shadow-slate-100/60">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">MEMBER</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">PHONE</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">JOIN DATE</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">EXPIRY DATE</th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {blockedMembers?.length > 0 ? (
                blockedMembers.map((m, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                    <td className="p-4 text-sm font-semibold text-slate-800">{m.name}</td>
                    <td className="p-4 text-sm text-slate-600">{m.phone}</td>
                    <td className="p-4 text-sm text-slate-600">{m.join_date}</td>
                    <td className="p-4 text-sm text-slate-600">{m.expiry_date}</td>
                    <td className="p-4 whitespace-nowrap">
                      <button
                        className="px-4 py-1 bg-blue-500 text-white text-[10px] rounded font-bold"
                        onClick={() => openRenewModal(m)}
                      >
                        RENEW
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No blocked members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Renew Form Modal */}
      {showRenewForm && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Renew Membership</h2>

            <div className="space-y-4">
              <input
                value={selectedMember?.name || ""}
                readOnly
                className="w-full border rounded-lg px-3 py-2"
              />

              <select
                value={renewForm.plan}
                onChange={handlePlanChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select Plan</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.name}>
                    {plan.name}
                  </option>
                ))}
              </select>

              <input
                value={renewForm.expiry_date}
                readOnly
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Expiry Date"
              />

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeRenewModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>

                <button
                  onClick={handleRenewSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  Renew
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Renew Confirmation Modal */}
      {showRenewConfirm && selectedMember && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-15">
            <h2 className="text-xl font-bold text-slate-800 mb-3">
              Confirm Renewal
            </h2>

            <p className="text-slate-600 mb-2">
              Are you sure you want to renew membership for
              <span className="font-semibold text-slate-900"> {selectedMember.name}</span>?
            </p>

            <div className="bg-slate-50 rounded-lg p-3 mb-5 text-sm text-slate-700 space-y-1">
              <p><span className="font-medium">Plan:</span> {renewForm.plan}</p>
              <p><span className="font-medium">New Expiry:</span> {renewForm.expiry_date}</p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRenewConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={confirmRenewMember}
                disabled={renewLoading}
                className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {renewLoading ? "Renewing..." : "Confirm Renew"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

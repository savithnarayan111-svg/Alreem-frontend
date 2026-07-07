import React, { useEffect, useState } from "react";
import { sendWhatsApp } from '../utils/sendWhatsApp'

import {
  Users,
  Activity,
  DollarSign,
  AlertCircle,
  Percent,
  Landmark
} from "lucide-react";
import { } from "lucide-react";

import api from "../api/api";

const Dashboard = () => {
  const [blockedMembers, setBlockedMembers] = useState([]);
  const [expiredMembers, setExpiredMembers] = useState([]);
  const [showRenewForm, setShowRenewForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const [renewForm, setRenewForm] = useState({
    plan: "",
    expiry_date: "",
  });

  const [stats, setStats] = useState({
    total_members: 0,
    active_members: 0,
    trainers_count: 0,
    pending_payments: 0,
    recent_registrations: [],
    upcoming_expiries_list: [],
  });

  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchMembers();
    fetchBlockedMembers();
    // fetchExpiredMembers();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("admin/api/dashboard/");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMembers = async () => {
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

  const planDays = {
    Silver: 30,
    Gold: 90,
    Premium: 180,
    Platinum: 365,
    Diamond: 365,
  };

  const handlePlanChange = (e) => {
    const plan = e.target.value;

    const today = new Date();

    let baseDate = today;

    if (
      selectedMember.expiry_date &&
      new Date(selectedMember.expiry_date) > today
    ) {
      baseDate = new Date(selectedMember.expiry_date);
    }

    const expiry = new Date(baseDate);
    expiry.setDate(expiry.getDate() + planDays[plan]);

    setRenewForm({
      plan,
      expiry_date: expiry.toISOString().split("T")[0],
    });
  };
  const handleRenewMember = async () => {
    try {
      const formData = new FormData();
      formData.append("plan", renewForm.plan);

      await api.post(
        `admin/api/members/${selectedMember.id}/renew/`,
        formData
      );

      alert("Membership renewed successfully");

      setShowRenewForm(false);

      setRenewForm({
        plan: "",
        expiry_date: "",
      });

      fetchBlockedMembers();
      fetchMembers();
      fetchDashboard();
    } catch (err) {
      console.log(err);
      alert("Failed to renew membership");
    }
  };
  return (
    <div className="flex flex-col gap-8 p-6 bg-slate-50 min-h-screen">

      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-900">
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">

        {/* Total Income */}

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">

          <div className="flex items-center gap-3">
            <Landmark className="text-black" />

            <p className="text-sm text-slate-500">Income Overview</p>
          </div>
          <h2 className="text-2xl font-bold mt-2">
            <b className="text-black">{stats.total_income}</b>
          </h2>

          <div className="mt-3 space-y-2">

            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Today Income</p>
              <p className="text-xs text-black">
                <b>{stats.today_income}</b>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Monthly Income</p>
              <p className="text-xs text-black">
                <b>{stats.monthly_income}</b>
              </p>
            </div>
          </div>
        </div>


        {/* Expense Overview */}

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">

          <div className="flex items-center gap-3">
            <DollarSign className="text-black" />
            <p className="text-sm text-slate-500">Expense Overview</p>
          </div>
          <h2 className="text-2xl font-bold mt-2">
            <b className="text-black">{stats.total_expense}</b>
          </h2>

          <div className="mt-3 space-y-2">

            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Today Expense</p>
              <p className="text-xs text-black">
                <b>{stats.today_expense}</b>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Monthly Expense</p>
              <p className="text-xs text-black">
                <b>{stats.monthly_expense}</b>
              </p>
            </div>
          </div>
        </div>

        {/* Payments */}
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">


          <div className="flex items-center gap-3">
            <Percent className="text-black" />
            <p className="text-sm text-slate-500">Growth overview</p>
          </div>
          <h2 className="text-2xl font-bold mt-2">
            <b className="text-black">{stats.profit_growth}</b>
          </h2>

          <div className="mt-3 space-y-2">

            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Revenue growth</p>
              <p className="text-xs text-black">
                <b>{stats.revenue_growth}</b>
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-xs text-slate-400">Expense growth</p>
              <p className="text-xs text-black">
                <b>{stats.expense_growth}</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Registrations */}
        <div className="lg:col-span-2 ">

          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">
              Recent Registrations
            </h2>
          </div>
          {/* Table */}
          <table className="w-full text-left bg-white border rounded-xl border-slate-200 shadow-md shadow-slate-100/60">


            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  MEMBER
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  PHONE
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  EMAIL
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  PLAN
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500 text-right">
                  JOIN DATE
                </th>
              </tr>
            </thead>

            <tbody>
              {(stats.recent_registrations || []).map((m, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                    {m.name}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {m.phone}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {m.email}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {m.plan}
                  </td>

                  <td className="p-4 text-sm text-right text-slate-500">
                    {m.join_date}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Upcoming Expiries */}

        <div className="lg:col-span-2">

          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">
              Upcoming Expiries
            </h2>
          </div>

          {/* Table */}
          <table className="w-full text-left bg-white border rounded-xl border-slate-200 shadow-md shadow-slate-100/60">

            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  MEMBER
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  PHONE
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  EXPIRY DATE
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  DUE AMOUNT
                </th>
                <th className="p-4 text-xs font-semibold text-slate-500">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody>
              {(expiredMembers || []).map((m, i) => (
                <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition">
                  <td className="p-4 text-sm font-semibold text-slate-800 whitespace-nowrap">
                    {m.name}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {m.phone}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    {m.expiry_date}
                  </td>

                  <td className="p-4 text-sm text-slate-600">
                    ₹{m.due_amount}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <button
                      className="px-4 py-1 bg-blue-500 text-white text-[10px] rounded font-bold"
                      onClick={() => {
                        console.log(m);
                        sendWhatsApp(m);
                      }}
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

      <div className="grid  gap-6">


        {/* Blocked members */}

        <div className="w-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800">
              Blocked Members
            </h2>
          </div>

          {/* Table */}
          <table className="w-full bg-white border rounded-xl border-slate-200 shadow-md shadow-slate-100/60">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">
                  MEMBER
                </th>

                <th className="p-4 text-left text-xs font-semibold text-slate-500">
                  PHONE
                </th>

                {/* <th className="p-4 text-left text-xs font-semibold text-slate-500">
                  PLAN
                </th> */}

                <th className="p-4 text-left text-xs font-semibold text-slate-500">
                  JOIN DATE
                </th>

                <th className="p-4 text-left text-xs font-semibold text-slate-500">
                  EXPIRY DATE
                </th>
                <th className="p-4 text-left text-xs font-semibold text-slate-500">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {blockedMembers?.length > 0 ? (
                blockedMembers.map((m, i) => (
                  <tr
                    key={i}
                    className="border-t border-slate-100 hover:bg-slate-50 transition"
                  >
                    <td className="p-4 text-sm font-semibold text-slate-800">
                      {m.name}
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {m.phone}
                    </td>

                    {/* <td className="p-4 text-sm text-slate-600">
                      {m.plan}
                    </td> */}

                    <td className="p-4 text-sm text-slate-600">
                      {m.join_date}
                    </td>

                    <td className="p-4 text-sm text-slate-600">
                      {m.expiry_date}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <button
                        className="px-4 py-1 bg-blue-500 text-white text-[10px] rounded font-bold"
                        onClick={() => {
                          setSelectedMember(m);

                          setRenewForm({
                            plan: "",
                            expiry_date: "",
                          });

                          setShowRenewForm(true);
                        }}
                      >
                        RENEW
                      </button>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-slate-500"
                  >
                    No blocked members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {showRenewForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-md">

                <h2 className="text-lg font-bold mb-4">
                  Renew Membership
                </h2>

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
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Premium">Premium</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                  </select>

                  <input
                    value={renewForm.expiry_date}
                    readOnly
                    className="w-full border rounded-lg px-3 py-2"
                  />

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowRenewForm(false)}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={handleRenewMember}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                      Renew
                    </button>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>

      </div>

    </div>
  );
};

export default Dashboard;
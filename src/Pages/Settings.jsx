import React, { useEffect, useState } from "react";
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Database,
    HardDrive,
    Shield,
} from "lucide-react";
import AlertMessage from "../Components/AlertMessage"
import useAdminSettings from "../hooks/useAdminSettings"

const Settings = () => {
    const { admin, loading, fetchAdminProfile, updateAdminPassword } =
        useAdminSettings();

    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [alertState, setAlertState] = useState({
        show: false,
        message: "",
        type: "success",
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            await fetchAdminProfile();
        } catch (error) {
            setAlertState({
                show: true,
                message: "Failed to load admin profile",
                type: "error",
            });
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleUpdatePassword = async () => {
        if (
            !passwordData.current_password ||
            !passwordData.new_password ||
            !passwordData.confirm_password
        ) {
            setAlertState({
                show: true,
                message: "All password fields are required",
                type: "warning",
            });
            return;
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            setAlertState({
                show: true,
                message: "New password and confirm password do not match",
                type: "warning",
            });
            return;
        }

        try {
            const res = await updateAdminPassword(passwordData);

            setAlertState({
                show: true,
                message: res.message || "Password updated successfully",
                type: "success",
            });

            setPasswordData({
                current_password: "",
                new_password: "",
                confirm_password: "",
            });
        } catch (error) {
            setAlertState({
                show: true,
                message:
                    error.response?.data?.error || "Failed to update password",
                type: "error",
            });
        }
    };

    return (
        <div className="overflow-hidden">
            <div className="mb-2 m-5">
                <h1 className="text-xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500 text-sm">
                    Global system configuration and security preferences.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Admin Profile */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Admin Profile
                        </h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={admin.full_name || ""}
                                readOnly
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                Username
                            </label>

                            <input
                                type="text"
                                value={admin.username || ""}
                                readOnly
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                value={admin.email || ""}
                                readOnly
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-blue-600" />
                        </div>

                        <h2 className="text-lg font-bold text-slate-900">
                            Change Password
                        </h2>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                Current Password
                            </label>

                            <div className="relative">
                                <input
                                    type={showPassword.current ? "text" : "password"}
                                    name="current_password"
                                    value={passwordData.current_password}
                                    onChange={handlePasswordChange}
                                    className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white outline-none"
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            current: !prev.current,
                                        }))
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                >
                                    {showPassword.current ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                    New Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword.new ? "text" : "password"}
                                        name="new_password"
                                        value={passwordData.new_password}
                                        onChange={handlePasswordChange}
                                        className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                new: !prev.new,
                                            }))
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword.new ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        type={showPassword.confirm ? "text" : "password"}
                                        name="confirm_password"
                                        value={passwordData.confirm_password}
                                        onChange={handlePasswordChange}
                                        className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => ({
                                                ...prev,
                                                confirm: !prev.confirm,
                                            }))
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword.confirm ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleUpdatePassword}
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-60"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Database Card */}
            <div className="mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                            <Database className="w-5 h-5 text-green-600" />
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-900">
                                System Database
                            </h2>

                            <p className="text-sm text-slate-500">
                                Persistent storage configuration.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                        CONNECTED
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <HardDrive className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-semibold uppercase text-slate-500">
                                Database Location
                            </span>
                        </div>

                        <p className="text-sm text-slate-700 break-all">
                            C:\Users\admin\AppData\Roaming\GymManagementSystem\gym.db
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-slate-500 mb-2">
                                Status
                            </p>

                            <p className="font-bold text-slate-900">
                                SYNCHRONIZED & SECURE
                            </p>
                        </div>

                        <Shield className="w-7 h-7 text-slate-300" />
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
        </div>
    );
};

export default Settings;
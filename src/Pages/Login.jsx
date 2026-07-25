// import React, { useState } from "react";
// import { loginAdmin } from "../api/Login";

// const Login = () => {
//     const [formData, setFormData] = useState({
//         username: "",
//         password: "",
//     });

//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) => {
//         setFormData((prev) => ({
//             ...prev,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             setLoading(true);

//             const res = await loginAdmin({
//                 username: formData.username,
//                 password: formData.password,
//             });

//             localStorage.setItem("accessToken", res.data.access);
//             localStorage.setItem("refreshToken", res.data.refresh);
//             localStorage.setItem("adminUser", JSON.stringify(res.data.user));

//             window.location.href = "dashboard";
//         } catch (err) {
//             console.error(err);
//             setError(err.response?.data?.error || "Login failed");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
//                 <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
//                     Admin Login
//                 </h2>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-1">
//                             Username
//                         </label>
//                         <input
//                             type="text"
//                             name="username"
//                             value={formData.username}
//                             onChange={handleChange}
//                             className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter username"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-slate-700 mb-1">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             className="w-full border border-slate-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter password"
//                         />
//                     </div>

//                     {error && <p className="text-red-600 text-sm">{error}</p>}

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition"
//                     >
//                         {loading ? "Logging in..." : "Login"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;
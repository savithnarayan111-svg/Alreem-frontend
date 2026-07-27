import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Tag,
  Contact,
  ShoppingCart,
  BadgeIndianRupee,
  IndianRupee,
  SearchCheck
} from 'lucide-react';
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, danger = false, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = path ? location.pathname === path : false;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm font-medium
        ${active
          ? 'bg-slate-100 text-slate-900'
          : danger
            ? 'text-red-500 hover:bg-red-50'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
      `}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center ${active ? 'text-slate-900' : danger ? 'text-red-500' : 'text-slate-400'
          }`}
      >
        <Icon size={20} />
      </div>
      {label}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("adminUser");

  //   navigate("/login");
  // };

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen sticky top-0">
      <div className="h-24 flex items-center justify-center border-b border-slate-50 mb-4 px-4 text-center">
        <img src={logo} alt="Logo" className="w-28 h-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
          Gym Management
        </div>

        <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
        <SidebarItem icon={Users} label="Members" path="/members" />
        <SidebarItem icon={Building2} label="Branches" path="/branches" />
        <SidebarItem icon={Tag} label="Plans" path="/plans" />
        <SidebarItem icon={Contact} label="Staffs" path="/staffs" />
        <SidebarItem icon={ShoppingCart} label="Products" path="/products" />
        <SidebarItem icon={BadgeIndianRupee} label="Sales" path="/sales" />
        <SidebarItem icon={IndianRupee} label="Transactions" path="/transactions" />
        <SidebarItem icon={SearchCheck} label="Enquiry" path="/enquiry" />

        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2 mt-8">
          System
        </div>

        <SidebarItem icon={Settings} label="Settings" path="/settings" />
      </nav>

      {/* <div className="p-4 border-t border-slate-50">
        <SidebarItem
          icon={LogOut}
          label="Logout"
          danger
          onClick={handleLogout}
        />
      </div> */}
    </aside>
  );
};

export default Sidebar;
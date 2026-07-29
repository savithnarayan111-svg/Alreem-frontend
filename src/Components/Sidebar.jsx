import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  Tag,
  Contact,
  ShoppingCart,
  BadgeIndianRupee,
  IndianRupee,
  SearchCheck,
  ChevronDown,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarItem = ({
  icon: Icon,
  label,
  path,
  danger = false,
  onClick,
  className = "",
}) => {
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
        flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer
        transition-all duration-200 text-sm font-medium
        ${active
          ? "bg-slate-100 text-slate-900"
          : danger
            ? "text-red-500 hover:bg-red-50"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }
        ${className}
      `}
    >
      <Icon
        size={20}
        className={
          active
            ? "text-slate-900"
            : danger
              ? "text-red-500"
              : "text-slate-400"
        }
      />

      <span>{label}</span>
    </div>
  );
};

const SidebarDropdown = ({ icon: Icon, label, children, paths = [] }) => {
  const location = useLocation();

  const isActive = paths.includes(location.pathname);

  const [open, setOpen] = useState(isActive);

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        className={`
          flex items-center justify-between
          px-3 py-2.5 rounded-lg cursor-pointer
          transition-all duration-200
          ${isActive
            ? "bg-slate-100 text-slate-900"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }
        `}
      >
        <div className="flex items-center gap-3">
          <Icon
            size={20}
            className={isActive ? "text-slate-900" : "text-slate-400"}
          />

          <span className="text-sm font-medium">{label}</span>
        </div>

        {open ? (
          <ChevronDown size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </div>

      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-40 mt-1" : "max-h-0"
          }`}>
        <div className="ml-6 border-slate-200 pl-3 space-y-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const Sidebar = () => {
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("accessToken");
  //   localStorage.removeItem("refreshToken");
  //   localStorage.removeItem("adminUser");
  //   navigate("/login");
  // };

  return (
    <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="h-24 flex items-center justify-center border-b border-slate-100 px-4">
        <img
          src={logo}
          alt="Logo"
          className="w-28 object-contain"
        />
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-3">
          Gym Management
        </p>

        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          path="/dashboard"
        />

        <SidebarItem
          icon={Users}
          label="Members"
          path="/members"
        />

        <SidebarItem
          icon={Building2}
          label="Branches"
          path="/branches"
        />

        <SidebarItem
          icon={Tag}
          label="Plans"
          path="/plans"
        />

        <SidebarItem
          icon={Contact}
          label="Staffs"
          path="/staffs"
        />

        <SidebarItem
          icon={ShoppingCart}
          label="Products"
          path="/products"
        />

        <SidebarItem
          icon={BadgeIndianRupee}
          label="Sales"
          path="/sales"
        />

        <SidebarDropdown
          icon={IndianRupee}
          label="Transactions"
          paths={["/transactions", "/transactions/profit"]}
        >
          {/* <SidebarItem
            icon={IndianRupee}
            label="Transactions"
            path="/transactions"
            className="text-[13px]"
          /> */}

          <SidebarItem
            icon={IndianRupee}
            label="Transaction"
            path="/transaction"
            className="text-[13px]"
          />


          <SidebarItem
            icon={IndianRupee}
            label="Profit"
            path="/profit_loss"
            className="text-[13px]"
          />
        </SidebarDropdown>

        <SidebarItem
          icon={SearchCheck}
          label="Enquiry"
          path="/enquiry"
        />

        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mt-8 mb-3">
          System
        </p>

        <SidebarItem
          icon={Settings}
          label="Settings"
          path="/settings"
        />
      </nav>
    </aside>
  );
};

export default Sidebar;
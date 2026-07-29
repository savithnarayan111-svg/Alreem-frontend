import { useState } from "react";
import useBranches from "../hooks/Branches";
import useBranchMembers from "../hooks/Branch_members";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Phone,
} from "lucide-react";
import AlertMessage from "../Components/AlertMessage";
import ConfirmActionModal from "../Components/ConfirmActionModal";
import Branch_members from "../Components/Branch_members";

export default function Branches() {
  const { branches, addBranch, editBranch, removeBranch } = useBranches();
  const { members, fetchBranchMembers } = useBranchMembers();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showBranchModal, setShowBranchModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const openBranchModal = async (branch) => {
    setSelectedBranch(branch);

    await fetchBranchMembers(branch.id);

    setShowBranchModal(true);
  };

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

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    manager_name: "",
    capacity: "",
  });

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

  // OPEN ADD
  const openAdd = () => {
    setEditing(null);
    setFormData({
      name: "",
      phone: "",
      location: "",
      manager_name: "",
      capacity: "",
    });
    setShowForm(true);
  };

  // OPEN EDIT
  const openEdit = (branch) => {
    setEditing(branch);
    setFormData({
      name: branch.name,
      phone: branch.phone,
      location: branch.location,
      manager_name: branch.manager_name || "",
      capacity: branch.capacity || "",
    });
    setShowForm(true);
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  // SUBMIT
  const handleSubmit = () => {
    if (editing) {
      openConfirmModal({
        title: "Update Branch",
        message: `Are you sure you want to update ${formData.name || "this branch"}?`,
        confirmText: "Update",
        type: "edit",
        successMessage: "Branch updated successfully!",
        action: async () => {
          await editBranch(editing.id, formData);

          closeForm();
          setFormData({
            name: "",
            phone: "",
            location: "",
            manager_name: "",
            capacity: "",
          });
        },
      });
    } else {
      openConfirmModal({
        title: "Add Branch",
        message: `Are you sure you want to add ${formData.name || "this branch"}?`,
        confirmText: "Save",
        type: "create",
        successMessage: "Branch added successfully!",
        action: async () => {
          await addBranch(formData);

          closeForm();
          setFormData({
            name: "",
            phone: "",
            location: "",
            manager_name: "",
            capacity: "",
          });
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold text-slate-900">Branches</h1>

        <button
          onClick={openAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Add Branch
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-white p-6 rounded-xl border border-slate-300 shadow-2xl">
            <div className="flex justify-between mb-6">
              <h2 className="font-bold text-lg">
                {editing ? "Update Branch" : "New Branch"}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                placeholder="Branch Name"
                className="border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })} />

              <input
                placeholder="Phone"
                className="border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })} />

              <input
                placeholder="Manager Name"
                className="border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.manager_name}
                onChange={(e) =>
                  setFormData({ ...formData, manager_name: e.target.value })} />

              <input
                placeholder="Capacity"
                className="border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })} />

              <input
                placeholder="Location"
                className="border-slate-300 shadow-md p-2 rounded md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })} />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  onClick={closeForm}
                  className="border bordertext-black px-4 py-2 rounded">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded">
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div
            key={b.id}
            onClick={() => openBranchModal(b)}
            className="bg-white p-6 rounded-xl border-slate-300 shadow-md shadow-md"
          >
            <div className="flex justify-between">
              <Building2 />

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(b);
                  }}
                  className="p-2 rounded-md hover:bg-green-100"
                >
                  <Edit2 size={16} className="text-green-600" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();

                    openConfirmModal({
                      title: "Delete Branch",
                      message: `Are you sure you want to delete ${b.name}?`,
                      confirmText: "Delete",
                      type: "delete",
                      successMessage: "Branch deleted successfully!",
                      action: async () => {
                        await removeBranch(b.id);
                      },
                    });

                  }}
                  className="p-2 rounded-md hover:bg-red-100"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-4">{b.name}</h3>

            <div className="mt-3 text-sm text-slate-600 space-y-2">
              <div className="flex gap-2">
                <MapPin size={14} /> {b.location}
              </div>

              <div className="flex gap-2">
                <Phone size={14} /> {b.phone}
              </div>

              <div>{b.manager_name}</div>
              <div>Capacity: {b.capacity}</div>
            </div>

            <div className="mt-4 text-xs text-slate-400">
              ID: {b.id}
            </div>
          </div>
        ))}
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

      <Branch_members
        isOpen={showBranchModal}
        onClose={() => {
          setShowBranchModal(false);
          setSelectedBranch(null);
        }}
        branch={selectedBranch}
        members={members}
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
}
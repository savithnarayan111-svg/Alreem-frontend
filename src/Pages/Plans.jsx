import { useState } from "react";
import usePlans from "../hooks/plans";
import { Plus, Edit2, Trash2 } from "lucide-react";
import AlertMessage from "../Components/AlertMessage";
import ConfirmActionModal from "../Components/ConfirmActionModal";

export default function Plans() {
  const { plans, addPlan, editPlan, removePlan } = usePlans();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

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
    price: "",
    duration: "",
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
      price: "",
      duration: "",
    });
    setShowForm(true);
  };

  // OPEN EDIT
  const openEdit = (plan) => {
    setEditing(plan);
    setFormData({
      name: plan.name || "",
      price: plan.price || "",
      duration: plan.duration || "",
    });
    setShowForm(true);
  };

  // CLOSE FORM
  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    setFormData({
      name: "",
      price: "",
      duration: "",
    });
  };

  // SUBMIT
  const handleSubmit = () => {
    if (editing) {
      openConfirmModal({
        title: "Update Plan",
        message: `Are you sure you want to update ${formData.name || "this plan"}?`,
        confirmText: "Update",
        type: "edit",
        successMessage: "Plan updated successfully!",
        action: async () => {
          await editPlan(editing.id, formData);
          closeForm();
        },
      });
    } else {
      openConfirmModal({
        title: "Add Plan",
        message: `Are you sure you want to add ${formData.name || "this plan"}?`,
        confirmText: "Save",
        type: "create",
        successMessage: "Plan added successfully!",
        action: async () => {
          await addPlan(formData);
          closeForm();
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <h1 className="text-2xl font-bold">Plans</h1>

        <button
          onClick={openAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
        >
          <Plus size={18} /> Add Plan
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white p-6 rounded-xl border border-slate-300 shadow-2xl">
            <h2 className="font-bold text-lg mb-4">
              {editing ? "Update Plan" : "New Plan"}
            </h2>

            <div className="flex flex-col gap-4">
              <input
                placeholder="Plan Name"
                className="border border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                placeholder="Price"
                className="border border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
              />

              <input
                placeholder="Duration (months/days)"
                className="border border-slate-300 shadow-md p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />

              <div className="md:col-span-2 flex justify-end gap-3">
                <button onClick={closeForm}>
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {editing ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="bg-white p-6 rounded-xl border border-slate-300 shadow-md"
          >
            <div className="flex justify-between">
              <h3 className="font-bold">{p.name}</h3>

              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-md hover:bg-green-100"
                >
                  <Edit2 size={16} className="text-green-600" />
                </button>

                <button
                  onClick={() => {
                    openConfirmModal({
                      title: "Delete Plan",
                      message: `Are you sure you want to delete ${p.name}?`,
                      confirmText: "Delete",
                      type: "delete",
                      successMessage: "Plan deleted successfully!",
                      action: async () => {
                        await removePlan(p.id);
                      },
                    });
                  }}
                  className="p-2 rounded-md hover:bg-red-100"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>

            <div className="mt-4 font-semibold">
              ₹{p.price} / {p.duration} days
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
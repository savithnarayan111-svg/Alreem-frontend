import ConfirmActionModal from "../../Components/ConfirmActionModal"
import AlertMessage from "../../Components/AlertMessage";
import { useState } from "react";

const SellProductModal = ({
    open,
    onClose,
    selectedProduct,
    sellData,
    setSellData,
    memberError,
    quantityerror,
    memberName,
    onCheckMember,
    onCheckQuantity,
    onSell,
}) => {
    const [showConfirm, setShowConfirm] = useState(false);

    if (!open || !selectedProduct) return null;

    const handleOpenConfirm = () => {
        setShowConfirm(true);
    };

    const handleConfirmSell = async () => {
        await onSell();
        setShowConfirm(false);
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">Sell Product</h2>
                        <button onClick={onClose}>✕</button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">
                                Member ID
                            </label>

                            <input
                                type="text"
                                placeholder="0011"
                                value={sellData.member_id}
                                onChange={(e) =>
                                    setSellData({
                                        ...sellData,
                                        member_id: e.target.value,
                                    })
                                }
                                onBlur={onCheckMember}
                                className="w-full border border-slate-300 rounded-lg p-2"
                            />
                            {memberName && (
                                <p className="text-green-600 text-sm mt-1">
                                    {memberName}
                                </p>
                            )}

                            {memberError && (
                                <p className="text-red-500 text-sm mt-1">
                                    {memberError}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Quantity
                            </label>

                            <input
                                type="number"
                                min="1"
                                value={sellData.quantity}
                                onChange={(e) =>
                                    setSellData({
                                        ...sellData,
                                        quantity: Number(e.target.value),
                                    })
                                }
                                onBlur={onCheckQuantity}
                                className="w-full border border-slate-300 rounded-lg p-2"
                            />
                            {quantityerror && (
                                <p className="text-red-500 text-sm mt-1">
                                    {quantityerror}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                payment_method
                            </label>

                            <select
                                value={sellData.payment_method}
                                onChange={(e) =>
                                    setSellData({
                                        ...sellData,
                                        payment_method: e.target.value,
                                    })
                                }
                                className="w-full border border-slate-300 rounded-lg p-2"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                                <option value="wallet">Wallet</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Unit Price
                            </label>

                            <input
                                value={selectedProduct?.price || ""}
                                readOnly
                                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">
                                Total Amount
                            </label>

                            <input
                                value={
                                    (selectedProduct?.price || 0) *
                                    (sellData.quantity || 0)
                                }
                                readOnly
                                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-100"
                            />
                        </div>

                        <div className="text-sm text-slate-500">
                            Current Stock: {selectedProduct?.stock}
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-slate-300 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={!!memberError || !!quantityerror}
                                onClick={handleOpenConfirm}
                                className={`px-4 py-2 rounded-lg text-white ${memberError || quantityerror
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600"
                                    }`}
                            >
                                Sell
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showConfirm && (
                <ConfirmActionModal
                    isOpen={showConfirm}
                    title="Confirm Sale"
                    message="Are you sure you want to complete this sale?"
                    confirmText="Sell"
                    cancelText="Cancel"
                    type="add"
                    onConfirm={handleConfirmSell}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </>
    );
};

export default SellProductModal;
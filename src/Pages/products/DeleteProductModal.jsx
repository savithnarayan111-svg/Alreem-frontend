import React from "react";
import ConfirmActionModal from "../../Components/ConfirmActionModal"


const DeleteProductModal = ({
    open,
    onClose,
    onConfirm,
}) => {
    if (!open) return null;

    return (
        <ConfirmActionModal
            isOpen={open}
            title="Delete Product"
            message="Are you sure you want to delete this product?"
            confirmText="Delete"
            cancelText="Cancel"
            type="delete"
            onConfirm={onConfirm}
            onCancel={onClose}
        />
    );
};

export default DeleteProductModal;
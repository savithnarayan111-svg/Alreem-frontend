import React, { useEffect } from "react";

const AlertMessage = ({
    show,
    message,
    type = "success", // success | error | warning
    onClose,
}) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose?.();
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    const styles = {
        success: "bg-green-100 border-green-500 text-green-700",
        error: "bg-red-100 border-red-500 text-red-700",
        warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    };

    return (
        <div className="fixed top-5 right-5 z-[60]">
            <div
                className={`min-w-[280px] rounded-xl border-l-4 px-4 py-3 shadow-lg ${styles[type]}`}
            >
                <p className="font-medium">{message}</p>
            </div>
        </div>
    );
};

export default AlertMessage;
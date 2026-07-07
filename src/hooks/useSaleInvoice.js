import { useState } from "react";
import { sellProduct, One_sale } from "../api/getSales";

export const useSaleInvoice = () => {
    const [saleModal, setSaleModal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const createSale = async ({
        product_id,
        member_id,
        quantity,
        payment_method,
    }) => {
        try {
            setLoading(true);
            setError("");

            const res = await sellProduct({
                product_id,
                member_id,
                quantity,
                payment_method,
            });

            const saleId = res.data.sale_id;

            const saleRes = await One_sale(saleId);

            setSaleModal(saleRes.data);

            return saleRes.data;
        } catch (err) {
            console.log(err);
            setError("Failed to create sale");
        } finally {
            setLoading(false);
        }
    };

    const closeSaleModal = () => {
        setSaleModal(null);
    };

    return {
        saleModal,
        loading,
        error,
        createSale,
        closeSaleModal,
    };
};
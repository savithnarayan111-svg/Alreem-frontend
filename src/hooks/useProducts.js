import { useEffect, useState } from "react";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../api/products";

export default function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // FETCH
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await getProducts();
            setProducts(res.data);
        } catch (err) {
            console.error("Fetch products error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // CREATE
    const addProduct = async (data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("category", data.category);
        formData.append("price", data.price);
        formData.append("stock", data.stock);

        if (data.image) {
            formData.append("image", data.image);
        }

        await createProduct(formData);
        await fetchProducts();
    };

    // UPDATE
    const editProduct = async (id, data) => {
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("stock", data.stock);
        formData.append("category", data.category);

        if (data.image instanceof File) {
            formData.append("image", data.image);
        }

        await updateProduct(id, formData);
        await fetchProducts();
    };

    // DELETE
    const removeProduct = async (id) => {
        await deleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return {
        products,
        loading,
        fetchProducts,
        addProduct,
        editProduct,
        removeProduct,
    };
}
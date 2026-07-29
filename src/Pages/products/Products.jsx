import React, { useRef, useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import useProducts from "../../hooks/useProducts";
import { validateMember } from "../../api/getSales";
import { useSaleInvoice } from "../../hooks/useSaleInvoice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ProductFormModal from "./ProductFormModal";
import DeleteProductModal from "./DeleteProductModal";
import SellProductModal from "./SellProductModal";
import Invoice2 from "../Invoice2";
import AlertMessage from "../../Components/AlertMessage"

const Products = () => {
    const {
        products,
        addProduct,
        editProduct,
        removeProduct,
        fetchProducts,
    } = useProducts();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [priceSort, setPriceSort] = useState("");
    const [stockSort, setStockSort] = useState("");

    const [showFormModal, setShowFormModal] = useState(false);
    const [editing, setEditing] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const [showSellModal, setShowSellModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [sellData, setSellData] = useState({
        member_id: "",
        quantity: 1,
        payment_method: "cash",
    });

    const [memberError, setMemberError] = useState("");
    const [quantityerror, setQuantityerror] = useState("");
    const [memberName, setMemberName] = useState("");

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const invoiceRef = useRef();

    const { saleModal, createSale, closeSaleModal } = useSaleInvoice();

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertOpen(true);
    };

    const filteredProducts = products
        .filter((p) => {
            const matchesCategory =
                category === "all" ||
                p.category?.toLowerCase() === category;

            const matchesSearch =
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                String(p.id).includes(search);

            return matchesCategory && matchesSearch;
        })
        .sort((a, b) => {
            const priceA = Number(a.price) || 0;
            const priceB = Number(b.price) || 0;
            const stockA = Number(a.stock) || 0;
            const stockB = Number(b.stock) || 0;

            if (priceSort) {
                return priceSort === "low"
                    ? priceA - priceB
                    : priceB - priceA;
            }

            if (stockSort) {
                return stockSort === "low"
                    ? stockA - stockB
                    : stockB - stockA;
            }

            return 0;
        });

    const openAdd = () => {
        setEditing(null);
        setShowFormModal(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setShowFormModal(true);
    };

    const handleSaveProduct = async (formData) => {
        try {
            if (editing) {
                await editProduct(editing.id, formData);
                showAlert("Product updated successfully!");
            } else {
                await addProduct(formData);
                showAlert("Product added successfully!");
            }

            setShowFormModal(false);
            setEditing(null);
        } catch (err) {
            console.error(err);
            showAlert(editing ? "Failed to update product!" : "Failed to add product!");
        }
    };

    const handleDelete = async () => {
        try {
            await removeProduct(selectedProductId);
            showAlert("Product deleted successfully!");
            setShowDeleteModal(false);
            setSelectedProductId(null);
        } catch (err) {
            console.error(err);
            showAlert("Failed to delete product!");
        }
    };

    const checkMember = async () => {
        try {
            const res = await validateMember(sellData.member_id);

            if (res.data.exists) {
                setMemberError("");
                setMemberName(res.data.member_name);
            } else {
                setMemberError("Invalid Member ID");
                setMemberName("");
            }
        } catch (error) {
            console.error(error);
            setMemberError("Unable to verify member");
            setMemberName("");
        }
    };

    const checkQuantity = () => {
        if (sellData.quantity > selectedProduct.stock) {
            setQuantityerror(`Only ${selectedProduct.stock} item(s) available`);
        } else {
            setQuantityerror("");
        }
    };

    const handleSell = async () => {
        try {
            const invoiceData = await createSale({
                product_id: selectedProduct.id,
                member_id: sellData.member_id,
                quantity: sellData.quantity,
                payment_method: sellData.payment_method || "cash",
            });

            if (invoiceData) {
                await fetchProducts(); // refresh stock immediately

                showAlert("Sale completed");

                setShowSellModal(false);
                setSellData({
                    member_id: "",
                    quantity: 1,
                    payment_method: "cash",
                });
                setMemberError("");
                setQuantityerror("");
                setMemberName("");
            }
        } catch (error) {
            console.error(error);
            showAlert("Failed to complete sale");
        }
    };

    const downloadInvoice = async () => {
        try {
            const element = invoiceRef.current;

            if (!element) {
                console.log("Invoice ref not found");
                return;
            }

            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${saleModal?.invoice_no || "invoice"}.pdf`);
        } catch (err) {
            console.error("PDF Error", err);
        }
    };

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Products</h1>

                <div className="flex items-center gap-5">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="appearance-none bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer">
                        <option value="all">All</option>
                        <option value="supplements">Supplements</option>
                        <option value="equipment">Equipment</option>
                        <option value="accessories">Gym Accessories</option>
                        <option value="apparel">Gym Apparel</option>
                        <option value="footwear">Footwear</option>
                        <option value="nutrition">Nutrition & Drinks</option>
                        <option value="other">Other</option>


                    </select>

                    <select
                        value={priceSort}
                        onChange={(e) => {
                            setPriceSort(e.target.value);
                            if (e.target.value) setStockSort("");
                        }}
                        className="appearance-none bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer">
                        <option value="">Price</option>
                        <option value="low">Low → High</option>
                        <option value="high">High → Low</option>
                    </select>

                    <select
                        value={stockSort}
                        onChange={(e) => {
                            setStockSort(e.target.value);
                            if (e.target.value) setPriceSort("");
                        }}
                        className="appearance-none bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition cursor-pointer">
                        <option value="">Stock</option>
                        <option value="low">Low → High</option>
                        <option value="high">High → Low</option>
                    </select>

                    <div className="bg-white shadow-sm border border-slate-200 rounded-lg px-3 py-2 flex items-center gap-2 w-72 focus-within:ring-2 focus-within:ring-blue-500 transition">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full outline-none text-sm text-slate-700 placeholder-slate-400 bg-transparent" />
                    </div>

                    <button
                        onClick={openAdd}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={16} />
                        Add
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                    <div
                        key={p.id}
                        className={`p-6 rounded-xl shadow transition ${Number(p.stock) === 0
                            ? "bg-gray-300 text-gray-500"
                            : "bg-white"
                            }`}>
                        <h3 className="text-xl font-bold">{p.name}</h3>

                        {p.image && (
                            <img
                                src={p.image}
                                alt={p.name}
                                className={`w-full h-48 object-cover rounded-lg mt-2 ${Number(p.stock) === 0
                                    ? "grayscale opacity-50"
                                    : ""
                                    }`} />
                        )}

                        <p className="text-slate-600 mt-2">{p.description}</p>
                        <p className="mt-2 text-sm">{p.category}</p>

                        <div className="flex justify-between mt-4">
                            <p className="font-bold">₹{p.price}</p>
                            <p className="text-sm">Stock: {p.stock}</p>
                        </div>

                        <div className="flex justify-between mt-5">
                            {Number(p.stock) === 0 ? (
                                <>
                                    <span className="text-red-600 font-semibold">
                                        Out of Stock
                                    </span>

                                    <button
                                        className="p-2 rounded-md hover:bg-red-100"
                                        onClick={() => {
                                            setSelectedProductId(p.id);
                                            setShowDeleteModal(true);
                                        }}>
                                        <Trash2 size={16} className="text-red-600" />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setShowSellModal(true);
                                            setSellData({
                                                member_id: "",
                                                quantity: 1,
                                                payment_method: "cash",
                                            });
                                            setMemberError("");
                                            setQuantityerror("");
                                            setMemberName("");
                                        }}
                                        className="px-8 py-2 rounded text-white bg-blue-500">
                                        Sell
                                    </button>

                                    <div className="flex gap-2">
                                        <button
                                            className="p-2 rounded-md hover:bg-green-100"
                                            onClick={() => openEdit(p)}>
                                            <Edit2 size={16} className="text-green-600" />
                                        </button>

                                        <button
                                            className="p-2 rounded-md hover:bg-red-100"
                                            onClick={() => {
                                                setSelectedProductId(p.id);
                                                setShowDeleteModal(true);
                                            }}>
                                            <Trash2 size={16} className="text-red-600" />
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showFormModal && (
                <ProductFormModal
                    open={showFormModal}
                    onClose={() => {
                        setShowFormModal(false);
                        setEditing(null);
                    }}
                    onSubmit={handleSaveProduct}
                    editing={editing} />
            )}

            {showDeleteModal && (
                <DeleteProductModal
                    open={showDeleteModal}
                    onClose={() => {
                        setShowDeleteModal(false);
                        setSelectedProductId(null);
                    }}
                    onConfirm={handleDelete} />
            )}

            {showSellModal && selectedProduct && (
                <SellProductModal
                    open={showSellModal}
                    onClose={() => setShowSellModal(false)}
                    selectedProduct={selectedProduct}
                    sellData={sellData}
                    setSellData={setSellData}
                    memberError={memberError}
                    quantityerror={quantityerror}
                    memberName={memberName}
                    onCheckMember={checkMember}
                    onCheckQuantity={checkQuantity}
                    onSell={handleSell} />
            )}

            {saleModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeSaleModal} />

                    <div className="relative w-[420px] bg-white rounded-xl shadow-xl p-6 text-center">
                        <div className="text-2xl my-5">Sale Successful</div>

                        <p className="text-gray-600 mb-4">
                            Your sale is succesful
                        </p>

                        <div className="flex flex-col gap-2">
                            <button
                                onClick={downloadInvoice}
                                className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
                                Download Invoice
                            </button>

                            <button
                                onClick={closeSaleModal}
                                className="bg-blue-500 text-white py-2 rounded-md">
                                OK
                            </button>

                            <button
                                onClick={closeSaleModal}
                                className="text-gray-500 text-sm mt-1 hover:text-black">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {saleModal && (
                <div
                    style={{
                        position: "absolute",
                        left: "-9999px",
                        top: "0",
                        width: "800px",
                        background: "#fff",
                        zIndex: -1,
                    }}>
                    <Invoice2
                        ref={invoiceRef}
                        sale={{
                            id: saleModal.id,
                            invoice_no: saleModal.invoice_no,
                            member_id: saleModal.member_id,
                            member_name: saleModal.member_name,
                            total_amount: saleModal.total_amount,
                            sold_at: saleModal.sold_at,
                            payment_method: saleModal.payment_method,
                            items: [
                                {
                                    product_name: saleModal.product,
                                    quantity: saleModal.quantity,
                                    price: saleModal.unit_price,
                                    subtotal: saleModal.total_amount,
                                },
                            ],
                        }}
                    />
                </div>
            )}

            <AlertMessage
                show={alertOpen}
                message={alertMessage}
                type="success"
                onClose={() => setAlertOpen(false)}
            />
        </div>
    );
};

export default Products;
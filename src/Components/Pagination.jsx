import React from "react";

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage = 10,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Build page numbers with ellipsis for large sets
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible + 2) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }

        pages.push(1);

        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) end = 4;
        if (currentPage >= totalPages - 2) start = totalPages - 3;

        if (start > 2) pages.push("...");
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push("...");

        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
                Showing {startItem}–{endItem} of {totalItems}
            </p>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md text-sm border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                    Prev
                </button>

                {getPageNumbers().map((page, idx) =>
                    page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-sm text-slate-400">
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-md text-sm ${currentPage === page
                                    ? "bg-blue-500 text-white font-semibold"
                                    : "border border-slate-300 hover:bg-slate-50"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md text-sm border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
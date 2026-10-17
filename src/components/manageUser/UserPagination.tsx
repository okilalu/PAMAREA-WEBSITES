import React from "react";

interface UserPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemPerPage: number;
  onPageChange: (page: number) => void;
}

const UserPagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemPerPage,
  onPageChange,
}: UserPaginationProps) => {
  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemPerPage + 1;

  const endIndex = Math.min(currentPage * itemPerPage, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-xs text-gray-500">
        Menampilkan{" "}
        <span className="font-medium text-gray-700">{startIndex}</span> -{" "}
        <span className="font-medium text-gray-700">{endIndex}</span> dari{" "}
        <span className="font-medium text-gray-700">{totalItems}</span> personel
      </div>

      <div className="join">
        <button
          type="button"
          className="join-item btn btn-sm"
          disabled={currentPage <= 1 || totalPages === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          «
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              aria-current={currentPage === page ? "page" : undefined}
              className={`join-item btn btn-sm ${
                currentPage === page
                  ? "border-[#003B73] bg-[#003B73] text-white"
                  : "bg-white text-gray-700"
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="join-item btn btn-sm"
          disabled={totalPages === 0 || currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default UserPagination;

import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  currentPage?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 6,
  onPageChange = () => {},
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-3  text-sm font-medium">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1 || totalItems === 0}
        className={`p-1 border rounded ${
          currentPage === 1 || totalItems === 0
            ? "text-[#7d7d7d]0 border-gray-300 cursor-not-allowed"
            : "text-primary border-primary"
        }`}
      >
        <IoIosArrowBack />
      </button>

      <span>
        {startItem} - {endItem} of {totalItems}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages || totalItems === 0}
        className={`p-1 border rounded ${
          currentPage === totalPages || totalItems === 0
            ? "text-[#7d7d7d] border-gray-300 cursor-not-allowed"
            : "text-primary border-primary"
        }`}
      >
        <IoIosArrowForward />
      </button>
    </div>
  );
};

export default Pagination;

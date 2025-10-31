import React from "react";
import { LuSearch } from "react-icons/lu";

interface TargetTableProps {
  titles?: string[];
  data?: any[];
  handleGoToDetail?: (id: any) => void;
  height?: string | number;
  show?: string;
}

const TargetTable: React.FC<TargetTableProps> = ({
  titles,
  data,
  handleGoToDetail,
  height,
  show,
}) => {
  return (
    <div
      style={{ height: height ? height : "auto" }}
      className="w-full flex-1 overflow-x-auto"
    >
      <table className="w-full border-collapse min-w-[900px]">
        <thead className="sticky top-0 z-[1] bg-white">
          <tr className="border-b border-primary text-left text-[13px] font-semibold text-heading">
            <th className="px-4 py-3 w-[16%]">
              <div className="relative flex items-center">
                <LuSearch className="absolute left-2 text-gray-500" size={14} />
                <div className="absolute left-7 border-r-[1px] border-gray-400 pr-2 text-xs font-medium text-gray-600">
                  SKU
                </div>
                <input
                  type="text"
                  placeholder="Search SKU..."
                  className="h-8 pl-20 pr-3 w-full border border-gray-400 rounded-md text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </th>
            <th className="px-4 py-3 w-[18%]">
              <div className="relative flex items-center">
                <LuSearch className="absolute left-2 text-gray-500" size={14} />
                <div className="absolute left-7 border-r-[1px] border-gray-400 pr-2 text-xs font-medium text-gray-600">
                  Product
                </div>
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="h-8 pl-24 pr-3 w-full border border-gray-400 rounded-md text-sm text-gray-800 focus:outline-none"
                />
              </div>
            </th>
            <th className="px-4 py-3 w-[14%]">Form</th>
            <th className="px-4 py-3 w-[14%]">Status</th>
            <th className="px-4 py-3 w-[14%]">Target</th>
            <th className="px-4 py-3 w-[14%]">Achievement</th>
            <th className="px-4 py-3 w-[10%]">Action</th>
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#E5EBF7] border-b border-primary text-[13px] text-heading transition-colors"
                style={{ cursor: show ? show : "pointer" }}
                onClick={() => handleGoToDetail && handleGoToDetail(rowIndex)}
              >
                {row.map((cell: any, colIndex: number) =>
                  cell === null ? null : (
                    <td
                      key={colIndex}
                      className="px-4 py-3 whitespace-nowrap break-words"
                    >
                      {cell}
                    </td>
                  )
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={titles?.length || 7}
                className="px-3 py-6 text-center text-heading"
              >
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TargetTable;

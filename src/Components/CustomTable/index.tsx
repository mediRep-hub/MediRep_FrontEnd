import React from "react";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";
import "./customTable.css";

const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
);

interface CustomTableProps {
  titles?: string[];
  data?: any[][];
  handleGoToDetail?: (row: any) => void;
  height?: string | number;
  isFetching?: boolean;
  titleswidth?: string;
  datawidth?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  titles,
  data,
  handleGoToDetail,
  height,
  titleswidth,
  datawidth,
  isFetching,
}) => {
  const scrollable = titles && titles.length > 7;

  return (
    <div
      style={{ height: height ? height : "auto" }}
      className="flex-1 overflow-x-auto custom-scrollbar"
    >
      <div
        style={{
          minWidth: scrollable ? `${titles!.length * 150}px` : "100%",
        }}
      >
        <table className="w-full border-collapse table-auto">
          <thead className="sticky top-0 bg-white z-10 h-14">
            <tr>
              {titles?.map((title, index) => (
                <th
                  key={index}
                  style={{ width: titleswidth }}
                  className="border-b border-[#0755E9] px-5 py-2 text-[12px] font-medium text-[#131313] text-left break-words"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td
                  colSpan={titles?.length || 7}
                  className="py-5 text-center text-[#7D7D7D]"
                >
                  <Spin indicator={antIcon} />
                </td>
              </tr>
            ) : data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-[#E5EBF7] h-14 hover:text-black cursor-pointer"
                  style={{ cursor: "pointer", width: datawidth }}
                  onClick={() => handleGoToDetail?.(row)}
                >
                  {row.map((cell: any, colIndex: number) =>
                    cell !== null ? (
                      <td
                        key={colIndex}
                        className="px-5 py-2 border-b-[0.5px] border-[#0755E9] min-w-max  text-[13px] font-normal text-[#131313] break-words"
                      >
                        {cell}
                      </td>
                    ) : null,
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={titles?.length || 7}
                  className="px-3 py-6 text-center text-[#131313]"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomTable;

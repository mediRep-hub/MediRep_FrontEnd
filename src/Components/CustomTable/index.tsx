import React from "react";
import { Spin } from "antd";
import { Loading3QuartersOutlined } from "@ant-design/icons";

const antIcon = (
  <Loading3QuartersOutlined style={{ fontSize: 50, color: "#0755E9" }} spin />
);

interface CustomTableProps {
  titles?: string[];
  data?: any[][];
  handleGoToDetail?: (id: any) => void;
  height?: string | number;
  show?: string;
  isFetching?: boolean;
}

const CustomTable: React.FC<CustomTableProps> = ({
  titles,
  data,
  handleGoToDetail,
  height,
  show,
  isFetching,
}) => {
  return (
    <div style={{ height: height ? height : "auto" }} className="w-full flex-1">
      <table className="w-full border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-[1] h-[56px] bg-white">
          <tr>
            {titles?.map((title, index) => (
              <th
                key={index}
                className="border-b border-primary px-5 py-2 text-[12px] font-medium text-heading text-left bg-white whitespace-nowrap"
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
                className="hover:bg-[#E5EBF7]  h-[56px] hover:text-black cursor-pointer"
                style={{ cursor: show ? show : "pointer" }}
                onClick={() => handleGoToDetail?.(rowIndex)}
              >
                {row.map((cell: any, colIndex: number) =>
                  cell !== null ? (
                    <td
                      key={colIndex}
                      className="px-5 py-2  border-b-[0.5px] border-primary text-[13px] font-normal text-heading break-words"
                    >
                      {cell}
                    </td>
                  ) : null
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

export default CustomTable;

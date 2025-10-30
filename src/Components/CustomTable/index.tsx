import React from "react";
interface CustomTableProps {
  titles?: string[];
  data?: any[];
  handleGoToDetail?: (id: any) => void;
  headerWidth?: string;
  itemWidth?: string;
  height?: string | number;
  show?: string;
}

const CustomTable: React.FC<CustomTableProps> = ({
  titles,
  data,
  handleGoToDetail,
  headerWidth,
  itemWidth,
  height,
  show,
}) => {
  return (
    <div
      style={{
        height: height ? height : "auto",
      }}
      className="w-full flex-1  "
    >
      <table className="w-full border-collapse min-w-[800px]">
        <thead className="sticky top-0 z-[1] h-[56px] bg-white">
          <tr className="pl-5">
            {titles?.map((title, index) => (
              <th
                key={index}
                className="border-b border-primary px-5 py-2 text-[12px] font-medium leading-[14px] tracking-[-0.25px] text-heading bg-white text-left"
                style={{ width: headerWidth }}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-[#E5EBF7] h-[56px] hover:text-black cursor-pointer"
                style={{ cursor: show ? show : "pointer" }}
                onClick={() => handleGoToDetail && handleGoToDetail(rowIndex)}
              >
                {row.map((cell: any, colIndex: number) =>
                  cell === null ? null : (
                    <td
                      key={colIndex}
                      className=" px-5 py-2 border-b-[0.5px] border-primary text-[12px] font-normal text-heading break-words"
                      style={{ width: itemWidth }}
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
                colSpan={titles?.length}
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

import React from "react";

interface Column {
  label: string;
  rowSpan?: number;
  colSpan?: number;
  children?: string[];
}

interface Props {
  columns: Column[];
  data: any[][];
}

const GroupedTable: React.FC<Props> = ({ columns, data }) => {
  return (
    <div className="w-full overflow-y-auto h-full rounded-xl border border-[#dbe3f3]">
      <table className="min-w-max border-collapse">
        {/* HEADER */}
        <thead>
          {/* Top Header */}
          <tr className="bg-[#f5f7fb]">
            {columns.map((col, index) => (
              <th
                key={index}
                rowSpan={col.rowSpan || 1}
                colSpan={col.colSpan || 1}
                className="sticky top-0 z-20 bg-[#f5f7fb] text-[13px] font-semibold text-center px-4 py-3 border-b border-[#dbe3f3]"
              >
                {col.label}
              </th>
            ))}
          </tr>

          {/* Sub Header */}
          <tr className="bg-[#f9fbff]">
            {columns
              .filter((col) => col.children)
              .flatMap((col) =>
                col.children!.map((child, idx) => (
                  <th
                    key={idx}
                    className="sticky top-[48px] z-10 bg-[#f9fbff] text-[12px] font-medium text-center px-8 py-2 border-b border-[#dbe3f3]"
                  >
                    {child}
                  </th>
                )),
              )}
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {data.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-[#eef4ff] transition-all duration-150"
            >
              {row.map((cell, j) => {
                return (
                  <td
                    key={j}
                    className="text-[13px] px-4 py-3 border-b border-[#edf1fa] text-center"
                  >
                    {cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GroupedTable;

import { useState } from "react";
import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import CustomTable from "../../Components/CustomTable";

type QtyValue = { qty: number; value: number };

type RowData = [
  string, // SKU
  string, // Product
  number, // Opening Balance
  number, // Purchase
  number, // Purchase-Ret
  number, // Sale
  number, // Sale-Ret
  QtyValue, // Net Sale
  QtyValue, // Closing Stock
];

const titles = [
  "SKU",
  "Product",
  "Opening Balance Qty(CTN)",
  "Purchase Qty(CTN)",
  "Purchase-Ret Qty(CTN)",
  "Sale Qty (CTN)",
  "Sale-Ret Qty (CTN)",
  "Net Sale Qty/Value",
  "Closing Stock Qty/Value",
];

const tableData: RowData[] = [
  [
    "SKU001",
    "Paracetamol 500mg",
    10,
    5,
    1,
    7,
    0,
    { qty: 7, value: 1400 },
    { qty: 8, value: 1600 },
  ],
  [
    "SKU002",
    "Amoxicillin 250mg",
    15,
    10,
    2,
    12,
    1,
    { qty: 11, value: 2200 },
    { qty: 12, value: 2400 },
  ],
  [
    "SKU003",
    "Cough Syrup 100ml",
    20,
    5,
    0,
    10,
    2,
    { qty: 8, value: 1600 },
    { qty: 17, value: 3400 },
  ],
  [
    "SKU004",
    "Vitamin D 1000IU",
    8,
    12,
    1,
    9,
    0,
    { qty: 9, value: 900 },
    { qty: 11, value: 1100 },
  ],
  [
    "SKU005",
    "Ibuprofen 200mg",
    25,
    15,
    3,
    18,
    2,
    { qty: 16, value: 3200 },
    { qty: 21, value: 4200 },
  ],
];

export default function PrimarySale() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadExcel = () => {
    setIsDownloading(true);

    setTimeout(() => {
      try {
        const workbook = XLSX.utils.book_new();

        // Convert table data to JSON suitable for Excel
        const excelData = tableData.map((row) => ({
          SKU: row[0],
          Product: row[1],
          "Opening Balance Qty(CTN)": row[2],
          "Purchase Qty(CTN)": row[3],
          "Purchase-Ret Qty(CTN)": row[4],
          "Sale Qty (CTN)": row[5],
          "Sale-Ret Qty (CTN)": row[6],
          "Net Sale Qty": row[7].qty,
          "Net Sale Value": row[7].value,
          "Closing Stock Qty": row[8].qty,
          "Closing Stock Value": row[8].value,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Primary Sales");

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "Primary_Sales_Report.xlsx");
      } finally {
        setIsDownloading(false);
      }
    }, 0);
  };

  // Render table data for React
  const renderTableData = tableData.map((row) => [
    row[0],
    row[1],
    row[2],
    row[3],
    row[4],
    row[5],
    row[6],
    <div className="flex flex-col">
      <p>Qty: {row[7].qty}</p>
      <p>Rs: {row[7].value}</p>
    </div>,
    <div className="flex flex-col">
      <p>Qty: {row[8].qty}</p>
      <p>Rs: {row[8].value}</p>
    </div>,
  ]);

  return (
    <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start gap-4">
        <p className="text-heading font-medium text-[22px] lg:text-[24px]">
          Primary Sale
        </p>
        <div className="flex flex-wrap sm:flex-nowrap gap-4 items-center">
          <button
            onClick={handleDownloadExcel}
            disabled={isDownloading}
            className={`h-[55px] w-full min-w-[172px] rounded-[6px] gap-3 flex justify-center items-center ${
              isDownloading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#E5EBF7] cursor-pointer"
            }`}
          >
            {isDownloading ? (
              <p className="text-gray-600 font-medium">Downloading...</p>
            ) : (
              <>
                <Icon
                  icon="solar:download-linear"
                  height="24"
                  width="24"
                  color="#0755E9"
                />
                <p className="text-primary text-base font-medium">Download</p>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(70.5vh-0px)] xl:h-[calc(64vh-0px)] overflow-y-auto scrollbar-none"
      >
        <p className="text-[#7d7d7d] text-sm">
          Distributor Details Stock Report
        </p>
        <div
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="scroll-smooth bg-white rounded-xl 2xl:h-[calc(70.5vh-0px)] xl:h-[calc(53vh-0px)] mt-4 overflow-y-auto scrollbar-none"
        >
          <CustomTable titles={titles} data={renderTableData} />
        </div>
      </div>
    </div>
  );
}

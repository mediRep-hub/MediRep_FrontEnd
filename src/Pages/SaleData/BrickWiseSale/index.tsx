import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { useEffect, useState } from "react";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ReportFilterModalStatic from "../../../Components/ReportFilter";

const titles = [
  "Distributor_Code",
  "Distributor_Name",
  "Area",
  "Order_Dated ",
  "MR_ID",
  "MR_Name",
  "Brick_Name",
  "Pharmacy_Name",
  "Product_Name",
  "Quantity_Sold (Pack)",
  "Sales_Value",
];

const tableDataTitles = [
  [
    "DIS-11225",
    "Noorsons",
    "Punjab",
    "Sep 20,2025",
    "MR-007",
    "Paul Walker",
    "Canal Road",
    "Servaid, Johar Town",
    "Naunehal Baby Soap - 100 gm",
    "18",
    "1,854",
  ],
  [
    "DIS-11890",
    "Sami Traders",
    "Punjab",
    "Sep 21,2025",
    "MR-011",
    "John Cena",
    "Model Town",
    "D-Watson Pharmacy",
    "Naunehal Shampoo - 200 ml",
    "25",
    "3,450",
  ],
  [
    "DIS-12001",
    "Health Plus",
    "Sindh",
    "Sep 22,2025",
    "MR-015",
    "Chris Evans",
    "Gulshan",
    "Imtiaz Store",
    "Baby Lotion - 150 ml",
    "30",
    "4,800",
  ],
  [
    "DIS-12450",
    "Care Pharma",
    "Punjab",
    "Sep 23,2025",
    "MR-021",
    "Robert Downey",
    "DHA",
    "Servaid DHA",
    "Baby Powder - 100 gm",
    "40",
    "6,200",
  ],
];

export default function BrickWiseSale() {
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  useEffect(() => {
    document.title = "MediRep | Channel Wise Sale";
  }, []);

  const handleDownloadExcel = () => {
    const worksheetData = [titles, ...tableDataTitles];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Brick Wise Sale");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Brick_Wise_Sale_Report.xlsx");
  };
  useEffect(() => {
    document.title = "MediRep | Brick Wise Sale";
  }, []);
  return (
    <>
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
          <div className="flex w-full md:w-auto md:flex-nowrap flex-wrap items-center gap-4 ">
            <p className="text-heading font-medium text-[22px] sm:text-[24px]">
              Brick Wise Sale
            </p>
            <div className="md:w-[180px] w-full">
              <MonthYearPicker />
            </div>
          </div>

          <div className="flex flex-wrap w-full md:w-auto sm:flex-nowrap gap-4 items-center">
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] w-full md:w-[140px] lg:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              {" "}
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#0755E9"
              />
              <p className="text-primary font-medium">Download</p>
            </button>
            <button
              onClick={() => {
                setGenerateReport(true);
              }}
              className="h-[55px] w-full md:w-[170px] lg:w-[200px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="mingcute:add-fill"
                height="20"
                width="20"
                color="#fff"
              />
              <p className="text-white font-medium">Generate Reports</p>
            </button>
          </div>
        </div>{" "}
        <div className="bg-[#E5EBF7]  mt-4 rounded-[12px] p-4 2xl:h-[calc(75.5vh-0px)] lg:h-[calc(66vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d] leading-[100%]">
            Brick Wise Sale From Distributor
          </p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth mt-4 md:gap-0 gap-5 bg-white rounded-lg 2xl:h-[calc(69vh-0px)] xl:h-[calc(57vh-0px)] overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={titles} data={tableDataTitles} />
          </div>{" "}
        </div>
      </div>
      {generateReport && <ReportFilterModalStatic close={handleClose} />}
    </>
  );
}

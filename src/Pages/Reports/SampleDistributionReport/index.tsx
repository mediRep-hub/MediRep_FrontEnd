import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Products",
  "Quantity(pcs)",
];

export default function SampleDistributionReport() {
  const Data = [
    ["Sep 20,2025", "Omar Rosser", "Jaydon Carder", "Synflex", "02"],

    ["Sep 21,2025", "Aiden Brooks", "Lucas Henry", "Medcore", "05"],

    ["Sep 22,2025", "Liam Scott", "Ethan Miles", "Techline", "03"],

    ["Sep 23,2025", "Noah Parker", "Caleb Turner", "Infysoft", "04"],
  ];
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  const handleDownloadExcel = () => {
    const exportData = Data.map((row) =>
      row.map((cell: any) => {
        if (typeof cell === "object" && cell?.props) {
          if (cell.props.children) {
            if (Array.isArray(cell.props.children)) {
              return cell.props.children
                .map((child: any) =>
                  typeof child === "string"
                    ? child
                    : child.props?.children || "",
                )
                .join(" ");
            }
            return cell.props.children;
          }
          return "";
        }
        return cell;
      }),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([title, ...exportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Sample Distribution Report",
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Sample Distribution Report.xlsx");
  };

  return (
    <>
      {" "}
      <div className="bg-secondary md:h-[calc(100vh-129px)] h-auto rounded-[12px] p-4">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex w-full md:w-auto items-center gap-3">
            <p className="text-heading  font-medium text-[22px] sm:text-[24px]">
              Reports
            </p>
            <div className="w-full">
              <MonthYearPicker />
            </div>
          </div>
          <div className="flex flex-wrap w-full md:w-auto items-center gap-3">
            <button
              onClick={handleDownloadExcel}
              className="h-[55px] w-full md:w-[180px] bg-[#E5EBF7] rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
            >
              <Icon
                icon="solar:download-broken"
                height="24"
                width="24"
                color="#0755E9"
              />
              <p className="text-primary text-base font-medium">Download</p>
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
              <p className="text-white text-base font-medium">
                Generate Reports
              </p>
            </button>
          </div>
        </div>

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(64vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d]">Sample Distribution Report</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white mt-3 rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(54vh-0px)]  overflow-y-auto scrollbar-none"
          >
            <CustomTable titles={title} data={Data} />
          </div>
        </div>
      </div>
      {generateReport && (
        <>
          {" "}
          <>
            <ReportFilterModalStatic close={handleClose} />{" "}
          </>
        </>
      )}
    </>
  );
}

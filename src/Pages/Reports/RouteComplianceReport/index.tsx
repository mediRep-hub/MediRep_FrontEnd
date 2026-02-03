import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useState } from "react";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "MR Name",
  "Planned Route",
  "Actual Route",
  "Deviation",
  "Doctor Coverage",
  "Compliance %",
];
const Data = [
  [
    "Omar Rosser",
    <p className="text-primary underline">46</p>,
    <p className="text-primary underline">14</p>,
    <p className="text-primary underline">4</p>,
    "76 %",
    "82 %",
  ],

  [
    "Aiden Brooks",
    <p className="text-primary underline">39</p>,
    <p className="text-primary underline">18</p>,
    <p className="text-primary underline">6</p>,
    "71 %",
    "78 %",
  ],

  [
    "Liam Scott",
    <p className="text-primary underline">52</p>,
    <p className="text-primary underline">11</p>,
    <p className="text-primary underline">3</p>,
    "84 %",
    "89 %",
  ],

  [
    "Noah Parker",
    <p className="text-primary underline">44</p>,
    <p className="text-primary underline">16</p>,
    <p className="text-primary underline">5</p>,
    "79 %",
    "81 %",
  ],

  [
    "Ethan Miles",
    <p className="text-primary underline">48</p>,
    <p className="text-primary underline">13</p>,
    <p className="text-primary underline">2</p>,
    "88 %",
    "91 %",
  ],
];

export default function RouteComplianceReport() {
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  const handleDownloadExcel = () => {
    const exportData = Data.map((row) =>
      row.map((cell) => {
        if (typeof cell === "object" && cell.props) {
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
      "Route Compliance Report",
    );
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Route Compliance Report.xlsx");
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
          <p className="text-sm text-[#7d7d7d]">Route Compliance Report</p>
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

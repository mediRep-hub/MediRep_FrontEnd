import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "Team Name",
  "MRs",
  "Doctor/Pharmacy Name",
  "Orders",
  "Sales",
  "Achievement %",
];
const Data = [
  [
    "Cardio Aplha",
    <p className="text-primary underline">6</p>,
    <p className="text-primary underline">152</p>,
    <p className="text-primary underline">389</p>,
    <p>
      <span className="text-xs text-[#7d7d7d]">Rs:</span>12,785,100
    </p>,
    "78 %",
  ],

  [
    "Neuro Prime",
    <p className="text-primary underline">4</p>,
    <p className="text-primary underline">98</p>,
    <p className="text-primary underline">245</p>,
    <p>
      <span className="text-xs text-[#7d7d7d]">Rs:</span>8,420,500
    </p>,
    "72 %",
  ],

  [
    "Ortho Max",
    <p className="text-primary underline">7</p>,
    <p className="text-primary underline">184</p>,
    <p className="text-primary underline">410</p>,
    <p>
      <span className="text-xs text-[#7d7d7d]">Rs:</span>15,230,000
    </p>,
    "81 %",
  ],

  [
    "Derma Plus",
    <p className="text-primary underline">3</p>,
    <p className="text-primary underline">76</p>,
    <p className="text-primary underline">198</p>,
    <p>
      <span className="text-xs text-[#7d7d7d]">Rs:</span>5,950,750
    </p>,
    "69 %",
  ],

  [
    "Pedia Care",
    <p className="text-primary underline">5</p>,
    <p className="text-primary underline">121</p>,
    <p className="text-primary underline">305</p>,
    <p>
      <span className="text-xs text-[#7d7d7d]">Rs:</span>9,870,300
    </p>,
    "75 %",
  ],

  [
    "Onco Life",
    <p className="text-primary underline">2</p>,
    <p className="text-primary underline">64</p>,
    <p className="text-primary underline">150</p>,
    <p>
      <span className="text-xs text-[#7d7d7d]">Rs:</span>4,320,900
    </p>,
    "66 %",
  ],
];

export default function TeamPerformanceReport() {
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
      "Team Performance Report",
    );
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Team Performance Report.xlsx");
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
                icon="solar:upload-linear"
                height="20"
                width="20"
                color="#0755E9"
              />
              <p className="text-primary text-base font-medium">Download</p>
            </button>

            <button
              onClick={() => {
                setGenerateReport(true);
              }}
              className="h-[55px] w-full md:w-[180px] bg-primary rounded-[6px] gap-3 cursor-pointer flex justify-center items-center"
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
          <p className="text-sm text-[#7d7d7d]">Team Performance Report</p>
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

import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "Date",
  "MR Name",
  "Doctor/Pharmacy Name",
  "Brick Name",
  "Check in",
  "Check out",
  "Call Duration",
  "Details",
];

export default function DailyCallReport() {
  const [generateReport, setGenerateReport] = useState(false);
  const handleClose = () => {
    setGenerateReport(false);
  };
  const navigate = useNavigate();
  const handleGoTODetails = () => {
    navigate("/dailyCallReport/dailyCallReportingDetail");
  };
  const Data = [
    [
      "Sep 20,2025",
      "Omar Rosser",
      "Jaydon Carder",
      "Canal Road",
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>11:30 AM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>7:30 PM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>2:30 PM</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoTODetails}>
        <Icon icon="iconoir:notes" className="text-[#7d7d7d]" />
        <p>Details</p>
      </div>,
    ],

    [
      "Sep 21,2025",
      "Aiden Brooks",
      "Lucas Henry",
      "Model Town",
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>-</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>-</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>-</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoTODetails}>
        <Icon icon="iconoir:notes" className="text-[#7d7d7d]" />
        <p>Details</p>
      </div>,
    ],

    [
      "Sep 22,2025",
      "Noah Parker",
      "Ethan Miles",
      "Gulberg",
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>10:15 AM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>8:00 PM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>3:45 PM</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoTODetails}>
        <Icon icon="iconoir:notes" className="text-[#7d7d7d]" />
        <p>Details</p>
      </div>,
    ],

    [
      "Sep 23,2025",
      "Mason Lee",
      "Caleb Turner",
      "Johar Town",
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>8:45 AM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>5:30 PM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>12:30 PM</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoTODetails}>
        <Icon icon="iconoir:notes" className="text-[#7d7d7d]" />
        <p>Details</p>
      </div>,
    ],

    [
      "Sep 24,2025",
      "Liam Scott",
      "Daniel Wright",
      "DHA Phase 6",
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>11:00 AM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>9:00 PM</p>
      </div>,
      <div className="flex gap-2 items-center">
        <Icon icon="icon-park-outline:time" className="text-[#7d7d7d]" />
        <p>4:00 PM</p>
      </div>,
      <div className="flex gap-2 items-center" onClick={handleGoTODetails}>
        <Icon icon="iconoir:notes" className="text-[#7d7d7d]" />
        <p>Details</p>
      </div>,
    ],
  ];
  const handleDownloadExcel = () => {
    // Prepare data
    const exportData = Data.map((row) =>
      row.map((cell) => {
        // If JSX element, extract the text
        if (typeof cell === "object" && cell.props) {
          // recursively extract <p> text if needed
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

    // Create worksheet & workbook
    const worksheet = XLSX.utils.aoa_to_sheet([title, ...exportData]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DailyCallReport");

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "DailyCallReport.xlsx");
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
                icon="solar:download-linear"
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
          <p className="text-sm text-[#7d7d7d]">Daily Call Report (DCR)</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white mt-3 rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(59vh-0px)]  overflow-y-auto scrollbar-none"
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

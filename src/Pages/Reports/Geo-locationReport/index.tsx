import { Icon } from "@iconify/react";
import CustomTable from "../../../Components/CustomTable";
import { MonthYearPicker } from "../../../Components/FilterMonthYear";
import { useEffect, useState } from "react";
import ReportFilterModalStatic from "../../../Components/ReportFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const title = [
  "Date",
  "MR Name",
  "Brick Name",
  "Planned Visits",
  "Actual Visits",
  "Deviation",
  "Location",
];
const Data = [
  [
    "Sep 20,2025",
    "Omar Rosser",
    "Canal Road",
    <p className="text-primary underline">18</p>,
    <p className="text-primary underline">09</p>,
    <div className="flex gap-2 items-center">
      <Icon icon="icon-park-outline:dot" color="#34C759" />
      <p>On route</p>
    </div>,
    <p className="text-primary underline">Show</p>,
  ],

  [
    "Sep 21,2025",
    "Aiden Brooks",
    "Gulberg",
    <p className="text-primary underline">22</p>,
    <p className="text-primary underline">11</p>,
    <div className="flex gap-2 items-center">
      <Icon icon="icon-park-outline:dot" color="#FF9500" />
      <p>Delayed</p>
    </div>,
    <p className="text-primary underline">Show</p>,
  ],

  [
    "Sep 22,2025",
    "Liam Scott",
    "DHA Phase 6",
    <p className="text-primary underline">15</p>,
    <p className="text-primary underline">07</p>,
    <div className="flex gap-2 items-center">
      <Icon icon="icon-park-outline:dot" color="#34C759" />
      <p>On route</p>
    </div>,
    <p className="text-primary underline">Show</p>,
  ],

  [
    "Sep 23,2025",
    "Noah Parker",
    "Johar Town",
    <p className="text-primary underline">27</p>,
    <p className="text-primary underline">13</p>,
    <div className="flex gap-2 items-center">
      <Icon icon="icon-park-outline:dot" color="#FF3B30" />
      <p>Cancelled</p>
    </div>,
    <p className="text-primary underline">Show</p>,
  ],

  [
    "Sep 24,2025",
    "Ethan Miles",
    "Model Town",
    <p className="text-primary underline">20</p>,
    <p className="text-primary underline">10</p>,
    <div className="flex gap-2 items-center">
      <Icon icon="icon-park-outline:dot" color="#34C759" />
      <p>On route</p>
    </div>,
    <p className="text-primary underline">Show</p>,
  ],

  [
    "Sep 25,2025",
    "Lucas Henry",
    "Bahria Town",
    <p className="text-primary underline">19</p>,
    <p className="text-primary underline">08</p>,
    <div className="flex gap-2 items-center">
      <Icon icon="icon-park-outline:dot" color="#FF9500" />
      <p>Delayed</p>
    </div>,
    <p className="text-primary underline">Show</p>,
  ],
];

export default function GeoLocationReport() {
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Geo-Location Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Geo-Location Report.xlsx");
  };
  useEffect(() => {
    document.title = "MediRep | Geo-location Report";
  }, []);
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

        <div className="bg-[#E5EBF7] mt-4 rounded-[12px] p-4 2xl:h-[calc(75.7vh-0px)] xl:h-[calc(66vh-0px)] h-auto ">
          <p className="text-sm text-[#7d7d7d]">Geo-Location Report</p>
          <div
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="scroll-smooth bg-white mt-3 rounded-xl 2xl:h-[calc(69vh-0px)] xl:h-[calc(56.5vh-0px)]  overflow-y-auto scrollbar-none"
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
